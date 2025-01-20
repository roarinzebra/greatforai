# AIAO Platform Data Tier Strategy
## Database Architecture for Free and Paid Tiers

### Strategic Overview

Our platform needs to efficiently manage data storage across free and paid tiers while operating within the constraints of free-tier database services during initial development. This requires careful consideration of how we structure and partition our data.

### Core Data Structure

First, let's establish our base tables that will be shared across all tiers. These tables contain essential information needed for basic platform functionality.

```sql
-- Base user management
CREATE TABLE public.users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone,
    tier_status text DEFAULT 'free',
    -- Storing subscription info allows for easy upgrades/downgrades
    subscription_ends_at timestamp with time zone
);

-- Organization management (supports both tiers)
CREATE TABLE public.organizations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    owner_id uuid REFERENCES public.users(id)
);

-- Website registration (base table)
CREATE TABLE public.websites (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid REFERENCES public.organizations(id),
    domain text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    last_scan timestamp with time zone,
    -- Enables different scan frequencies per tier
    scan_frequency interval,
    CONSTRAINT one_domain_per_org UNIQUE (organization_id, domain)
);
```

### Free Tier Data Structure

For free tier users, we implement storage-efficient tables that capture essential metrics while maintaining strict limits:

```sql
-- Free tier analysis results
CREATE TABLE public.free_tier_analysis (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id uuid REFERENCES public.websites(id),
    created_at timestamp with time zone DEFAULT now(),
    -- Store only essential metrics to save space
    basic_seo_score integer,
    accessibility_score integer,
    performance_score integer,
    -- Compressed JSON for detailed data
    summary jsonb NOT NULL,
    -- Automatic cleanup after 30 days
    expires_at timestamp with time zone DEFAULT (now() + interval '30 days'),
    CONSTRAINT free_tier_retention CHECK (
        created_at > (now() - interval '30 days')
    )
);

-- Free tier content nodes (simplified graph data)
CREATE TABLE public.free_tier_nodes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id uuid REFERENCES public.websites(id),
    url text NOT NULL,
    -- Store minimal metadata
    title text,
    type text,
    created_at timestamp with time zone DEFAULT now(),
    -- Limit to recent data only
    CONSTRAINT free_tier_node_retention CHECK (
        created_at > (now() - interval '30 days')
    )
);

-- Free tier relationships (basic linking structure)
CREATE TABLE public.free_tier_relationships (
    source_id uuid REFERENCES public.free_tier_nodes(id),
    target_id uuid REFERENCES public.free_tier_nodes(id),
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (source_id, target_id),
    -- Enforce same website constraint
    CONSTRAINT same_website_relationship CHECK (
        (SELECT website_id FROM public.free_tier_nodes WHERE id = source_id) =
        (SELECT website_id FROM public.free_tier_nodes WHERE id = target_id)
    )
);
```

### Paid Tier Data Structure

Paid tier tables offer expanded capabilities and longer data retention:

```sql
-- Paid tier analysis results
CREATE TABLE public.paid_tier_analysis (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id uuid REFERENCES public.websites(id),
    created_at timestamp with time zone DEFAULT now(),
    -- Comprehensive analysis data
    seo_analysis jsonb,
    accessibility_analysis jsonb,
    performance_analysis jsonb,
    ai_readiness_score jsonb,
    content_quality_metrics jsonb,
    -- Historical tracking
    previous_analysis_id uuid REFERENCES paid_tier_analysis(id),
    -- No automatic expiration
    archived boolean DEFAULT false
);

-- Paid tier content nodes (full graph data)
CREATE TABLE public.paid_tier_nodes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id uuid REFERENCES public.websites(id),
    url text NOT NULL,
    -- Rich metadata
    title text,
    description text,
    content_type text,
    headers jsonb,
    metadata jsonb,
    -- AI-specific data
    ai_interaction_metrics jsonb,
    semantic_context jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Paid tier relationships (rich connection data)
CREATE TABLE public.paid_tier_relationships (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id uuid REFERENCES public.paid_tier_nodes(id),
    target_id uuid REFERENCES public.paid_tier_nodes(id),
    type text NOT NULL,
    -- Rich relationship metadata
    properties jsonb,
    weight float,
    semantic_strength float,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Paid tier AI agent interactions
CREATE TABLE public.paid_tier_ai_interactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id uuid REFERENCES public.paid_tier_nodes(id),
    interaction_type text NOT NULL,
    agent_signature jsonb,
    interaction_data jsonb,
    created_at timestamp with time zone DEFAULT now()
);
```

### Data Management Functions

Let's implement functions to handle tier-specific operations:

```sql
-- Function to enforce free tier limits
CREATE OR REPLACE FUNCTION check_free_tier_limits()
RETURNS trigger AS $$
BEGIN
    -- Check if organization is on free tier
    IF EXISTS (
        SELECT 1 
        FROM public.websites w
        JOIN public.organizations o ON w.organization_id = o.id
        JOIN public.users u ON o.owner_id = u.id
        WHERE w.id = NEW.website_id 
        AND u.tier_status = 'free'
    ) THEN
        -- Enforce node limit per website
        IF (
            SELECT COUNT(*) 
            FROM public.free_tier_nodes 
            WHERE website_id = NEW.website_id
        ) >= 1000 THEN
            RAISE EXCEPTION 'Free tier node limit exceeded';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce limits
CREATE TRIGGER enforce_free_tier_limits
BEFORE INSERT ON public.free_tier_nodes
FOR EACH ROW EXECUTE FUNCTION check_free_tier_limits();
```

### Tier Migration Strategy

When users upgrade from free to paid tier, we need to migrate their data:

```typescript
async function migrateToPaidTier(websiteId: string) {
  // Begin transaction
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Migrate nodes
    await client.query(`
      INSERT INTO paid_tier_nodes (
        website_id, url, title, content_type, 
        metadata, created_at
      )
      SELECT 
        website_id, url, title, type,
        jsonb_build_object('migrated_from', 'free_tier'),
        created_at
      FROM free_tier_nodes
      WHERE website_id = $1
    `, [websiteId]);

    // Migrate relationships with enhanced properties
    await client.query(`
      INSERT INTO paid_tier_relationships (
        source_id, target_id, type, 
        properties, created_at
      )
      SELECT 
        r.source_id, r.target_id, r.type,
        jsonb_build_object('migrated_from', 'free_tier'),
        r.created_at
      FROM free_tier_relationships r
      WHERE r.source_id IN (
        SELECT id FROM free_tier_nodes 
        WHERE website_id = $1
      )
    `, [websiteId]);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
```

### Data Retention Policies

```typescript
class DataRetentionManager {
  // Free tier data cleanup
  async cleanupFreeTierData() {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Remove expired analysis results
      await client.query(`
        DELETE FROM free_tier_analysis
        WHERE expires_at < NOW()
      `);
      
      // Remove old nodes and their relationships
      await client.query(`
        WITH old_nodes AS (
          DELETE FROM free_tier_nodes
          WHERE created_at < NOW() - INTERVAL '30 days'
          RETURNING id
        )
        DELETE FROM free_tier_relationships
        WHERE source_id IN (SELECT id FROM old_nodes)
           OR target_id IN (SELECT id FROM old_nodes)
      `);
      
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  // Paid tier data archiving
  async archivePaidTierData(websiteId: string) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Archive old analysis results
      await client.query(`
        UPDATE paid_tier_analysis
        SET archived = true
        WHERE website_id = $1
          AND created_at < NOW() - INTERVAL '1 year'
      `, [websiteId]);
      
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
```

### Feature Differentiation Summary

Free Tier Limitations:
- 30-day data retention
- Basic metadata only
- Limited relationship tracking
- Simple analysis metrics
- Maximum 1000 nodes per website
- Basic SEO and performance scores

Paid Tier Features:
- Unlimited data retention
- Rich metadata and content analysis
- Complex relationship tracking
- AI interaction monitoring
- Advanced analysis metrics
- Historical trend analysis
- No node count limitations

This tiered data structure allows us to:
1. Operate efficiently within free database tier constraints during development
2. Provide clear value differentiation between free and paid tiers
3. Enable smooth upgrades from free to paid tier
4. Maintain performance and storage efficiency
5. Scale effectively as our user base grows

The structure can be extended in the future to support additional tier levels or features while maintaining backward compatibility with existing data.

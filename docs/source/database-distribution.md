# Database Distribution Strategy: Supabase vs Neo4j

This document outlines which data should be stored in each database system based on their strengths and our application needs.

## Supabase Data Tables

### User Management
```sql
-- User profiles and authentication
create table public.user_profiles (
    id uuid references auth.users primary key,
    email text unique not null,
    organization_name text,
    subscription_tier text default 'free',
    settings jsonb default '{}'::jsonb
);

-- Subscription and billing
create table public.subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.user_profiles(id),
    plan_type text not null,
    status text not null,
    current_period_end timestamp with time zone
);
```

### Website Management
```sql
-- Website registration and settings
create table public.websites (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.user_profiles(id),
    domain text not null,
    settings jsonb default '{}'::jsonb,
    last_scan timestamp with time zone
);

-- Analysis queue
create table public.analysis_queue (
    id uuid primary key default uuid_generate_v4(),
    website_id uuid references public.websites(id),
    status text not null,
    priority integer default 0,
    created_at timestamp with time zone default now()
);
```

### Analytics and Metrics
```sql
-- Usage analytics
create table public.usage_metrics (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.user_profiles(id),
    metric_type text not null,
    value integer not null,
    recorded_at timestamp with time zone default now()
);

-- Performance metrics
create table public.performance_metrics (
    id uuid primary key default uuid_generate_v4(),
    website_id uuid references public.websites(id),
    metric_type text not null,
    value jsonb not null,
    recorded_at timestamp with time zone default now()
);
```

## Neo4j Data Models

### Knowledge Graph
```cypher
// Content nodes
CREATE (n:ContentNode {
    id: string,
    websiteId: string,
    url: string,
    type: string,
    properties: map
})

// Relationships
CREATE (n1:ContentNode)-[:LINKS_TO {
    type: string,
    weight: float,
    properties: map
}]->(n2:ContentNode)
```

### Content Relationships
```cypher
// Semantic relationships
CREATE (n1:ContentNode)-[:RELATES_TO {
    similarity: float,
    context: string
}]->(n2:ContentNode)

// Hierarchical structure
CREATE (n1:ContentNode)-[:CONTAINS {
    order: integer,
    importance: float
}]->(n2:ContentNode)
```

### AI Agent Patterns
```cypher
// Interaction patterns
CREATE (p:Pattern {
    id: string,
    websiteId: string,
    type: string,
    confidence: float,
    properties: map
})

// Pattern relationships
CREATE (p1:Pattern)-[:LEADS_TO {
    frequency: integer,
    significance: float
}]->(p2:Pattern)
```

## Data Distribution Logic

### Store in Supabase:
1. User data and authentication
2. Subscription and billing information
3. Website registration and settings
4. Analysis queue and status
5. Usage metrics and analytics
6. Performance measurements
7. Basic analysis results

### Store in Neo4j:
1. Content relationship graphs
2. Navigation patterns
3. Semantic relationships
4. AI agent interaction patterns
5. Content hierarchies
6. Knowledge graph structures
7. Pattern recognition results

## Synchronization Patterns

### Supabase to Neo4j
```typescript
async function syncAnalysisToGraph(websiteId: string) {
  // Fetch analysis results from Supabase
  const analysis = await supabase
    .from('analysis_results')
    .select('*')
    .eq('website_id', websiteId);

  // Transform and store in Neo4j
  await neo4j.executeWrite(tx => 
    tx.run(`
      MATCH (w:Website {id: $websiteId})
      WITH w
      UNWIND $analysisData as data
      MERGE (n:ContentNode {id: data.id})
      MERGE (w)-[:CONTAINS]->(n)
      SET n += data.properties
    `, {
      websiteId,
      analysisData: analysis
    })
  );
}
```

### Neo4j to Supabase
```typescript
async function syncGraphInsights(websiteId: string) {
  // Get graph insights from Neo4j
  const insights = await neo4j.executeRead(tx =>
    tx.run(`
      MATCH (w:Website {id: $websiteId})-[:CONTAINS]->(n:ContentNode)
      RETURN n
    `, { websiteId })
  );

  // Store summary in Supabase
  await supabase
    .from('graph_insights')
    .upsert({
      website_id: websiteId,
      insights: transformInsights(insights),
      updated_at: new Date()
    });
}
```

## Query Patterns

### Combined Queries via Apollo
```typescript
const resolvers = {
  Website: {
    async analysisResults(parent, _, { dataSources }) {
      // Get basic analysis from Supabase
      const basicAnalysis = await dataSources.supabase
        .from('analysis_results')
        .select('*')
        .eq('website_id', parent.id);

      // Enhance with graph insights from Neo4j
      const graphInsights = await dataSources.neo4j
        .executeRead(tx =>
          tx.run(`
            MATCH (w:Website {id: $websiteId})-[:CONTAINS]->(n)
            RETURN n
          `, { websiteId: parent.id })
        );

      // Combine the results
      return enhanceAnalysis(basicAnalysis, graphInsights);
    }
  }
};
```

This distribution strategy maximizes the strengths of each database while maintaining data consistency through Apollo GraphQL. Supabase handles the relational and real-time aspects, while Neo4j manages the complex relationships and pattern recognition.

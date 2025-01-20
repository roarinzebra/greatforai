# Neo4j Database Management Strategy Across AIAO Platform Tiers

## Understanding Neo4j in Our Architecture

Our platform uses Neo4j to store and analyze website content relationships and AI agent interaction patterns. Managing this graph database across free and paid tiers requires careful consideration of storage, query patterns, and data isolation. Let's explore how we implement this effectively.

## Data Model Implementation

### Base Graph Structure

We start with a foundational data model that serves both tiers while enabling different capabilities:

```cypher
// Base node structure with tier-aware properties
CREATE CONSTRAINT website_unique_id ON (w:Website) ASSERT w.id IS UNIQUE;
CREATE CONSTRAINT content_unique_id ON (c:ContentNode) ASSERT c.id IS UNIQUE;

// Website node structure
CREATE (w:Website {
    id: string,
    domain: string,
    tier: string,           // 'free' or 'paid'
    created_at: datetime,
    max_nodes: integer      // tier-specific limit
})

// Content node structure with tier-aware attributes
CREATE (c:ContentNode {
    id: string,
    url: string,
    website_id: string,     // reference to parent website
    tier: string,           // matches website tier
    created_at: datetime,
    last_accessed: datetime,
    basic_properties: map,  // available to all tiers
    advanced_properties: map // null for free tier
})
```

### Tier-Specific Relationship Types

```cypher
// Free tier relationships - basic linking only
CREATE (n1:ContentNode)-[:LINKS_TO {
    created_at: datetime,
    type: string            // basic relationship type
}]->(n2:ContentNode)

// Paid tier relationships - enhanced metadata
CREATE (n1:ContentNode)-[:LINKS_TO {
    created_at: datetime,
    type: string,
    weight: float,
    semantic_score: float,
    ai_interaction_count: integer,
    metadata: map
}]->(n2:ContentNode)

// Paid tier exclusive relationships
CREATE (n1:ContentNode)-[:SEMANTIC_RELATION {
    similarity: float,
    context: string,
    created_at: datetime
}]->(n2:ContentNode)

CREATE (n1:ContentNode)-[:AI_INTERACTION_PATH {
    frequency: integer,
    pattern_type: string,
    last_observed: datetime
}]->(n2:ContentNode)
```

## Tier Management Implementation

### Data Access Layer

```typescript
class Neo4jTierManager {
  constructor(private readonly driver: Driver) {}

  // Create website node with tier-specific configuration
  async createWebsiteNode(websiteData: WebsiteInput, tier: 'free' | 'paid'): Promise<string> {
    const session = this.driver.session();
    try {
      const result = await session.executeWrite(tx => tx.run(`
        CREATE (w:Website {
          id: $id,
          domain: $domain,
          tier: $tier,
          created_at: datetime(),
          max_nodes: $maxNodes
        })
        RETURN w.id as id
        `, {
          id: uuidv4(),
          domain: websiteData.domain,
          tier,
          // Set tier-specific node limits
          maxNodes: tier === 'free' ? 1000 : -1
        })
      );
      return result.records[0].get('id');
    } finally {
      await session.close();
    }
  }

  // Add content node with tier-specific properties
  async addContentNode(websiteId: string, nodeData: ContentNodeInput): Promise<void> {
    const session = this.driver.session();
    try {
      await session.executeWrite(async tx => {
        // First check website tier and node limits
        const websiteInfo = await tx.run(`
          MATCH (w:Website {id: $websiteId})
          RETURN w.tier as tier, w.max_nodes as maxNodes,
                 size((w)<-[:BELONGS_TO]-(:ContentNode)) as currentNodes
        `, { websiteId });

        const website = websiteInfo.records[0];
        const tier = website.get('tier');
        const maxNodes = website.get('maxNodes');
        const currentNodes = website.get('currentNodes');

        // Enforce free tier limits
        if (tier === 'free' && maxNodes !== -1 && currentNodes >= maxNodes) {
          throw new Error('Free tier node limit reached');
        }

        // Create node with tier-specific properties
        await tx.run(`
          MATCH (w:Website {id: $websiteId})
          CREATE (c:ContentNode {
            id: $nodeId,
            url: $url,
            website_id: $websiteId,
            tier: w.tier,
            created_at: datetime(),
            last_accessed: datetime(),
            basic_properties: $basicProps,
            advanced_properties: CASE w.tier 
              WHEN 'paid' THEN $advancedProps 
              ELSE null END
          })
          CREATE (c)-[:BELONGS_TO]->(w)
        `, {
          nodeId: uuidv4(),
          websiteId,
          url: nodeData.url,
          basicProps: this.getBasicProperties(nodeData),
          advancedProps: this.getAdvancedProperties(nodeData)
        });
      });
    } finally {
      await session.close();
    }
  }

  // Tier-specific query execution
  async executeQuery(websiteId: string, queryType: string): Promise<any> {
    const session = this.driver.session();
    try {
      // First check website tier
      const tierInfo = await session.executeRead(tx => tx.run(`
        MATCH (w:Website {id: $websiteId})
        RETURN w.tier as tier
      `, { websiteId }));

      const tier = tierInfo.records[0].get('tier');

      // Execute tier-appropriate query
      return await session.executeRead(tx => tx.run(
        this.getTierSpecificQuery(queryType, tier),
        { websiteId }
      ));
    } finally {
      await session.close();
    }
  }

  private getTierSpecificQuery(queryType: string, tier: string): string {
    const queries = {
      basicAnalysis: `
        MATCH (w:Website {id: $websiteId})<-[:BELONGS_TO]-(n:ContentNode)
        RETURN n.url, n.basic_properties
        LIMIT ${tier === 'free' ? 1000 : 10000}
      `,
      advancedAnalysis: tier === 'paid' ? `
        MATCH (w:Website {id: $websiteId})<-[:BELONGS_TO]-(n:ContentNode)
        OPTIONAL MATCH (n)-[r:SEMANTIC_RELATION]->(related:ContentNode)
        RETURN n.url, n.advanced_properties, collect(related) as relationships
      ` : `
        MATCH (w:Website {id: $websiteId})<-[:BELONGS_TO]-(n:ContentNode)
        RETURN n.url, null as advanced_properties, [] as relationships
      `
    };
    return queries[queryType];
  }
}
```

## Data Retention and Cleanup

```typescript
class Neo4jRetentionManager {
  constructor(private readonly driver: Driver) {}

  // Implement tier-specific data retention
  async cleanupOldData(): Promise<void> {
    const session = this.driver.session();
    try {
      await session.executeWrite(tx => tx.run(`
        // Free tier: Remove nodes older than 30 days
        MATCH (w:Website {tier: 'free'})<-[:BELONGS_TO]-(n:ContentNode)
        WHERE datetime(n.created_at) < datetime() - duration('P30D')
        DETACH DELETE n

        // Paid tier: Archive nodes older than 1 year
        MATCH (w:Website {tier: 'paid'})<-[:BELONGS_TO]-(n:ContentNode)
        WHERE datetime(n.created_at) < datetime() - duration('P1Y')
        SET n.archived = true
      `));
    } finally {
      await session.close();
    }
  }

  // Handle tier upgrade process
  async upgradeTierData(websiteId: string): Promise<void> {
    const session = this.driver.session();
    try {
      await session.executeWrite(async tx => {
        // Update website tier
        await tx.run(`
          MATCH (w:Website {id: $websiteId})
          SET w.tier = 'paid',
              w.max_nodes = -1
        `, { websiteId });

        // Enable advanced properties for existing nodes
        await tx.run(`
          MATCH (w:Website {id: $websiteId})<-[:BELONGS_TO]-(n:ContentNode)
          SET n.tier = 'paid',
              n.advanced_properties = {}
        `, { websiteId });

        // Create advanced relationships
        await tx.run(`
          MATCH (w:Website {id: $websiteId})<-[:BELONGS_TO]-(n:ContentNode)
          MATCH (n)-[r:LINKS_TO]->(m:ContentNode)
          SET r += {
            weight: 1.0,
            semantic_score: 0.0,
            ai_interaction_count: 0
          }
        `, { websiteId });
      });
    } finally {
      await session.close();
    }
  }
}
```

## Query Performance Optimization

```typescript
class Neo4jQueryOptimizer {
  // Implement tier-specific indexing
  async createTierSpecificIndexes(): Promise<void> {
    const session = this.driver.session();
    try {
      await session.executeWrite(tx => tx.run(`
        // Common indexes for both tiers
        CREATE INDEX content_url IF NOT EXISTS FOR (n:ContentNode) ON (n.url);
        CREATE INDEX website_domain IF NOT EXISTS FOR (n:Website) ON (n.domain);

        // Paid tier specific indexes
        CREATE INDEX semantic_score IF NOT EXISTS FOR ()-[r:SEMANTIC_RELATION]-() ON (r.similarity);
        CREATE INDEX ai_interaction IF NOT EXISTS FOR ()-[r:AI_INTERACTION_PATH]-() ON (r.frequency);
      `));
    } finally {
      await session.close();
    }
  }

  // Configure tier-specific query timeouts
  async configureTierTimeouts(tier: 'free' | 'paid'): Promise<void> {
    const session = this.driver.session();
    try {
      await session.executeWrite(tx => tx.run(`
        CALL dbms.setConfigValue('dbms.transaction.timeout',
          $timeout
        )
      `, {
        timeout: tier === 'free' ? '5s' : '30s'
      }));
    } finally {
      await session.close();
    }
  }
}
```

## Key Differentiation Points

### Free Tier Limitations:
1. Maximum of 1000 nodes per website
2. Basic relationship types only
3. 30-day data retention
4. Limited query complexity
5. Shorter query timeouts
6. Basic property storage only

### Paid Tier Features:
1. Unlimited nodes
2. Advanced relationship types with metadata
3. Extended data retention with archiving
4. Complex query support
5. Longer query timeouts
6. Rich property storage
7. AI interaction tracking
8. Semantic relationship analysis

This tiered approach to Neo4j management allows us to:
1. Control resource usage effectively
2. Provide clear value differentiation
3. Maintain performance for all users
4. Enable smooth tier transitions
5. Scale efficiently with user growth

The implementation includes safeguards against resource abuse while maintaining upgrade paths that preserve existing data and relationships. This structure can be extended to support additional tier levels or features as needed.

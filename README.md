# Query The Graph

Example how to query The Graph with Graph Client.

Merge these two subgraphs:

- https://thegraph.com/hosted-service/subgraph/graphprotocol/graph-network-mainnet
- https://thegraph.com/hosted-service/subgraph/graphprotocol/graph-network-arbitrum

## Publish a subgraph locally

```bash
graph auth http://localhost:3000/api/deploy clp9yeu160001m79bxrs8seo4
graph deploy --node http://localhost:3000/api/deploy subgraph-name
```

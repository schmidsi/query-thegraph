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

## Notes

The Graph Contracts on Arbitrum Sepolia: https://sepolia-explorer.arbitrum.io/address/0x3133948342F35b8699d8F94aeE064AbB76eDe965

https://sepolia.arbiscan.io/address/0x3133948342F35b8699d8F94aeE064AbB76eDe965#code

Implementation: https://sepolia.arbiscan.io/address/0xb3fc82bcc8c793252460e574a2d604dce0f06d29#code

### Example version file

https://api.thegraph.com/ipfs/api/v0/cat?arg=QmXXMXpN9FLe6ESqXEMhZnAAX1ekUP4Go86iWTc7tW6SyZ

```json
{ "label": "v0.0.1", "description": null }
```

### Example Subgraph JSON

```json
{
  "description": null,
  "image": "ipfs://QmX5XLTieWrppz9g85UMKUqvdMsEhMBWjpKD4yfFRWgWPF",
  "subgraphImage": "https://api.thegraph.com/ipfs/api/v0/cat?arg=QmdSeSQ3APFjLktQY3aNVu3M5QXPfE9ZRK5LqgghRgB7L9",
  "displayName": "Radiant Arbitrum dLP Price",
  "name": "Radiant Arbitrum dLP Price Subgraph",
  "codeRepository": null,
  "website": null,
  "categories": null
}
```

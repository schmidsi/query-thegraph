// import { Resolvers } from "../.graphclient";

const chains = ["arbitrum", "mainnet"];

function isBigIntable(x: any) {
  try {
    BigInt(x);
    return true;
  } catch (error) {
    return false;
  }
}

export const resolvers = {
  //   Subgraph: {
  //     // chainName can exist already in root as we pass it in the other resolver
  //     deployedChain: (root: any, args: any, context: any, info: any) => {
  //       console.log({ root, args, context, info });
  //       return root.chainName || context.chainName || "bentobox-avalanche"; // The value we provide in the config
  //     },
  //   },
  Query: {
    crossSubgraphs: async (root: any, args: any, context: any, info: any) => {
      const results = await Promise.all(
        chains.map(source =>
          context[`graph-network-${source}`].Query.subgraphs({
            root,
            args,
            context,
            info,
          }).then((subgraphs: any) => subgraphs.map((subgraph: any) => ({ ...subgraph, deployedChain: source }))),
        ),
      ).then(allSubgraphs => allSubgraphs.flat());

      if (args.orderBy && args.orderBy.indexOf("__") == -1) {
        results.sort((a: any, b: any) => {
          const direction = args.orderDirection || "asc";

          // This is super hacky, but good enough for now
          if (isBigIntable(a[args.orderBy]) && isBigIntable(b[args.orderBy])) {
            if (direction == "asc") {
              return BigInt(a[args.orderBy]) > BigInt(b[args.orderBy]) ? 1 : -1;
            } else {
              return BigInt(a[args.orderBy]) < BigInt(b[args.orderBy]) ? 1 : -1;
            }
          } else {
            if (direction == "asc") {
              return a[args.orderBy] > b[args.orderBy] ? 1 : -1;
            } else {
              return a[args.orderBy] < b[args.orderBy] ? 1 : -1;
            }
          }
        });
      }

      return results;
    },
  },
};

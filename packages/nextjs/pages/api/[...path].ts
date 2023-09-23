import { createYoga } from "graphql-yoga";
import type { NextApiRequest, NextApiResponse } from "next";
import { remoteExecutor, skipValidate } from "~~/graphclient/cacher/graphql";

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

// Inspired by: https://github.com/saihaj/the-subgraph-cacher
export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.query);

  // const API_KEY = "780fd47eecb142d5d7c5a86c3769012b";

  return createYoga({
    plugins: [skipValidate, remoteExecutor],
    parserAndValidationCache: true,
    maskedErrors: false,
    landingPage: false,
    graphqlEndpoint: "/api/:id/:version",
    context: {
      endpoint: "https://api.thegraph.com/subgraphs/name/graphprotocol/graph-network-mainnet",
    },
  })(req, res);
};

// export default createYoga<{
//   req: NextApiRequest;
//   res: NextApiResponse;
// }>({
//   schema,
//   // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
//   graphqlEndpoint: "/api/graphql",
// });

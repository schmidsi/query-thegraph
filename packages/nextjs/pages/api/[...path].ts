import { createYoga } from "graphql-yoga";
import type { NextApiRequest, NextApiResponse } from "next";
import { SubgraphDetailDocument, execute } from "~~/.graphclient";
import { remoteExecutor, skipValidate } from "~~/graphclient/cacher/graphql";

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

const API_KEY = process.env.API_KEY;

const getEndpoint = (chain: string, ipfsHash: string) => {
  return `https://${
    chain === "ARBITRUM" ? "gateway-arbitrum.network" : "gateway"
  }.thegraph.com/api/${API_KEY}/deployments/id/${ipfsHash}`;
};

// Inspired by: https://github.com/saihaj/the-subgraph-cacher
export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.query);

  const [chainId, version] = req.query.path as string[];
  const [chain, id] = chainId.split("-");

  //

  const result = await execute(SubgraphDetailDocument, { chain, id });
  const ipfsHash = result?.data?.subgraphDetail?.currentVersion.subgraphDeployment.ipfsHash;
  const endpoint = getEndpoint(chain, ipfsHash);

  console.log(ipfsHash, endpoint, version);

  return createYoga({
    plugins: [skipValidate, remoteExecutor],
    parserAndValidationCache: true,
    maskedErrors: false,
    landingPage: false,
    graphqlEndpoint: "/api/:id/:version",
    context: {
      endpoint,
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

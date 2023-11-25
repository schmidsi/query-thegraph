import { ExecutionResult } from "graphql";
import { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";
import { SubgraphsDocument, SubgraphsQuery, execute } from "~~/.graphclient";
import prisma from "~~/utils/prisma";

const generateSlug = async (name: string) => {
  let slugCandidate = slugify(name, { lower: true, strict: true });

  while (true) {
    const existingEntry = await prisma.subgraph.findFirst({
      where: { slug: slugCandidate },
    });

    if (existingEntry) {
      const [candidate, number] = slugCandidate.split("_");

      slugCandidate = `${candidate}_${parseInt(number || "0") + 1}`;
    } else {
      return slugCandidate;
    }
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result: ExecutionResult<SubgraphsQuery> = await execute(
    SubgraphsDocument,
    {},
  );

  // This is inefficient, but good for now
  for (const subgraph of result.data?.crossSubgraphs || []) {
    console.log(subgraph);

    const existingEntry = await prisma.subgraph.findFirst({
      where: { networkId: subgraph.id },
    });

    const data = {
      networkId: subgraph.id,
      name: subgraph.displayName,
      displayName: subgraph.displayName,
      slug: await generateSlug(subgraph.displayName || subgraph.id),
      deployed: true,
      managed: false,
      gone: false,
      codeRepository: subgraph.codeRepository,
      website: subgraph.website,
      creatorAddress: subgraph.creatorAddress,
      signalledTokens: subgraph.currentSignalledTokens,
      deployedChain: subgraph.deployedChain,
      categories: subgraph.categories.map(category => category.category.id),
      description: subgraph.description,
      imageURI: subgraph.image,
    };

    if (existingEntry) {
      await prisma.subgraph.update({
        where: { id: existingEntry.id },
        data,
      });
    } else {
      await prisma.subgraph.create({
        data,
      });
    }
  }

  console.log(result);
  res.status(200).json(result);
}

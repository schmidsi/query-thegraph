import { NextApiRequest, NextApiResponse } from "next";
import getManifestAsJSON from "~~/utils/ipfs/getManifestAsJSON";
import uploadObject from "~~/utils/ipfs/uploadObject";
import prisma from "~~/utils/prisma";
import createPublishSubgraphTransaction from "~~/utils/safe/createPublishSubgraphTransaction";
import deploySafe from "~~/utils/safe/deploySafe";

const DEFAULT_IPFS_URL = "https://api.thegraph.com/ipfs/api/v0" as const;

/* TODOs:
- [ ] Proper JSON RPC responses: https://en.wikipedia.org/wiki/JSON-RPC
*/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.headers); // Log all request headers
  /* example headers:
  {
    'content-length': '203',
    'content-type': 'application/json; charset=utf-8',
    accept: 'application/json',
    'user-agent': 'jayson-4.0.0',
    authorization: 'Bearer clp9x4oxo0001lwaq95q9qtmt',
    host: 'localhost:3000',
    connection: 'close'
  }
  */
  console.log(req.body);
  /* example body:
  {
    method: 'subgraph_deploy',
    jsonrpc: '2.0',
    params: {
      name: 'subgraph-name',
      ipfs_hash: 'QmcUrvLJ4piwBxhUiQEPsdxAkj124cykQ5ZJeE428XoePt',
      version_label: '1'
    },
    id: '612174a6-6861-4a63-9b8e-b905caa0dd03'
  }
  */

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const user = await prisma.user.findUnique({ where: { apiKey: token } });

  if (!user) {
    console.log("Invalid token", token);
    return res.status(401).json({ message: "Invalid token" });
  }

  if (req.body.method !== "subgraph_deploy") {
    console.log("invalid method");
    return res.status(400).json({ message: "Invalid method" });
  }

  const subgraph = await prisma.subgraph.upsert({
    where: { slug: req.body.params.name },
    update: {},
    create: { slug: req.body.params.name, user: { connect: { id: user.id } } },
  });

  const existingVersion = await prisma.subgraphVersion.findFirst({
    where: { subgraphId: subgraph.id, label: req.body.params.version_label },
  });

  if (existingVersion) {
    // TODO: Automatically count up
    console.log("Version already exists");
    return res.status(400).json({ message: "Version already exists" });
  }

  const version = await prisma.subgraphVersion.create({
    data: {
      subgraph: { connect: { id: subgraph.id } },
      label: req.body.params.version_label,
      ipfsHash: req.body.params.ipfs_hash,
    },
  });

  console.log({ version, DEFAULT_IPFS_URL });

  if (!user.safeAddress) {
    const { safeAddress } = await deploySafe();
    await prisma.safe.create({
      data: { address: safeAddress, owners: { connect: { id: user.id } } },
    });

    console.log("New Safe deployed:", safeAddress);
  }

  const safe = await prisma.safe.findUnique({ where: { address: user.safeAddress! } });

  console.log({ safe });

  const deploymentId = req.body.params.ipfs_hash;
  const name = req.body.params.name;
  const mainfestJSON = await getManifestAsJSON(deploymentId);
  const description = mainfestJSON.description || name;

  const versionMetadata = {
    label: req.body.params.version_label,
    description: description,
  };

  const subgraphMetadata = {
    description,
    image: null, // "ipfs://QmX5XLTieWrppz9g85UMKUqvdMsEhMBWjpKD4yfFRWgWPF",
    subgraphImage: null, // "https://api.thegraph.com/ipfs/api/v0/cat?arg=QmdSeSQ3APFjLktQY3aNVu3M5QXPfE9ZRK5LqgghRgB7L9",
    displayName: name,
    name,
    codeRepository: null,
    website: null,
    categories: null,
  };

  const versionMetadataCID = await uploadObject(versionMetadata);
  const subgraMetadataCID = await uploadObject(subgraphMetadata);

  await createPublishSubgraphTransaction(safe!.address!, deploymentId, versionMetadataCID, subgraMetadataCID);

  res.status(200).json({ message: "Request headers logged successfully" });
}

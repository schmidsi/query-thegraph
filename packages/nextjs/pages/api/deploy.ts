import { NextApiRequest, NextApiResponse } from "next";
import prisma from "~~/utils/prisma";

const DEFAULT_IPFS_URL = "https://api.thegraph.com/ipfs/api/v0" as const;

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

  res.status(200).json({ message: "Request headers logged successfully" });
}

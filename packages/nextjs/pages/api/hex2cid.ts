import bs58 from "bs58";
import { Buffer } from "buffer";
// import { create } from "kubo-rpc-client";
import { NextApiRequest, NextApiResponse } from "next";

// const DEFAULT_IPFS_URL = "https://api.thegraph.com/ipfs/api/v0" as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const hexString = req.query.hexString as string;
  if (!hexString) {
    res.status(400).json({ error: "Missing hexString parameter" });
    return;
  }

  const qm = Buffer.from([0x12, 0x20]);

  const bytes = Buffer.from(hexString, "hex");

  const combined = Buffer.concat([qm, bytes]);

  const cid = bs58.encode(combined);

  res.status(200).json({ cid });
}

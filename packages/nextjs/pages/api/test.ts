import { create } from "kubo-rpc-client";
import { NextApiRequest, NextApiResponse } from "next";

const DEFAULT_IPFS_URL = "https://api.thegraph.com/ipfs/api/v0" as const;

async function asyncIterableToString(iterable: AsyncIterable<Uint8Array>): Promise<string> {
  let result = "";
  const decoder = new TextDecoder();

  for await (const chunk of iterable) {
    result += decoder.decode(chunk);
  }

  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle the API request here
  const client = create({ url: DEFAULT_IPFS_URL });

  const data = client.get("QmcUrvLJ4piwBxhUiQEPsdxAkj124cykQ5ZJeE428XoePt");

  const decoded = await asyncIterableToString(data);

  console.log(data, decoded);

  res.status(200).json({ message: "Hello from the API route!" });
}

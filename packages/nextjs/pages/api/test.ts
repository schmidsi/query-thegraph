import { create } from "kubo-rpc-client";
import { NextApiRequest, NextApiResponse } from "next";

const DEFAULT_IPFS_URL = "https://api.thegraph.com/ipfs/api/v0" as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle the API request here
  const client = create({ url: DEFAULT_IPFS_URL });

  console.log(client);

  const response = await fetch(
    "https://api.thegraph.com/ipfs/api/v0/cat?arg=QmcUrvLJ4piwBxhUiQEPsdxAkj124cykQ5ZJeE428XoePt",
  );

  const data = await response.text();

  console.log(data);

  const added = await client.add("test");

  console.log(added);

  // const data = client.get("QmcUrvLJ4piwBxhUiQEPsdxAkj124cykQ5ZJeE428XoePt");

  // const decoded = await asyncIterableToString(data);

  // console.log(data, decoded);

  res.status(200).json({ yaml: data });
}

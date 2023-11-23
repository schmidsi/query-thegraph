import { DEFAULT_IPFS_URL } from "../consts";
import { create } from "kubo-rpc-client";

const uploadObject = async (object: any) => {
  const client = create({ url: DEFAULT_IPFS_URL });
  const stringified = JSON.stringify(object);
  const cid = await client.add(stringified);
  return cid.cid.toString();
};

export default uploadObject;

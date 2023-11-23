import { DEFAULT_IPFS_URL } from "../consts";
import * as yaml from "js-yaml";

const getManifestAsJSON = async (deploymentId: string): Promise<any> => {
  const response = await fetch(DEFAULT_IPFS_URL + "/cat?arg=" + deploymentId);
  const data = await response.text();
  const parsed = yaml.load(data);
  return parsed;
};

export default getManifestAsJSON;

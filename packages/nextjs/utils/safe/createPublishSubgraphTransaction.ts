import GNS from "../abis/GNS.json";
import ipfsHexHash from "../ipfs/ipfsHexHash";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import { ethers } from "ethers";

const createPublishSubgraphTransaction = async (
  safeAddress: string,
  deploymentId: string,
  versionMetadata: string,
  subgraphMetadata: string,
) => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!);
  const contract = new ethers.Contract(process.env.GNS_ADDRESS!, GNS, provider);
  const manager = new ethers.Wallet(process.env.MANAGER_PRIVATE_KEY!, provider);

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: manager,
  });

  const data = contract.interface.encodeFunctionData("publishNewSubgraph", [
    ipfsHexHash(deploymentId),
    ipfsHexHash(versionMetadata),
    ipfsHexHash(subgraphMetadata),
  ]);

  const safeTransactionData: SafeTransactionDataPartial = {
    to: process.env.GNS_ADDRESS!,
    data,
    value: "0",
  };

  const safeSdk = await Safe.create({ ethAdapter, safeAddress });
  const safeTransaction = await safeSdk.createTransaction({ safeTransactionData });
  const txResponse = await safeSdk.executeTransaction(safeTransaction);
  console.log(txResponse);
  const awaited = await txResponse.transactionResponse?.wait();
  console.log(awaited);
};

export default createPublishSubgraphTransaction;

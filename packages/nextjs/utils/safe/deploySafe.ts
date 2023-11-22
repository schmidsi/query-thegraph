import { EthersAdapter, SafeAccountConfig, SafeFactory } from "@safe-global/protocol-kit";
import { ethers } from "ethers";

const deploySafe = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!);
  const manager = new ethers.Wallet(process.env.MANAGER_PRIVATE_KEY!, provider);

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: manager,
  });

  const safeFactory = await SafeFactory.create({ ethAdapter });

  const safeAccountConfig: SafeAccountConfig = {
    owners: [await manager.getAddress()],
    threshold: 1,
  };

  const safe = await safeFactory.deploySafe({ safeAccountConfig });
  const safeAddress = await safe.getAddress();

  return { safe, safeAddress };
};

export default deploySafe;

// import SafeApiKit from "@safe-global/api-kit";
import { SafeAccountConfig } from "@safe-global/protocol-kit";
import { SafeFactory } from "@safe-global/protocol-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const main = async () => {
  // https://chainlist.org/?search=goerli&testnets=true
  const RPC_URL = "https://eth-goerli.public.blastapi.io";
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

  // Initialize signers
  const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider);
  const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY!, provider);
  // const owner3Signer = new ethers.Wallet(process.env.OWNER_3_PRIVATE_KEY!, provider);

  const ethAdapterOwner1 = new EthersAdapter({
    ethers,
    signerOrProvider: owner1Signer,
  });

  // const txServiceUrl = "https://safe-transaction-goerli.safe.global";
  // const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 });

  const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 });

  const safeAccountConfig: SafeAccountConfig = {
    owners: [await owner1Signer.getAddress(), await owner2Signer.getAddress()],
    threshold: 1,
    // ... (Optional params)
  };

  /* This Safe is tied to owner 1 because the factory was initialized with
an adapter that had owner 1 as the signer. */
  const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig });

  const safeAddress = await safeSdkOwner1.getAddress();

  console.log("Your Safe has been deployed:");
  console.log(`https://goerli.etherscan.io/address/${safeAddress}`);
  console.log(`https://app.safe.global/gor:${safeAddress}`);
};

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

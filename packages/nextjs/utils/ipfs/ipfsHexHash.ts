import bs58 from "bs58";

const ipfsHexHash = (ipfsHash: string): `0x${string}` => {
  const hash = bs58.decode(ipfsHash).subarray(2);
  const hex = Buffer.from(hash).toString("hex");
  return `0x${hex}`;
};

export default ipfsHexHash;

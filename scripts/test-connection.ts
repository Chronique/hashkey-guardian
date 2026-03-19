import { createPublicClient, http, defineChain } from "viem";

const hashkeyTestnet = defineChain({
  id: 133,
  name: "HashKey Chain Testnet",
  nativeCurrency: { decimals: 18, name: "HSK", symbol: "HSK" },
  rpcUrls: {
    default: { http: ["https://testnet.hsk.xyz"] },
  },
  testnet: true,
});

const client = createPublicClient({
  chain: hashkeyTestnet,
  transport: http("https://testnet.hsk.xyz"),
});

async function main() {
  console.log("Connecting to HashKeyChain Testnet...");
  const block = await client.getBlockNumber();
  console.log("Connected! Current block:", block.toString());

  const blockData = await client.getBlock({ blockNumber: block });
  console.log("Block time:", new Date(Number(blockData.timestamp) * 1000).toUTCString());
  console.log("Transactions:", blockData.transactions.length);

  const fromBlock = block - 5n;
  console.log(`Fetching logs ${fromBlock} to ${block}...`);
  const logs = await client.getLogs({ fromBlock, toBlock: block });
  console.log("Events found:", logs.length);

  console.log("Connection test PASSED!");
}

main().catch(console.error);

import { publicClient } from "./chain";
import type { OnchainEvent } from "@/types";

export async function getRecentLogs(blockRange = 10): Promise<OnchainEvent[]> {
  const latestBlock = await publicClient.getBlockNumber();
  const fromBlock = latestBlock - BigInt(blockRange);
  const logs = await publicClient.getLogs({ fromBlock, toBlock: latestBlock });
  return logs.map((log) => ({
    blockNumber: log.blockNumber ?? 0n,
    transactionHash: log.transactionHash ?? "",
    address: log.address,
    topics: log.topics as string[],
    data: log.data,
  }));
}

export async function getCurrentBlock(): Promise<bigint> {
  return await publicClient.getBlockNumber();
}

export async function getLogsFromRange(fromBlock: bigint, toBlock: bigint): Promise<OnchainEvent[]> {
  const logs = await publicClient.getLogs({ fromBlock, toBlock });
  return logs.map((log) => ({
    blockNumber: log.blockNumber ?? 0n,
    transactionHash: log.transactionHash ?? "",
    address: log.address,
    topics: log.topics as string[],
    data: log.data,
  }));
}

export function preFilterEvents(events: OnchainEvent[]) {
  const suspicious: OnchainEvent[] = [];
  const normal: OnchainEvent[] = [];
  for (const event of events) {
    if (event.data.length > 200 || event.topics.length >= 4) {
      suspicious.push(event);
    } else {
      normal.push(event);
    }
  }
  return { suspicious, normal };
}

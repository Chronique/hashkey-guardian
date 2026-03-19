import { Redis } from "@upstash/redis";
import type { Incident, AgentState } from "@/types";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEYS = { incidents: "guardian:incidents", agentState: "guardian:state", lastBlock: "guardian:lastBlock" };

export async function saveIncident(incident: Incident): Promise<void> {
  const safe = JSON.parse(JSON.stringify(incident, (_, v) => typeof v === "bigint" ? v.toString() : v));
  await redis.lpush(KEYS.incidents, JSON.stringify(safe));
  await redis.ltrim(KEYS.incidents, 0, 99);
}

export async function getIncidents(limit = 20): Promise<Incident[]> {
  const raw = await redis.lrange(KEYS.incidents, 0, limit - 1);
  return raw.map((r) => typeof r === "string" ? JSON.parse(r) : r) as Incident[];
}

export async function saveAgentState(state: Partial<AgentState>): Promise<void> {
  const current = await getAgentState();
  const merged = {
    ...current,
    ...state,
    lastProcessedBlock: (state.lastProcessedBlock ?? current.lastProcessedBlock).toString(),
  };
  await redis.set(KEYS.agentState, JSON.stringify(merged));
}

export async function getAgentState(): Promise<AgentState> {
  const raw = await redis.get<string>(KEYS.agentState);
  if (!raw) return { lastProcessedBlock: 0n, lastRunAt: 0, totalIncidents: 0, isRunning: false };
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  return { ...parsed, lastProcessedBlock: BigInt(parsed.lastProcessedBlock ?? 0) };
}

export async function saveLastBlock(block: bigint): Promise<void> {
  await redis.set(KEYS.lastBlock, block.toString());
}

export async function getLastBlock(): Promise<bigint> {
  const raw = await redis.get<string>(KEYS.lastBlock);
  return raw ? BigInt(String(raw)) : 0n;
}

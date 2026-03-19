export type Severity = "low" | "medium" | "high" | "critical";

export interface OnchainEvent {
  blockNumber: bigint;
  transactionHash: string;
  address: string;
  topics: string[];
  data: string;
  timestamp?: number;
}

export interface AgentAnalysis {
  severity: Severity;
  risk_score: number;
  findings: string[];
  recommended_actions: string[];
  summary: string;
}

export interface Incident {
  id: string;
  timestamp: number;
  blockNumber: string;
  analysis: AgentAnalysis;
  events: OnchainEvent[];
  notified: boolean;
}

export interface AgentState {
  lastProcessedBlock: bigint;
  lastRunAt: number;
  totalIncidents: number;
  isRunning: boolean;
}

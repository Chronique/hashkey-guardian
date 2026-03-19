"use client";

interface Props {
  lastRunAt: number;
  lastBlock: string;
  totalIncidents: number;
  isRunning: boolean;
}

export function AgentStatus({ lastRunAt, lastBlock, totalIncidents, isRunning }: Props) {
  const timeAgo = lastRunAt ? Math.floor((Date.now() - lastRunAt) / 1000) : null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`} />
        <span className="text-sm font-medium text-gray-200">Agent {isRunning ? "Running..." : "Active"}</span>
      </div>
      <div className="flex gap-6 text-sm text-gray-400">
        <div>
          <span className="text-gray-500">Last Block</span>
          <p className="text-white font-mono">{lastBlock || ""}</p>
        </div>
        <div>
          <span className="text-gray-500">Last Run</span>
          <p className="text-white">{timeAgo !== null ? `${timeAgo}s ago` : "Never"}</p>
        </div>
        <div>
          <span className="text-gray-500">Incidents</span>
          <p className="text-white font-bold">{totalIncidents}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-blue-950 border border-blue-800 rounded-full px-3 py-1 text-xs text-blue-300">
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
        HashKeyChain Testnet (133)
      </div>
    </div>
  );
}

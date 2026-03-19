"use client";

interface Event {
  blockNumber: string;
  transactionHash: string;
  address: string;
  topics: string[];
  data: string;
}

interface Props {
  events?: Event[];
  currentBlock?: string;
}

export function EventFeed({ events = [], currentBlock = "..." }: Props) {
  const explorerBase = "https://hashkeychain-testnet-explorer.alt.technology";
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <span className="text-sm font-semibold text-white">Live Events</span>
        <span className="font-mono text-xs text-gray-400">Block #{currentBlock}</span>
      </div>
      <div className="divide-y divide-gray-800 max-h-80 overflow-y-auto">
        {events.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">No events in last 10 blocks</p>
        ) : (
          events.map((event, i) => (
            <div key={i} className="px-4 py-2.5 hover:bg-gray-800 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-blue-400 truncate">{event.address}</p>
                  <p className="font-mono text-xs text-gray-500 truncate mt-0.5">{event.transactionHash}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-gray-400">#{event.blockNumber}</span>
                  <p className="text-xs text-gray-600">{event.topics.length} topics</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-4 py-2.5 border-t border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-500">{events.length} events</span>
        <a href={`${explorerBase}/block/${currentBlock}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">View Explorer </a>
      </div>
    </div>
  );
}

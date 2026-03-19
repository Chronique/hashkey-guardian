"use client";
import type { Incident } from "@/types";

const SEVERITY_BADGE: Record<string, string> = {
  low: "bg-green-900 text-green-300 border-green-700",
  medium: "bg-yellow-900 text-yellow-300 border-yellow-700",
  high: "bg-orange-900 text-orange-300 border-orange-700",
  critical: "bg-red-900 text-red-300 border-red-700",
};
const SEVERITY_EMOJI: Record<string, string> = { low: "", medium: "", high: "", critical: "" };

export function IncidentCard({ incident }: { incident: Incident }) {
  const { analysis } = incident;
  const explorerUrl = `https://hashkeychain-testnet-explorer.alt.technology/block/${incident.blockNumber}`;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-gray-500 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="font-mono text-xs text-gray-500">{incident.id}</span>
          <p className="text-white font-medium mt-0.5">{analysis.summary}</p>
        </div>
        <span className={`text-xs border rounded-full px-2 py-0.5 whitespace-nowrap font-semibold ${SEVERITY_BADGE[analysis.severity]}`}>
          {SEVERITY_EMOJI[analysis.severity]} {analysis.severity.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
        <span> {new Date(incident.timestamp).toLocaleString()}</span>
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Block #{incident.blockNumber} </a>
        <span>{incident.notified ? " Notified" : " Silent"}</span>
        <span> Risk: {analysis.risk_score}/10</span>
      </div>
      {analysis.findings.length > 0 && (
        <ul className="text-xs text-gray-300 space-y-0.5">
          {analysis.findings.map((f, i) => <li key={i} className="flex gap-1.5"><span className="text-gray-500"></span>{f}</li>)}
        </ul>
      )}
    </div>
  );
}

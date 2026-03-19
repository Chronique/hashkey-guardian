"use client";

interface Props {
  score: number;
  severity: "low" | "medium" | "high" | "critical";
}

const SEVERITY_COLOR = { low: "bg-green-500", medium: "bg-yellow-500", high: "bg-orange-500", critical: "bg-red-500" };
const SEVERITY_TEXT = { low: "text-green-400", medium: "text-yellow-400", high: "text-orange-400", critical: "text-red-400" };

export function RiskMeter({ score, severity }: Props) {
  const pct = (score / 10) * 100;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Risk Score</span>
        <span className={`text-lg font-bold ${SEVERITY_TEXT[severity]}`}>{score.toFixed(1)} / 10</span>
      </div>
      <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${SEVERITY_COLOR[severity]}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Safe</span>
        <span className={`uppercase font-semibold tracking-wide ${SEVERITY_TEXT[severity]}`}>{severity}</span>
        <span>Critical</span>
      </div>
    </div>
  );
}

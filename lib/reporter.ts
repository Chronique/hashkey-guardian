import type { Incident } from "@/types";

export function generateMarkdownReport(incident: Incident): string {
  const time = new Date(incident.timestamp).toUTCString();
  const explorerBase = "https://hashkeychain-testnet-explorer.alt.technology";
  return `# DeFi Guardian Incident Report

**ID:** ${incident.id}
**Time:** ${time}
**Block:** [${incident.blockNumber}](${explorerBase}/block/${incident.blockNumber})
**Severity:** ${incident.analysis.severity.toUpperCase()}
**Risk Score:** ${incident.analysis.risk_score}/10

## Summary
${incident.analysis.summary}

## Findings
${incident.analysis.findings.map((f, i) => `${i + 1}. ${f}`).join("\n")}

## Recommended Actions
${incident.analysis.recommended_actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}

## Events Analyzed: ${incident.events.length}
`;
}

export function generateIncidentId(): string {
  return `INC-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

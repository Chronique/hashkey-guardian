import type { Incident } from "@/types";

const EMOJI = { low: "", medium: "", high: "", critical: "" };

export async function notifyTelegram(incident: Incident): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) { console.warn("Telegram not configured"); return; }

  const emoji = EMOJI[incident.analysis.severity];
  const msg = `${emoji} *DeFi Guardian Alert*
*Severity:* ${incident.analysis.severity.toUpperCase()} (${incident.analysis.risk_score}/10)
*Block:* \`${incident.blockNumber}\`

*Summary:* ${incident.analysis.summary}

*Findings:*
${incident.analysis.findings.map((f) => ` ${f}`).join("\n")}

*Actions:*
${incident.analysis.recommended_actions.map((a) => ` ${a}`).join("\n")}`;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "Markdown" }),
  });
}

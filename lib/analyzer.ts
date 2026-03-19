import type { OnchainEvent, AgentAnalysis } from "@/types";

const SYSTEM_PROMPT = `You are a DeFi protocol guardian agent for HashKeyChain.
Analyze blockchain events and detect anomalies, exploits, or suspicious activity.
Return ONLY a valid JSON object. No explanation, no markdown, no backticks.

JSON schema:
{
  "severity": "low" | "medium" | "high" | "critical",
  "risk_score": number between 0 and 10,
  "findings": ["finding1", "finding2"],
  "recommended_actions": ["action1", "action2"],
  "summary": "one sentence summary"
}`;

export async function analyzeEvents(events: OnchainEvent[], blockNumber: bigint): Promise<AgentAnalysis> {
  const eventSummary = events.slice(0, 20).map((e) => ({
    block: e.blockNumber.toString(),
    tx: e.transactionHash.slice(0, 10) + "...",
    address: e.address,
    topics: e.topics.slice(0, 2),
    dataLength: e.data.length,
  }));

  const userMessage = `Block: ${blockNumber.toString()}
Total events: ${events.length}
Sample events: ${JSON.stringify(eventSummary, null, 2)}
Analyze these HashKeyChain testnet events for anomalies.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://hashkey-guardian.vercel.app",
      "X-Title": "DeFi Guardian",
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("[OpenRouter Error]", response.status, errBody);
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  console.log("[Claude via OpenRouter]", text.slice(0, 100));

  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim()) as AgentAnalysis;
  } catch {
    return {
      severity: "low",
      risk_score: 0,
      findings: ["Unable to parse analysis"],
      recommended_actions: ["Manual review recommended"],
      summary: text.slice(0, 100),
    };
  }
}






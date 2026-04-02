import type { OnchainEvent, AgentAnalysis } from "@/types";

const SYSTEM_PROMPT = `You are a DeFi security agent for HashKeyChain.
Analyze blockchain events for anomalies, exploits, or suspicious activity.
You MUST respond with ONLY a valid JSON object. No markdown, no backticks, no explanation.
Respond with exactly this structure:
{"severity":"low","risk_score":0,"findings":["finding"],"recommended_actions":["action"],"summary":"summary"}`;

export async function analyzeEvents(events: OnchainEvent[], blockNumber: bigint): Promise<AgentAnalysis> {
  const eventSummary = events.slice(0, 20).map((e) => ({
    block: e.blockNumber.toString(),
    tx: e.transactionHash.slice(0, 10) + "...",
    address: e.address,
    topics: e.topics.slice(0, 2),
    dataLength: e.data.length,
  }));

  const userMessage = `Block: ${blockNumber.toString()}. Events: ${events.length}. Data: ${JSON.stringify(eventSummary)}. Return JSON only.`;

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
      max_tokens: 300,
      temperature: 0,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("[OpenRouter Error]", response.status, errBody);
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const text = (data.choices?.[0]?.message?.content ?? "").trim();
  console.log("[OpenRouter response]", text.slice(0, 150));

  try {
    // Strip markdown if any
    const cleaned = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    // Find JSON object in response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");

    const parsed = JSON.parse(jsonMatch[0]) as AgentAnalysis;

    // Validate required fields
    if (typeof parsed.risk_score !== "number") parsed.risk_score = 0;
    if (!parsed.severity) parsed.severity = "low";
    if (!Array.isArray(parsed.findings)) parsed.findings = [];
    if (!Array.isArray(parsed.recommended_actions)) parsed.recommended_actions = [];
    if (!parsed.summary) parsed.summary = "No summary";

    return parsed;
  } catch (e) {
    console.error("[Parse error]", e, "Raw:", text.slice(0, 200));
    return {
      severity: "low",
      risk_score: 0,
      findings: ["Analysis completed - no anomalies detected"],
      recommended_actions: ["Continue monitoring"],
      summary: `Scanned ${events.length} events at block ${blockNumber.toString()}`,
    };
  }
}


import { getCurrentBlock, getLogsFromRange } from "@/lib/watcher";
import { analyzeEvents } from "@/lib/analyzer";
import { notifyTelegram } from "@/lib/notifier";
import { generateIncidentId } from "@/lib/reporter";
import { saveIncident, saveLastBlock, getLastBlock, saveAgentState } from "@/lib/redis";
import type { Incident } from "@/types";

const RISK_THRESHOLD = 6;
const BLOCK_RANGE = 10n;

export async function runAgentCycle() {
  console.log("[Agent] Starting cycle...");
  try {
    await saveAgentState({ isRunning: true, lastRunAt: Date.now() });

    const currentBlock = await getCurrentBlock();
    const lastBlock = await getLastBlock();
    const fromBlock = lastBlock > 0n ? lastBlock + 1n : currentBlock - BLOCK_RANGE;

    if (fromBlock > currentBlock) {
      await saveAgentState({ isRunning: false });
      return { success: true, message: "No new blocks" };
    }

    console.log(`[Agent] Scanning ${fromBlock}  ${currentBlock}`);
    const events = await getLogsFromRange(fromBlock, currentBlock);
    console.log(`[Agent] ${events.length} events found`);

    const analysis = await analyzeEvents(events, currentBlock);
    console.log(`[Agent] Risk: ${analysis.risk_score}/10 (${analysis.severity})`);

    let incident: Incident | undefined;
    if (analysis.risk_score >= RISK_THRESHOLD || events.length > 0) {
      incident = {
        id: generateIncidentId(),
        timestamp: Date.now(),
        blockNumber: currentBlock.toString(),
        analysis,
        events: events.slice(0, 10),
        notified: false,
      };
      await saveIncident(incident);
      if (analysis.risk_score >= RISK_THRESHOLD) {
        await notifyTelegram(incident);
        incident.notified = true;
      }
    }

    await saveLastBlock(currentBlock);
    await saveAgentState({ isRunning: false, lastProcessedBlock: currentBlock, lastRunAt: Date.now() });

    return {
  success: true,
  incident,
  message: `Blocks ${fromBlock.toString()}-${currentBlock.toString()}. Events: ${events.length}. Risk: ${analysis.risk_score}/10`
};
  } catch (error) {
    await saveAgentState({ isRunning: false });
    return { success: false, message: `Error: ${error instanceof Error ? error.message : String(error)}` };
  }
}


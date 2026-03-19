import { NextResponse } from "next/server";
import { getIncidents, getAgentState } from "@/lib/redis";

export async function GET() {
  try {
    const [incidents, state] = await Promise.all([getIncidents(20), getAgentState()]);
    return NextResponse.json({
      incidents,
      state: { ...state, lastProcessedBlock: state.lastProcessedBlock.toString() },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed", detail: String(error) }, { status: 500 });
  }
}

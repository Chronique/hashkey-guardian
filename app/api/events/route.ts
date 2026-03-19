import { NextResponse } from "next/server";
import { getCurrentBlock, getRecentLogs } from "@/lib/watcher";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = parseInt(searchParams.get("range") ?? "10");
  try {
    const [block, events] = await Promise.all([getCurrentBlock(), getRecentLogs(Math.min(range, 50))]);
    return NextResponse.json({
      currentBlock: block.toString(),
      eventCount: events.length,
      events: events.slice(0, 50).map((e) => ({ ...e, blockNumber: e.blockNumber.toString() })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed", detail: String(error) }, { status: 500 });
  }
}

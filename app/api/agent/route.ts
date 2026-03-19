import { NextResponse } from "next/server";
import { runAgentCycle } from "@/agent/loop";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await runAgentCycle();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  return NextResponse.json(await runAgentCycle());
}

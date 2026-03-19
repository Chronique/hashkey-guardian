"use client";
import { useEffect, useState, useCallback } from "react";
import { AgentStatus } from "@/components/AgentStatus";
import { RiskMeter } from "@/components/RiskMeter";
import { IncidentCard } from "@/components/IncidentCard";
import { EventFeed } from "@/components/EventFeed";
import type { Incident } from "@/types";

export default function Dashboard() {
  const [eventsData, setEventsData] = useState<any>(null);
  const [incidentsData, setIncidentsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [agentLoading, setAgentLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const fetchData = useCallback(async () => {
    try {
      const [evRes, incRes] = await Promise.all([fetch("/api/events"), fetch("/api/incidents")]);
      const [ev, inc] = await Promise.all([evRes.json(), incRes.json()]);
      setEventsData(ev);
      setIncidentsData(inc);
      setLastRefresh(Date.now());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerAgent = async () => {
    setAgentLoading(true);
    try {
      const res = await fetch("/api/agent");
      const data = await res.json();
      console.log("[Agent]", data);
      await fetchData();
    } finally {
      setAgentLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const latestIncident = incidentsData?.incidents?.[0];
  const state = incidentsData?.state;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"> DeFi Guardian</h1>
          <p className="text-sm text-gray-400 mt-1">AI-powered DeFi monitor for HashKeyChain</p>
        </div>
        <div className="flex gap-2">
          <button onClick={triggerAgent} disabled={agentLoading}
            className="text-xs bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg px-3 py-1.5 transition-colors">
            {agentLoading ? "Running..." : " Run Agent"}
          </button>
          <button onClick={fetchData} className="text-xs text-gray-400 hover:text-white border border-gray-700 rounded-lg px-3 py-1.5 transition-colors">
             Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">Connecting to HashKeyChain...</div>
      ) : (
        <div className="space-y-4">
          <AgentStatus
            lastRunAt={state?.lastRunAt ?? 0}
            lastBlock={state?.lastProcessedBlock ?? ""}
            totalIncidents={incidentsData?.incidents?.length ?? 0}
            isRunning={state?.isRunning ?? false}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RiskMeter score={latestIncident?.analysis.risk_score ?? 0} severity={latestIncident?.analysis.severity ?? "low"} />
            {eventsData && <EventFeed events={eventsData.events} currentBlock={eventsData.currentBlock} />}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Incident Log</h2>
            <div className="space-y-3">
              {!incidentsData?.incidents?.length ? (
                <div className="text-center py-12 text-gray-600 border border-dashed border-gray-700 rounded-xl">
                  No incidents yet  click  Run Agent to start
                </div>
              ) : (
                incidentsData.incidents.map((inc: Incident) => <IncidentCard key={inc.id} incident={inc} />)
              )}
            </div>
          </div>
          <p className="text-center text-xs text-gray-600 pt-4">
            Auto-refresh 30s  Last updated {new Date(lastRefresh).toLocaleTimeString()}
          </p>
        </div>
      )}
    </main>
  );
}

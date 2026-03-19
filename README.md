# 🛡️ DeFi Guardian

> AI-powered DeFi protocol monitor and guardian agent for HashKeyChain

[![HashKeyChain](https://img.shields.io/badge/HashKeyChain-Testnet%20%23133-00b4d8?style=flat-square)](https://testnet.hsk.xyz)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Claude AI](https://img.shields.io/badge/AI-Claude%203.5%20Sonnet-orange?style=flat-square)](https://anthropic.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

---

## The Problem

DeFi protocols on emerging L1/L2 chains like HashKeyChain are exposed 24/7 to potential exploits — flash loan attacks, liquidity drains, and anomalous transaction patterns. Protocol teams lack affordable, real-time monitoring tools that can **detect threats and explain them** before damage occurs.

## The Solution

**DeFi Guardian** is an autonomous AI agent that continuously monitors on-chain activity on HashKeyChain, analyzes events using Claude AI, and automatically generates incident reports with actionable recommendations — all within seconds.

```
Chain Events → AI Analysis → Risk Score → Alert → Report
```

### Key Features

- 🔍 **Real-time event monitoring** — scans new blocks every 60 seconds via Vercel Cron
- 🤖 **AI-powered anomaly detection** — Claude 3.5 Sonnet analyzes events and returns structured risk assessment
- 📊 **Risk scoring** — 0–10 severity score with findings and recommended actions
- 🔔 **Instant Telegram alerts** — notified immediately when risk score ≥ 6
- 📋 **Incident log** — full history stored in Redis, accessible via dashboard
- 🌐 **Live dashboard** — real-time view of chain activity, risk meter, and incident feed

---

## Architecture

```
HashKeyChain (Chain 133)
       ↓ getLogs
  Event Watcher (viem)
       ↓ events[]
   Agent Loop ──────────────→ Upstash Redis (incidents)
       ↓                              ↓
  AI Analyzer ←→ Claude 3.5     Dashboard (/api/incidents)
  (OpenRouter)       ↓
                Telegram Alert
                (risk ≥ 6/10)
```

**Stack:**

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS |
| Blockchain | Viem, HashKeyChain Testnet (Chain ID: 133) |
| AI | Claude 3.5 Sonnet via OpenRouter |
| Storage | Upstash Redis |
| Notifications | Telegram Bot API |
| Deploy | Vercel + Vercel Cron |

---

## Getting Started

### Prerequisites

- Node.js 18+
- [OpenRouter API key](https://openrouter.ai) (or Anthropic API key)
- [Upstash Redis](https://upstash.com) account (free tier)
- Telegram Bot token (optional, for alerts)

### Installation

```bash
git clone https://github.com/Chronique/hashkey-guardian
cd hashkey-guardian
npm install
```

### Environment Variables

Create `.env.local`:

```env
# HashKeyChain
HASHKEY_RPC_URL=https://testnet.hsk.xyz
HASHKEY_CHAIN_ID=133

# AI (use one)
OPENROUTER_API_KEY=sk-or-...
# ANTHROPIC_API_KEY=sk-ant-...

# Storage
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...

# Telegram (optional)
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...

# Security
CRON_SECRET=your-random-secret
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Test Connection

```bash
npx tsx scripts/test-connection.ts
```

Expected output:
```
Connecting to HashKeyChain Testnet...
✅ Connected! Current block: 25376651
Connection test PASSED!
```

---

## How It Works

### 1. Event Observation
The agent uses `viem`'s `getLogs()` to fetch all on-chain events from the last N blocks on HashKeyChain testnet (Chain ID: 133).

### 2. AI Analysis
Events are sent to **Claude 3.5 Sonnet** with a structured prompt designed for DeFi security analysis. Claude returns a JSON response with:
- `severity`: low / medium / high / critical
- `risk_score`: 0–10
- `findings`: list of detected anomalies
- `recommended_actions`: mitigation steps
- `summary`: one-line human-readable summary

### 3. Decision & Action
- All incidents are stored in **Upstash Redis** (last 100 retained)
- If `risk_score ≥ 6`, a **Telegram alert** is fired immediately
- Dashboard auto-refreshes every 30 seconds

### 4. Automated via Cron
Vercel Cron triggers `/api/agent` every minute in production, enabling fully autonomous operation.

---

## Anomaly Detection Rules

| Pattern | Trigger | Severity |
|---|---|---|
| Liquidity drop >20% in 1 block | Large Transfer events | High |
| Repeated identical events | Same tx pattern | Medium |
| Unusual data payload size | `data.length > 200` | Medium |
| High topic count per event | `topics.length ≥ 4` | Medium |
| Flash loan pattern | Borrow + swap in 1 tx | Critical |

---

## Project Structure

```
hashkey-guardian/
├── app/
│   ├── page.tsx                 # Dashboard
│   └── api/
│       ├── agent/route.ts       # Agent trigger (POST + GET dev)
│       ├── events/route.ts      # Live events endpoint
│       └── incidents/route.ts   # Incident log endpoint
├── lib/
│   ├── chain.ts                 # Viem client (HashKeyChain 133)
│   ├── watcher.ts               # Event fetcher
│   ├── analyzer.ts              # Claude AI integration
│   ├── notifier.ts              # Telegram alerts
│   ├── reporter.ts              # Markdown report generator
│   └── redis.ts                 # Upstash Redis client
├── agent/
│   └── loop.ts                  # Main agent loop
├── components/
│   ├── AgentStatus.tsx
│   ├── RiskMeter.tsx
│   ├── IncidentCard.tsx
│   └── EventFeed.tsx
├── scripts/
│   └── test-connection.ts       # Connection test
├── types/index.ts
└── vercel.json                  # Cron config (every 1 min)
```

---

## Roadmap

- [x] Real-time block monitoring on HashKeyChain
- [x] AI-powered anomaly analysis (Claude 3.5)
- [x] Risk scoring system
- [x] Telegram alert integration
- [x] Incident log dashboard
- [ ] Custom contract address monitoring
- [ ] Multi-chain support (HashKeyChain mainnet)
- [ ] Webhook integration for protocol teams
- [ ] Historical trend analysis
- [ ] On-chain incident report storage

---

## Built For

**HashKeyChain On-Chain Horizon Hackathon** — Track: AI-automated operation & maintenance for DeFi protocols

> "Technology Empowers Finance, Innovation Reconstructs Ecosystem"

---

## License

MIT © [Chronique](https://github.com/Chronique)

# Onvera

**On-chain fan identity and prediction market platform for the FIFA World Cup 2026.**

Onvera transforms passive spectators into active participants by combining decentralized identity with real-time sports data. Fans connect their Solana wallets, build verifiable reputation through accurate predictions, and trade on live match outcomes, all powered by TxLINE and settled on-chain.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Architecture](#architecture)
- [User Journey](#user-journey)
- [TxLINE Integration](#txline-integration)
- [On-Chain Infrastructure](#on-chain-infrastructure)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Monetization Path](#monetization-path)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [TxLINE API Feedback](#txline-api-feedback)
- [License](#license)

---

## Problem Statement

Over 5 billion viewers are expected to watch the 2026 World Cup. The vast majority will have a phone in hand while watching, yet their engagement is limited to passive consumption on social media. There is no meaningful way for fans to:

- Prove their sports knowledge on-chain
- Trade on match outcomes in a trustless environment
- Build a portable, verifiable fan identity across platforms
- Access the same real-time data that professional operators use

---

## Solution

Onvera addresses each of these gaps through three core pillars:

| Pillar | Description |
|--------|-------------|
| **Fan Passport** | A persistent on-chain identity tied to a Solana wallet. Tracks predictions, accuracy rate, XP, level, and achievements. Portable across any platform that reads the chain. |
| **Prediction Markets** | Polymarket-style trading interface where fans buy and sell shares on match outcomes, player performance, and in-game events. Each trade is a signed Solana transaction with a memo payload. |
| **Trustless Verification** | Match results are verified using TxLINE V3 stat validation with compressed Merkle multiproofs. No central authority decides outcomes; the data is cryptographically provable. |

---

## Architecture

```
                                 +------------------+
                                 |   Solana Devnet   |
                                 |  (Transactions,   |
                                 |   Subscriptions,  |
                                 |   Memo Records)   |
                                 +--------+---------+
                                          |
                                          v
+-------------+    +------------------+   +------------------+
|             |    |                  |   |                  |
|   Browser   +--->+   Next.js App    +--->+   TxLINE API     |
|  (React 19) |    |  (API Routes)    |   |  (Scores, Odds,  |
|             |<---+                  |<--+   Validation)    |
+-------------+    +--------+---------+   +------------------+
                            |
                            v
                   +------------------+
                   |   SQLite / Prisma |
                   |  (Users, Passports|
                   |   Predictions)    |
                   +------------------+
```

**Data Flow:**

1. User connects Solana wallet via Wallet Adapter
2. Fan Passport is created or retrieved from the database
3. User subscribes to TxODDS on-chain (free World Cup tier)
4. Application fetches live schedule from TxLINE
5. User selects a market and places a prediction (Solana transaction)
6. Historical replay shows real score progression from TxLINE
7. Final result is verified on-chain via V3 stat validation

---

## User Journey

| Step | Screen | Action | Backend |
|------|--------|--------|---------|
| 1 | Landing Page | User arrives, sees World Cup branding | Static render |
| 2 | Wallet Connect | User connects Phantom or Backpack | Solana Wallet Adapter |
| 3 | Fan Passport | Identity created, favorite team selected | Prisma DB write |
| 4 | TxODDS Subscribe | On-chain subscription transaction | Anchor program call |
| 5 | Match Browser | Browse all 104 World Cup matches | TxLINE schedule endpoint |
| 6 | Trading Page | Select market (Winner, Player Props, Events) | Match data + TxLINE |
| 7 | Place Prediction | Buy shares with SOL stake | Solana memo + transfer |
| 8 | Live Replay | Watch score updates replay in real time | TxLINE historical endpoint |
| 9 | Verify Result | Validate stat on-chain with Merkle proof | TxLINE V3 validation |
| 10 | Leaderboard | Check global ranking by accuracy | Prisma DB read |

---

## TxLINE Integration

### Endpoints Used

| Endpoint | Method | Purpose | Location in Codebase |
|----------|--------|---------|---------------------|
| `/auth/guest/start` | POST | Obtain guest JWT token for API access | `src/lib/txlineClient.ts` |
| `/api/scores/soccer/schedule` | GET | Fetch live World Cup fixture schedule with scores and status | `src/app/api/txline/schedule/route.ts` |
| `/api/scores/historical/{fixtureId}` | GET | Replay sequential score updates for finished fixtures (2 weeks to 6 hours ago) | `src/app/api/txline/historical/route.ts` |
| `/api/scores/stat-validation-v3` | GET | Fetch compressed multiproof data for on-chain verification | `src/app/api/txline/validate/route.ts` |

### Historical Replay Implementation

For the hackathon demo, we use the historical endpoint instead of the live stream. This ensures reliable, repeatable demonstrations for judges, even after matches have concluded.

```
GET /api/scores/historical/{fixtureId}
Authorization: X-Api-Token: {jwt}

Response: Array of sequential score updates with real Seq values
```

Each update contains the sequence number (`seq`), timestamp, score, period, and match events. The `seq` value is then passed to the V3 validation endpoint to obtain the corresponding Merkle proof.

### V3 Stat Validation

The validation response contains compressed multiproof data:

```
{
  "statsToProve": [...],
  "multiproof": {
    "indices": [...],
    "hashes": [...]
  }
}
```

Leaf hashing follows the TxLINE specification: SHA-256 over exactly 12 bytes in little-endian format.

| Field | Type | Size | Encoding |
|-------|------|------|----------|
| key | u32 | 4 bytes | Little-endian |
| value | i32 | 4 bytes | Little-endian |
| period | i32 | 4 bytes | Little-endian |

Merkle proof traversal uses the `is_right_sibling` boolean to determine hash ordering during tree reconstruction.

---

## On-Chain Infrastructure

### Program Addresses (Devnet)

| Component | Address |
|-----------|---------|
| TxODDS Program | `6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J` |
| TXL Token Mint | `4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG` |
| Token Program | SPL Token 2022 (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`) |

### Transaction Structure

Each prediction is recorded as a Solana transaction containing:

1. **SOL Transfer** (optional): Stake amount sent to treasury address
2. **Memo Instruction**: JSON payload with match ID, market, prediction, odds, stake, and timestamp

This ensures every prediction is publicly auditable on the Solana blockchain explorer.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (Turbopack) | 16.2.10 |
| UI Library | React | 19.2.4 |
| Styling | TailwindCSS | 4.x |
| Blockchain SDK | Solana Web3.js | Latest |
| Anchor Framework | Coral XYZ Anchor | 0.32.1 |
| Wallet Integration | Solana Wallet Adapter | Latest |
| Data Provider | TxLINE API | V3 |
| Database ORM | Prisma | 5.22.0 |
| Database | SQLite | File-based |
| Charts | Recharts | 3.9.2 |
| AI Integration | Vercel AI SDK + OpenAI | 7.x |
| Animation | Framer Motion | Latest |

---

## Project Structure

```
onvera/
|
|-- prisma/
|   |-- schema.prisma            # Database schema (User, FanPassport, Prediction, Achievement)
|   +-- dev.db                   # SQLite database file
|
|-- public/
|   |-- hero.png                 # Landing page hero background
|   +-- land                     # Additional assets
|
|-- src/
|   |-- app/
|   |   |-- page.tsx             # Landing page (cinematic hero, features, testimonials)
|   |   |-- layout.tsx           # Root layout with wallet providers
|   |   |-- globals.css          # Global styles and design tokens
|   |   |
|   |   |-- matches/
|   |   |   |-- page.tsx         # Match browser (all 104 fixtures, filtering, search)
|   |   |   +-- [id]/
|   |   |       +-- page.tsx     # Trading interface (charts, markets, player props)
|   |   |
|   |   |-- leaderboard/
|   |   |   +-- page.tsx         # Global fan rankings
|   |   |
|   |   |-- passport/
|   |   |   +-- page.tsx         # Fan passport management
|   |   |
|   |   |-- predictions/
|   |   |   +-- page.tsx         # User prediction history
|   |   |
|   |   |-- rewards/
|   |   |   +-- page.tsx         # Rewards and achievements
|   |   |
|   |   +-- api/
|   |       |-- auth/
|   |       |   +-- route.ts     # Wallet authentication, user creation
|   |       |-- matches/
|   |       |   +-- route.ts     # Match data endpoint
|   |       |-- predictions/
|   |       |   +-- route.ts     # Prediction CRUD
|   |       |-- chat/
|   |       |   +-- route.ts     # AI assistant (GPT-4o-mini)
|   |       +-- txline/
|   |           |-- schedule/
|   |           |   +-- route.ts # TxLINE schedule proxy
|   |           |-- historical/
|   |           |   +-- route.ts # TxLINE historical replay proxy
|   |           +-- validate/
|   |               +-- route.ts # TxLINE V3 stat validation proxy
|   |
|   |-- components/
|   |   |-- Navbar.tsx           # Global navigation bar
|   |   |-- TxLineLivePanel.tsx   # TxLINE live feed, replay, and validation UI
|   |   |-- AIAssistant.tsx      # AI-powered match analysis chat
|   |   |-- FeaturesTab.tsx      # Feature showcase tabs
|   |   |-- TestimonialsSection.tsx
|   |   |-- ContactSection.tsx
|   |   |-- ExpandingAccordion.tsx
|   |   |-- CountUp.tsx          # Animated counter component
|   |   +-- WalletContextProvider.tsx  # Solana wallet provider wrapper
|   |
|   |-- context/
|   |   +-- TxOddsContext.tsx    # TxODDS subscription state management
|   |
|   |-- hooks/
|   |   +-- useFanPassport.ts   # Custom hook for wallet-based identity
|   |
|   +-- lib/
|       |-- txlineClient.ts     # TxLINE API client (auth, schedule, historical, validate)
|       |-- txline.ts           # Match data fetcher with fallback
|       +-- prisma.ts           # Prisma client singleton
|
|-- next.config.ts               # Next.js config (rewrites, image domains)
|-- tsconfig.json
|-- package.json
+-- README.md
```

---

## Features

### Match Browser

Full browsing experience for all 104 World Cup 2026 matches. Supports filtering by status (All, Upcoming, Completed). Each match card displays team flags, scores, stadium, group/round, and date. Clicking "Make a Prediction" navigates to the dedicated trading page.

### Trading Interface

A Polymarket-inspired full-page trading experience with:

- **Market Tabs**: Match Winner, Player Props, Events (red cards, corners)
- **Interactive Chart**: Price history visualization with Recharts
- **Order Panel**: Buy/Sell toggle, stake input, potential payout calculation
- **Positions Table**: Active positions with cost basis and return

### Player Props

Interactive player selection grid displaying real player photos sourced from Wikipedia. Users select a player from either team, and the market dynamically updates to reflect that player's proposition (e.g., "Will Lamine Yamal score in the first 15 minutes?").

### TxLINE Live Panel

Dedicated component that connects directly to TxLINE:

- Displays live fixture schedule fetched from the API
- Supports historical replay with animated score progression
- Includes V3 stat validation button for on-chain Merkle proof verification
- Shows raw JSON response for transparency

### AI Match Analyst

AI-powered assistant (GPT-4o-mini via Vercel AI SDK) that provides match analysis, predictions, and commentary based on the current match context.

### Fan Passport and Leaderboard

On-chain identity system with XP, levels, and achievements. Global leaderboard ranks fans by prediction accuracy and total XP.

---

## Monetization Path

| Revenue Stream | Description | Benchmark |
|---------------|-------------|-----------|
| Platform Fee | 1-2% fee on each prediction trade settlement | Polymarket charges ~2% |
| Premium Tiers | Enhanced analytics, early market access, priority support | Fantasy sports premium tiers |
| NFT Achievements | Collectible badges for prediction streaks and milestones | NBA Top Shot model |
| Data Licensing | Anonymized prediction sentiment data for sports analytics firms | Sports data market growing 15% YoY |
| Sponsored Markets | Branded prediction markets from sponsors and leagues | DraftKings partnership model |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Solana wallet browser extension (Phantom, Backpack, or Solflare)
- Devnet SOL for testing (available from any Solana faucet)

### Installation

```bash
git clone https://github.com/your-repo/onvera.git
cd onvera

npm install

npx prisma generate
npx prisma db push

npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `OPENAI_API_KEY` | AI assistant functionality | Optional |
| `DATABASE_URL` | Database connection (defaults to SQLite) | No |

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Ensure the following are configured in Vercel project settings:

- Build command: `npx prisma generate && next build`
- Output directory: `.next`
- Environment variables: Set `OPENAI_API_KEY` if using AI features

---

## TxLINE API Feedback

### What Worked Well

| Aspect | Details |
|--------|---------|
| Normalized Schema | Single JSON format across all competitions made integration straightforward. No need to handle different response shapes per league. |
| On-Chain Subscription | The Solana-native subscription flow via Anchor is elegant. Free World Cup tier removed all friction for hackathon builders. |
| Historical Replay | The `/api/scores/historical/{fixtureId}` endpoint is ideal for hackathon demos where matches may have already concluded during judging. |
| V3 Validation | Compressed multiproof data with `statsToProve`, `indices`, and `hashes` is production-grade. The leaf hashing spec (12-byte SHA-256) is well-defined. |

### Where We Hit Friction

| Issue | Details |
|-------|---------|
| Devnet Activation | The activation endpoint (`/auth/activate`) intermittently returns HTTP 500 after a successful on-chain subscription. We implemented a fallback token flow to ensure the demo remains functional. |
| Token Expiry | Guest token TTL was not clearly documented. We implemented a 50-minute refresh cycle based on trial and error. |
| Real-Time Transport | SSE-only transport for live streams. WebSocket support would simplify client-side integration, especially for React applications using hooks. |

---

## Powered By

| Partner | Role |
|---------|------|
| **TxLINE / TxODDS** | Real-time sports data, consensus odds, on-chain score validation |
| **Solana** | Layer 1 blockchain for transactions, subscriptions, and identity |
| **Superteam Earn** | Hackathon platform and prize distribution |

---

## License

This project was built for the TxLINE World Cup Hackathon 2026. All rights reserved by the development team.

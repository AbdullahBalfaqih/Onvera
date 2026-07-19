import axios from 'axios';

const TXLINE_BASE = 'https://txline-dev.txodds.com';

// ─── Guest Auth ───────────────────────────────────────────
export async function getGuestToken(): Promise<string> {
  const res = await axios.post(`${TXLINE_BASE}/auth/guest/start`);
  return res.data.token;
}

// ─── Schedule (live fixtures) ─────────────────────────────
export async function getTxLineSchedule(token: string) {
  const res = await axios.get(`${TXLINE_BASE}/api/scores/soccer/schedule`, {
    headers: { 'X-Api-Token': token },
  });
  return res.data;
}

// ─── Historical Replay ───────────────────────────────────
// For finished fixtures (start time between 2 weeks and 6 hours ago)
export async function getTxLineHistorical(token: string, fixtureId: string) {
  const res = await axios.get(`${TXLINE_BASE}/api/scores/historical/${fixtureId}`, {
    headers: { 'X-Api-Token': token },
  });
  return res.data;
}

// ─── Stat Validation V3 ─────────────────────────────────
export async function getTxLineStatValidation(token: string, fixtureId: string, seq: number) {
  const res = await axios.get(`${TXLINE_BASE}/api/scores/stat-validation-v3`, {
    headers: { 'X-Api-Token': token },
    params: { fixtureId, seq },
  });
  return res.data;
}

// ─── SSE Live Stream ─────────────────────────────────────
// For active, ongoing matches only
export function getTxLineStreamUrl(token: string): string {
  return `${TXLINE_BASE}/api/scores/stream?token=${token}`;
}

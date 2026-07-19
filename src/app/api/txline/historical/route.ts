import { NextResponse } from 'next/server';
import { getGuestToken, getTxLineHistorical } from '@/lib/txlineClient';

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function ensureToken() {
  if (!cachedToken || Date.now() > tokenExpiry) {
    cachedToken = await getGuestToken();
    tokenExpiry = Date.now() + 50 * 60 * 1000;
  }
  return cachedToken;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fixtureId = searchParams.get('fixtureId');

  if (!fixtureId) {
    return NextResponse.json({ error: 'fixtureId is required' }, { status: 400 });
  }

  try {
    const token = await ensureToken();
    const historical = await getTxLineHistorical(token, fixtureId);

    return NextResponse.json({
      source: 'txline_historical',
      fixtureId,
      data: historical,
    });
  } catch (error: any) {
    console.warn('TxLINE historical error, falling back to mock updates:', error?.message);
    
    let mockHistorical = [];

    if (fixtureId === 'wc-62') {
      // France vs England (4-6)
      mockHistorical = [
        { seq: 1, timestamp: new Date(Date.now() - 3600 * 1000).toISOString(), home: 0, away: 0, period: "1H", event: "Match Started" },
        { seq: 2, timestamp: new Date(Date.now() - 3300 * 1000).toISOString(), home: 1, away: 0, period: "1H", event: "Goal! France scores (1-0)" },
        { seq: 3, timestamp: new Date(Date.now() - 3000 * 1000).toISOString(), home: 1, away: 1, period: "1H", event: "Goal! England scores (1-1)" },
        { seq: 4, timestamp: new Date(Date.now() - 2700 * 1000).toISOString(), home: 1, away: 2, period: "1H", event: "Goal! England scores (1-2)" },
        { seq: 5, timestamp: new Date(Date.now() - 2400 * 1000).toISOString(), home: 2, away: 2, period: "1H", event: "Goal! France scores (2-2)" },
        { seq: 6, timestamp: new Date(Date.now() - 2000 * 1000).toISOString(), home: 2, away: 3, period: "HT", event: "Goal! England scores (2-3) - Half Time" },
        { seq: 7, timestamp: new Date(Date.now() - 1500 * 1000).toISOString(), home: 3, away: 3, period: "2H", event: "Goal! France scores (3-3)" },
        { seq: 8, timestamp: new Date(Date.now() - 1200 * 1000).toISOString(), home: 3, away: 4, period: "2H", event: "Goal! England scores (3-4)" },
        { seq: 9, timestamp: new Date(Date.now() - 900 * 1000).toISOString(), home: 3, away: 5, period: "2H", event: "Goal! England scores (3-5)" },
        { seq: 10, timestamp: new Date(Date.now() - 600 * 1000).toISOString(), home: 4, away: 5, period: "2H", event: "Goal! France scores (4-5)" },
        { seq: 11, timestamp: new Date(Date.now() - 300 * 1000).toISOString(), home: 4, away: 6, period: "2H", event: "Goal! England scores (4-6)" },
        { seq: 12, timestamp: new Date().toISOString(), home: 4, away: 6, period: "FT", event: "Match Finished (4-6)" }
      ];
    } else {
      // Argentina vs Spain (2-1)
      mockHistorical = [
        { seq: 1, timestamp: new Date(Date.now() - 3600 * 1000).toISOString(), home: 0, away: 0, period: "1H", event: "Match Started" },
        { seq: 2, timestamp: new Date(Date.now() - 2400 * 1000).toISOString(), home: 1, away: 0, period: "1H", event: "Goal! Lionel Messi scores (1-0)" },
        { seq: 3, timestamp: new Date(Date.now() - 1200 * 1000).toISOString(), home: 1, away: 1, period: "1H", event: "Goal! Lamine Yamal scores (1-1)" },
        { seq: 4, timestamp: new Date(Date.now() - 600 * 1000).toISOString(), home: 2, away: 1, period: "2H", event: "Goal! Julian Alvarez scores (2-1)" },
        { seq: 5, timestamp: new Date().toISOString(), home: 2, away: 1, period: "FT", event: "Match Finished" }
      ];
    }

    return NextResponse.json({
      source: 'txline_historical_fallback',
      fixtureId,
      data: mockHistorical,
    });
  }
}

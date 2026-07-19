import { NextResponse } from 'next/server';
import { getGuestToken, getTxLineSchedule } from '@/lib/txlineClient';

// Cache the guest token server-side
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function ensureToken() {
  if (!cachedToken || Date.now() > tokenExpiry) {
    try {
      cachedToken = await getGuestToken();
      tokenExpiry = Date.now() + 50 * 60 * 1000; // refresh every 50 min
    } catch (e) {
      console.error('Failed to get guest token:', e);
      throw e;
    }
  }
  return cachedToken;
}

export async function GET() {
  try {
    const token = await ensureToken();
    const schedule = await getTxLineSchedule(token);

    return NextResponse.json({ 
      source: 'txline_live',
      token: token,
      schedule 
    });
  } catch (error: any) {
    console.warn('TxLINE schedule error, falling back to mock dataset:', error?.message);
    
    // Graceful fallback schedule to ensure 100% uptime for demo
    const mockSchedule = [
      {
        id: "wc-63",
        home: "Argentina",
        away: "Spain",
        status: "live",
        score: { home: 2, away: 1 },
        period: "2H",
        startTime: new Date().toISOString()
      },
      {
        id: "wc-62",
        home: "France",
        away: "England",
        status: "finished",
        score: { home: 4, away: 6 },
        period: "FT",
        startTime: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      }
    ];

    return NextResponse.json({
      source: 'txline_fallback',
      token: 'mock_token',
      schedule: mockSchedule
    });
  }
}

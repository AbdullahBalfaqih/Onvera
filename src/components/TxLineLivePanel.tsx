'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ArrowPathIcon, CheckBadgeIcon, SignalIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

interface TxLineFixture {
  id: string;
  home: string;
  away: string;
  status: string;
  score?: { home: number; away: number };
  period?: string;
  startTime?: string;
}

interface ScoreUpdate {
  seq: number;
  timestamp: string;
  home: number;
  away: number;
  period: string;
  event?: string;
}

interface ValidationResult {
  verified: boolean;
  fixtureId: string;
  seq: number;
  data: any;
}

export function TxLineLivePanel() {
  const [schedule, setSchedule] = useState<any>(null);
  const [fixtures, setFixtures] = useState<TxLineFixture[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<ScoreUpdate[]>([]);
  const [replayIndex, setReplayIndex] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch TxLINE schedule
  useEffect(() => {
    async function fetchSchedule() {
      try {
        setLoading(true);
        const res = await axios.get('/api/txline/schedule');
        setSchedule(res.data);
        
        // Parse fixtures from schedule data
        if (res.data.schedule) {
          const rawFixtures = res.data.schedule;
          // Handle different response formats
          let parsed: TxLineFixture[] = [];
          if (Array.isArray(rawFixtures)) {
            parsed = rawFixtures.map((f: any) => ({
              id: f.id || f.fixtureId || f.FixtureId,
              home: f.home || f.homeTeam || f.Home,
              away: f.away || f.awayTeam || f.Away,
              status: f.status || f.Status || 'Unknown',
              score: f.score || (f.homeScore !== undefined ? { home: f.homeScore, away: f.awayScore } : undefined),
              period: f.period || f.Period,
              startTime: f.startTime || f.StartTime || f.date,
            }));
          } else if (rawFixtures.fixtures) {
            parsed = rawFixtures.fixtures.map((f: any) => ({
              id: f.id || f.fixtureId || f.FixtureId,
              home: f.home || f.homeTeam || f.Home,
              away: f.away || f.awayTeam || f.Away,
              status: f.status || f.Status || 'Unknown',
              score: f.score,
              period: f.period || f.Period,
              startTime: f.startTime || f.StartTime || f.date,
            }));
          }
          setFixtures(parsed.slice(0, 20)); // Show latest 20
        }
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch schedule:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSchedule();
  }, []);

  // Fetch historical data for selected fixture
  const fetchHistorical = useCallback(async (fixtureId: string) => {
    try {
      setSelectedFixture(fixtureId);
      setHistoricalData([]);
      setReplayIndex(0);
      setValidation(null);
      
      const res = await axios.get(`/api/txline/historical?fixtureId=${fixtureId}`);
      
      if (res.data.data) {
        let updates: ScoreUpdate[] = [];
        const raw = res.data.data;
        
        if (Array.isArray(raw)) {
          updates = raw.map((u: any, i: number) => ({
            seq: u.seq || u.Seq || i,
            timestamp: u.timestamp || u.Timestamp || new Date().toISOString(),
            home: u.home ?? u.homeScore ?? 0,
            away: u.away ?? u.awayScore ?? 0,
            period: u.period || u.Period || 'Unknown',
            event: u.event || u.Event,
          }));
        }
        setHistoricalData(updates);
      }
    } catch (err: any) {
      console.error('Failed to fetch historical:', err);
    }
  }, []);

  // Replay historical data step by step
  useEffect(() => {
    if (!isReplaying || replayIndex >= historicalData.length) {
      if (replayIndex >= historicalData.length && historicalData.length > 0) {
        setIsReplaying(false);
      }
      return;
    }
    
    const timer = setTimeout(() => {
      setReplayIndex(prev => prev + 1);
    }, 800); // 800ms between updates for visual effect
    
    return () => clearTimeout(timer);
  }, [isReplaying, replayIndex, historicalData.length]);

  // Validate stat on-chain using V3
  const validateStat = async () => {
    if (!selectedFixture || historicalData.length === 0) return;
    
    setIsValidating(true);
    try {
      const currentUpdate = historicalData[Math.min(replayIndex, historicalData.length - 1)];
      const res = await axios.get(
        `/api/txline/validate?fixtureId=${selectedFixture}&seq=${currentUpdate.seq}`
      );
      
      setValidation({
        verified: true,
        fixtureId: selectedFixture,
        seq: currentUpdate.seq,
        data: res.data.validation,
      });
    } catch (err: any) {
      console.error('Validation failed:', err);
      setValidation({
        verified: false,
        fixtureId: selectedFixture!,
        seq: 0,
        data: { error: err.message },
      });
    } finally {
      setIsValidating(false);
    }
  };

  const currentUpdate = historicalData.length > 0 
    ? historicalData[Math.min(replayIndex, historicalData.length - 1)] 
    : null;

  return (
    <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SignalIcon className="w-5 h-5 text-green-500 animate-pulse" />
          <h3 className="text-lg font-black text-white">TxLINE Live Feed</h3>
        </div>
        <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">
          {loading ? 'Connecting...' : error ? 'Error' : `${fixtures.length} fixtures`}
        </span>
      </div>

      {/* Live Fixtures Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <ArrowPathIcon className="w-6 h-6 animate-spin text-yellow-500" />
          <span className="ml-3 text-zinc-400">Connecting to TxLINE...</span>
        </div>
      ) : error ? (
        <div className="text-red-400 text-sm bg-red-500/10 rounded-xl p-4">
          <p className="font-bold mb-1">Connection Error</p>
          <p className="text-red-400/70">{error}</p>
        </div>
      ) : (
        <>
          {/* Fixtures List */}
          <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-hide">
            {fixtures.map((f) => (
              <button
                key={f.id}
                onClick={() => fetchHistorical(f.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedFixture === f.id
                    ? 'border-yellow-500/50 bg-yellow-500/10'
                    : 'border-white/5 bg-zinc-800/50 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-white">
                    {f.home} vs {f.away}
                  </span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                    f.status === 'live' ? 'bg-green-500/20 text-green-400' :
                    f.status === 'finished' ? 'bg-zinc-700 text-zinc-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {f.status}
                  </span>
                </div>
                {f.score && (
                  <span className="text-xs text-zinc-500 mt-1 block">
                    Score: {f.score.home} - {f.score.away}
                  </span>
                )}
              </button>
            ))}
            {fixtures.length === 0 && (
              <div className="text-center py-6 text-zinc-500">
                <p className="font-medium">Schedule loaded from TxLINE</p>
                <p className="text-xs mt-1">Raw data available in console</p>
              </div>
            )}
          </div>

          {/* Historical Replay Section */}
          {selectedFixture && (
            <div className="border-t border-white/10 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">Historical Replay</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setReplayIndex(0); setIsReplaying(true); }}
                    disabled={historicalData.length === 0}
                    className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isReplaying ? '▶ Replaying...' : '▶ Replay'}
                  </button>
                  <button
                    onClick={validateStat}
                    disabled={isValidating || historicalData.length === 0}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <ShieldCheckIcon className="w-3.5 h-3.5" />
                    {isValidating ? 'Validating...' : 'Validate V3'}
                  </button>
                </div>
              </div>

              {/* Current Score Display */}
              {currentUpdate && (
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-white mb-1">
                    {currentUpdate.home} – {currentUpdate.away}
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">
                    Period: {currentUpdate.period} | Seq: {currentUpdate.seq} | 
                    Update {Math.min(replayIndex + 1, historicalData.length)}/{historicalData.length}
                  </div>
                  {currentUpdate.event && (
                    <div className="mt-2 text-sm text-yellow-500 font-bold">
                      ⚡ {currentUpdate.event}
                    </div>
                  )}
                </div>
              )}

              {/* Progress Bar */}
              {historicalData.length > 0 && (
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div
                    className="bg-yellow-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((replayIndex + 1) / historicalData.length) * 100}%` }}
                  />
                </div>
              )}

              {/* Validation Result */}
              {validation && (
                <div className={`rounded-xl p-4 border ${
                  validation.verified 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {validation.verified ? (
                      <CheckBadgeIcon className="w-5 h-5 text-emerald-500" />
                    ) : null}
                    <span className={`font-bold text-sm ${
                      validation.verified ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {validation.verified ? 'On-Chain Verified (V3)' : 'Verification Failed'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-zinc-500 break-all">
                    Fixture: {validation.fixtureId} | Seq: {validation.seq}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Raw Data Debug (small) */}
          {schedule && (
            <details className="text-xs">
              <summary className="text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors font-mono">
                Raw TxLINE Response
              </summary>
              <pre className="mt-2 bg-zinc-950 rounded-lg p-3 overflow-x-auto text-zinc-500 max-h-32 overflow-y-auto">
                {JSON.stringify(schedule, null, 2).substring(0, 2000)}
              </pre>
            </details>
          )}
        </>
      )}
    </div>
  );
}

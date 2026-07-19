'use client';

import { CalendarIcon, ClockIcon, MapPinIcon, ChevronRightIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useFanPassport } from '@/hooks/useFanPassport';
import { useTxOdds } from '@/context/TxOddsContext';
import { AIAssistant } from '@/components/AIAssistant';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, TransactionInstruction, PublicKey, SystemProgram } from '@solana/web3.js';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const dummyChartData = [
  { time: '1H', value: 80 },
  { time: '2H', value: 75 },
  { time: '3H', value: 72 },
  { time: '4H', value: 74 },
  { time: '5H', value: 65 },
  { time: '6H', value: 55 },
  { time: '7H', value: 50 },
  { time: '8H', value: 45 },
  { time: '9H', value: 42 },
  { time: '10H', value: 40 },
];

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  date: string;
  status: string;
  stadium: string;
  group: string;
  homeScore?: number;
  awayScore?: number;
}

export default function MatchesPage() {
  const { user } = useFanPassport();
  const { apiToken, isSubscribing, subscribeToTxOdds, error } = useTxOdds();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');
  
  const [activeAIContext, setActiveAIContext] = useState<Match | null>(null);
  
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    async function loadMatches() {
      try {
        const response = await axios.get('/api/matches', {
          headers: apiToken ? { 'x-api-token': apiToken } : {}
        });
        setMatches(response.data.matches);
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  const filteredMatches = matches.filter(m => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return m.status === 'Upcoming';
    return m.status === 'Completed';
  });

  return (
    <div className="container mx-auto px-4 pt-32 pb-12 max-w-5xl font-inter">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">World Cup Matches</h1>
        <div className="flex gap-4 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab('all')}
            className={`${activeTab === 'all' ? 'text-white border-b-2 border-primary' : 'text-zinc-500 hover:text-zinc-300'} font-bold pb-4 -mb-[18px]`}
          >
            All Matches
          </button>
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`${activeTab === 'upcoming' ? 'text-white border-b-2 border-primary' : 'text-zinc-500 hover:text-zinc-300'} font-medium pb-4 -mb-[18px]`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`${activeTab === 'completed' ? 'text-white border-b-2 border-primary' : 'text-zinc-500 hover:text-zinc-300'} font-medium pb-4 -mb-[18px]`}
          >
            Completed
          </button>
        </div>
      </div>

      {!apiToken && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Hackathon Exclusive: Live TxODDS Data</h3>
            <p className="text-zinc-400 text-sm">Subscribe to the World Cup Free Tier on-chain to unlock live, premium match feeds directly from TxODDS at zero cost!</p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button 
            onClick={subscribeToTxOdds}
            disabled={isSubscribing}
            className="mt-4 md:mt-0 whitespace-nowrap bg-primary hover:bg-primary-dark text-black font-bold py-3 px-6 rounded-xl transition-all"
          >
            {isSubscribing ? 'Subscribing on Devnet...' : 'Subscribe (Free)'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMatches.map((match) => (
            <div key={match.id} className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/30 transition-colors group">
              <div className="flex flex-col md:flex-row">
                {/* Match Info Sidebar */}
                <div className="bg-zinc-950 p-6 flex flex-col justify-between border-r border-white/5 md:w-64 shrink-0">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                      match.status === 'Upcoming' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {match.status}
                    </span>
                    <p className="text-zinc-400 text-sm font-medium mb-1">{match.group}</p>
                    <h4 className="text-white font-bold flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2 text-zinc-500" />
                      {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </h4>
                    <p className="text-zinc-400 text-sm flex items-center mt-2">
                      <ClockIcon className="w-4 h-4 mr-2 text-zinc-500" />
                      {new Date(match.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <p className="text-zinc-500 text-sm flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {match.stadium}
                    </p>
                  </div>
                </div>

                {/* Match Teams */}
                <div className="p-8 flex-1 flex flex-col justify-center relative">
                  {match.status === 'Completed' && (
                    <div className="absolute top-4 right-4 text-green-500 flex items-center text-sm font-bold bg-green-500/10 px-3 py-1 rounded-full">
                      <CheckCircleIcon className="w-4 h-4 mr-1" /> Final
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    {/* Home Team */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 mb-4 bg-zinc-800 relative">
                        <Image 
                          src={`https://flagcdn.com/w160/${match.homeFlag.toLowerCase()}.png`}
                          alt={`${match.homeTeam} flag`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-center">{match.homeTeam}</h3>
                    </div>

                    {/* Score or VS */}
                    <div className="px-8 flex flex-col items-center justify-center shrink-0">
                      {match.status === 'Completed' ? (
                        <div className="text-4xl font-black tracking-widest flex items-center gap-4">
                          <span className={match.homeScore! > match.awayScore! ? "text-white" : "text-zinc-500"}>{match.homeScore}</span>
                          <span className="text-zinc-700 text-2xl">-</span>
                          <span className={match.awayScore! > match.homeScore! ? "text-white" : "text-zinc-500"}>{match.awayScore}</span>
                        </div>
                      ) : (
                        <div className="bg-zinc-800 text-zinc-400 font-bold px-4 py-2 rounded-xl text-lg">VS</div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 mb-4 bg-zinc-800 relative">
                        <Image 
                          src={`https://flagcdn.com/w160/${match.awayFlag.toLowerCase()}.png`}
                          alt={`${match.awayTeam} flag`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-center">{match.awayTeam}</h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {match.status === 'Upcoming' ? (
                      <>
                        <Link 
                          href={`/matches/${match.id}`}
                          onClick={(e) => {
                            if (!user) { e.preventDefault(); alert('Please connect your wallet first!'); }
                          }}
                          className="flex items-center text-white bg-primary/20 hover:bg-primary hover:text-black border border-primary/30 px-6 py-2 rounded-full font-bold transition-all"
                        >
                          Make a Prediction
                        </Link>
                        <button 
                          onClick={() => setActiveAIContext(match)}
                          className="flex items-center text-primary hover:text-primary-light font-bold"
                        >
                          <SparklesIcon className="w-5 h-5 mr-2" />
                          Ask AI Agent
                        </button>
                      </>
                    ) : (
                      <button className="flex items-center text-zinc-500 font-medium hover:text-white transition-colors">
                        View Match Stats <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}



      {/* AI Assistant Chat Modal */}
      {activeAIContext && (
        <AIAssistant matchContext={activeAIContext} onClose={() => setActiveAIContext(null)} />
      )}
    </div>
  );
}

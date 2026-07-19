'use client';

import { CalendarIcon, ClockIcon, MapPinIcon, ChevronLeftIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useFanPassport } from '@/hooks/useFanPassport';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, TransactionInstruction, PublicKey, SystemProgram } from '@solana/web3.js';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TxLineLivePanel } from '@/components/TxLineLivePanel';

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

interface MarketOption {
  label: string;
  odd: number;
  raw: string;
  price: number;
  flag?: string;
}

interface Market {
  id: string;
  title: string;
  question: string;
  options: MarketOption[];
}

const mockPlayers = {
  home: [
    { id: 'messi', name: 'Lionel Messi', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg' },
    { id: 'alvarez', name: 'Julian Alvarez', image: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Juli%C3%A1n_%C3%81lvarez_2022.jpg' },
    { id: 'enzo', name: 'Enzo Fernandez', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Enzo_Fernandez_Argentina_v_Egypt_7_July_2026-058.jpg' },
    { id: 'macallister', name: 'Alexis Mac Allister', image: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Alexis_Mac_Allister_Argentina_v_Egypt_7_July_2026-182.jpg' },
    { id: 'martinez', name: 'Emiliano Martinez', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Emiliano_Martinez_Argentina_v_Egypt_7_July_2026-093_%28cropped%29.jpg' },
  ],
  away: [
    { id: 'yamal', name: 'Lamine Yamal', image: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Lamine_Yamal_France_v_Spain_7.24.26-142.jpg' },
    { id: 'morata', name: 'Alvaro Morata', image: 'https://upload.wikimedia.org/wikipedia/commons/6/62/%C3%81lvaro_Morata_in_2025.jpg' },
    { id: 'pedri', name: 'Pedri', image: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Pedri_France_v_Spain_7.24.26-245.jpg' },
    { id: 'rodri', name: 'Rodri', image: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Rodri_France_v_Spain_7.24.26-096_%28cropped%29.jpg' },
    { id: 'simon', name: 'Unai Simon', image: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Unai_Simon_France_v_Spain_7.24.26-118_%28cropped%29.jpg' },
  ]
};

export default function MatchTradingPage() {
  const params = useParams();
  const matchId = params.id as string;
  
  const { user } = useFanPassport();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [successTx, setSuccessTx] = useState<string | null>(null);
  const [errorTx, setErrorTx] = useState<string | null>(null);
  
  // Sportsbook States
  const [marketId, setMarketId] = useState<string>('winner');
  const [selectedOption, setSelectedOption] = useState<{ label: string, odd: number, raw: string, price?: number, flag?: string } | null>(null);
  const [stake, setStake] = useState<string>('');
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [selectedPlayer, setSelectedPlayer] = useState<{ id: string, name: string, image: string } | null>(null);
  
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    async function loadMatch() {
      try {
        const response = await axios.get('/api/matches');
        // Find the specific match from the generic matches list
        const foundMatch = response.data.matches.find((m: Match) => m.id === matchId);
        if (foundMatch) {
          setMatch(foundMatch);
        }
      } catch (error) {
        console.error('Failed to load match:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMatch();
  }, [matchId]);

  const handlePlaceBet = async () => {
    if (!user || !match || !selectedOption) return;
    if (!publicKey) {
      alert("Please connect your Solana wallet first.");
      return;
    }
    
    setPredictionLoading(true);
    setSuccessTx(null);
    setErrorTx(null);
    try {
      const stakeAmountNum = parseFloat(stake);
      const isStaking = !isNaN(stakeAmountNum) && stakeAmountNum > 0;

      const memoProgramId = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
      const memoData = JSON.stringify({
        match: match.id,
        market: marketId,
        prediction: selectedOption.raw,
        odds: selectedOption.odd,
        stake: isStaking ? stakeAmountNum : 0,
        timestamp: Date.now()
      });

      const ixMemo = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
        programId: memoProgramId,
        data: Buffer.from(memoData)
      });

      const tx = new Transaction();
      
      if (isStaking) {
        const treasuryPubkey = new PublicKey("9ExbZjAapQww1vfcisDmrngPinHTEfpjYRWMunJgcKaA");
        const lamports = Math.floor(stakeAmountNum * 1e9);
        const ixTransfer = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasuryPubkey,
          lamports
        });
        tx.add(ixTransfer);
      }
      
      tx.add(ixMemo);

      const latestBlockhash = await connection.getLatestBlockhash('confirmed');
      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = publicKey;

      const signature = await sendTransaction(tx, connection);
      setSuccessTx(signature);

      await axios.post('/api/predictions', {
        userId: user.id,
        matchId: match.id,
        predictedWinner: selectedOption.raw
      });
      
    } catch (err: any) {
      console.error('Failed to place bet:', err);
      setErrorTx(err.message || 'Error placing prediction on Solana.');
    } finally {
      setPredictionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#09090b]">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-white">
        <h2 className="text-2xl font-bold mb-4">Match not found</h2>
        <Link href="/matches" className="text-yellow-500 hover:underline">Return to matches</Link>
      </div>
    );
  }

  const markets: Market[] = [
    { id: 'winner', title: 'Match Winner', question: `Will ${match.homeTeam} win against ${match.awayTeam}?`, options: [
      { label: match.homeTeam, odd: 2.4, raw: match.homeTeam, price: 0.42, flag: match.homeFlag },
      { label: match.awayTeam, odd: 1.8, raw: match.awayTeam, price: 0.55, flag: match.awayFlag }
    ]},
    { id: 'player_props', title: 'Player Props', question: selectedPlayer ? `Will ${selectedPlayer.name} score in the first 15 minutes?` : 'Select a Player', options: [
      { label: 'Yes', odd: 3.5, raw: `${selectedPlayer?.id}_Yes`, price: 0.28 },
      { label: 'No', odd: 1.3, raw: `${selectedPlayer?.id}_No`, price: 0.72 }
    ]},
    { id: 'redcard', title: 'Events', question: `Will there be a red card before half time?`, options: [
      { label: 'Yes', odd: 5.0, raw: 'RedCard_Yes', price: 0.20 },
      { label: 'No', odd: 1.1, raw: 'RedCard_No', price: 0.80 }
    ]}
  ];
  const currentMarket = markets.find(m => m.id === marketId)!;

  return (
    <div className="min-h-screen bg-[#09090b] pt-28 pb-12 font-inter text-white">
      <div className="max-w-[1360px] mx-auto px-4 md:px-6">
        
        {/* Navigation Breadcrumb */}
        <Link href="/matches" className="inline-flex items-center text-zinc-400 hover:text-yellow-500 mb-6 transition-colors font-medium">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back to Matches
        </Link>

        {/* Success/Error Overlays inside Page content instead of full screen modal */}
        {successTx ? (
           <div className="w-full bg-zinc-900 border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 mb-8">
             <div className="mb-6">
               <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
             </div>
             <h3 className="text-4xl font-black mb-4">Shares Purchased!</h3>
             <p className="text-zinc-400 mb-8 max-w-md mx-auto text-lg text-center">Your shares have been secured on-chain. You can track your positions in your portfolio.</p>
             <div className="flex gap-4">
               <a href={`https://explorer.solana.com/tx/${successTx}?cluster=devnet`} target="_blank" rel="noreferrer" className="py-3 px-8 bg-zinc-800 hover:bg-zinc-700 font-bold rounded-xl transition-all">
                 View on Explorer
               </a>
               <button onClick={() => setSuccessTx(null)} className="py-3 px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-black rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                 Trade More
               </button>
             </div>
           </div>
        ) : errorTx ? (
           <div className="w-full bg-zinc-900 border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 mb-8">
             <div className="mb-6">
               <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />
             </div>
             <h3 className="text-4xl font-black mb-4">Transaction Failed</h3>
             <p className="text-zinc-400 mb-8 max-w-md mx-auto text-lg text-center break-words">{errorTx}</p>
             <button onClick={() => setErrorTx(null)} className="py-3 px-8 bg-zinc-800 hover:bg-zinc-700 font-black rounded-xl transition-all">
               Try Again
             </button>
           </div>
        ) : (
          <div className="bg-[#09090b] w-full rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
            
            {/* Left Side: Chart & Info */}
            <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10">
              
              {/* Markets Tab Bar */}
              <div className="flex gap-4 px-6 pt-6 border-b border-white/10 shrink-0 overflow-x-auto scrollbar-hide bg-zinc-950/50">
                {markets.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setMarketId(m.id); setSelectedOption(null); setSelectedPlayer(null); }}
                    className={`pb-4 font-bold whitespace-nowrap transition-all ${marketId === m.id ? 'text-white border-b-2 border-yellow-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {m.title}
                  </button>
                ))}
              </div>

              {/* Header */}
              <div className="p-6 md:p-10 border-b border-white/10 shrink-0 bg-zinc-900/20">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/5 relative overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
                    {currentMarket.id === 'winner' ? (
                      <>
                        <Image src={`https://flagcdn.com/w80/${match.homeFlag.toLowerCase()}.png`} alt="Home" width={40} height={26} className="absolute top-2 left-2 rounded shadow-sm" />
                        <Image src={`https://flagcdn.com/w80/${match.awayFlag.toLowerCase()}.png`} alt="Away" width={40} height={26} className="absolute bottom-2 right-2 rounded shadow-sm" />
                      </>
                    ) : currentMarket.id === 'player_props' && selectedPlayer ? (
                      <img src={selectedPlayer.image} alt={selectedPlayer.name} className="w-full h-full object-cover" />
                    ) : (
                      <SparklesIcon className="w-10 h-10 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">{currentMarket.question}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-zinc-400 text-sm md:text-base font-medium">
                      <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span> Pool: 14,237,146 SOL</span>
                      <span>Deadline: {new Date(match.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><SparklesIcon className="w-4 h-4 text-zinc-500"/> 12,345 Holders</span>
                    </div>
                  </div>
                </div>
              </div>

              {marketId === 'player_props' && !selectedPlayer ? (
                <div className="p-6 md:p-10 flex-1 flex flex-col min-h-[400px]">
                  <h3 className="text-2xl font-black mb-8 text-white text-center">Select a Player</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Home Team */}
                    <div>
                      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <Image src={`https://flagcdn.com/w40/${match.homeFlag.toLowerCase()}.png`} alt="Home" width={24} height={16} className="rounded-sm" />
                        <h4 className="text-xl font-bold text-white">{match.homeTeam}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {mockPlayers.home.map(player => (
                          <button
                            key={player.id}
                            onClick={() => setSelectedPlayer(player)}
                            className="relative rounded-2xl overflow-hidden group border border-white/10 hover:border-yellow-500 transition-all aspect-[3/4]"
                          >
                            <img src={player.image} alt={player.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-left flex flex-col justify-end h-full">
                              <span className="font-black text-white text-base md:text-lg leading-tight group-hover:text-yellow-400 transition-colors">{player.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Away Team */}
                    <div>
                      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <Image src={`https://flagcdn.com/w40/${match.awayFlag.toLowerCase()}.png`} alt="Away" width={24} height={16} className="rounded-sm" />
                        <h4 className="text-xl font-bold text-white">{match.awayTeam}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {mockPlayers.away.map(player => (
                          <button
                            key={player.id}
                            onClick={() => setSelectedPlayer(player)}
                            className="relative rounded-2xl overflow-hidden group border border-white/10 hover:border-yellow-500 transition-all aspect-[3/4]"
                          >
                            <img src={player.image} alt={player.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-left flex flex-col justify-end h-full">
                              <span className="font-black text-white text-base md:text-lg leading-tight group-hover:text-yellow-400 transition-colors">{player.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chart Area */}
                  <div className="p-6 md:p-10 flex-1 flex flex-col min-h-[400px]">
                    <div className="flex justify-between items-end mb-10 shrink-0">
                      <div>
                        {marketId === 'player_props' && selectedPlayer && (
                          <button 
                            onClick={() => setSelectedPlayer(null)}
                            className="text-zinc-500 hover:text-yellow-500 flex items-center font-bold text-sm mb-4 transition-colors"
                          >
                            <ChevronLeftIcon className="w-4 h-4 mr-1" />
                            Back to Players
                          </button>
                        )}
                        <div className="text-4xl font-black text-white flex items-baseline gap-4 tracking-tight">
                          {selectedOption && selectedOption.price ? (selectedOption.price * 100).toFixed(0) : 42}% chance
                          <span className="text-green-500 text-xl font-bold">▲ 14%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 w-full relative min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dummyChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#eab308" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="time" stroke="#3f3f46" tick={{fill: '#71717a', fontSize: 13, fontWeight: 600}} tickLine={false} axisLine={false} dy={15} />
                          <YAxis stroke="#3f3f46" tick={{fill: '#71717a', fontSize: 13, fontWeight: 600}} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} orientation="right" dx={15} />
                          <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '16px', fontWeight: 'bold', padding: '12px 16px' }} itemStyle={{ color: '#eab308' }} />
                          <Area type="monotone" dataKey="value" stroke="#eab308" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Positions Table */}
                  <div className="p-6 md:p-10 border-t border-white/10 bg-zinc-900/30 shrink-0">
                    <h3 className="text-2xl font-black text-white mb-6">Positions</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm md:text-base">
                        <thead className="text-zinc-500 uppercase font-black text-xs tracking-wider border-b border-white/5">
                          <tr>
                            <th className="pb-4">Outcome</th>
                            <th className="pb-4">Qty</th>
                            <th className="pb-4">Avg</th>
                            <th className="pb-4">Value</th>
                            <th className="pb-4 text-right">Return</th>
                          </tr>
                        </thead>
                        <tbody className="text-white font-medium">
                          {stake && !isNaN(parseFloat(stake)) && selectedOption ? (
                            <tr className="border-b border-white/5 hover:bg-zinc-800/30 transition-colors">
                              <td className="py-5 flex items-center gap-3">
                                <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-black uppercase">Yes</span>
                                <span className="font-bold">{selectedOption.label}</span>
                              </td>
                              <td className="py-5 font-bold">{(parseFloat(stake) * 100).toLocaleString()}</td>
                              <td className="py-5 font-bold">{selectedOption.price || (1 / selectedOption.odd).toFixed(2)} SOL</td>
                              <td className="py-5">
                                <div className="font-bold text-lg">{(parseFloat(stake) * selectedOption.odd).toFixed(2)} SOL</div>
                                <div className="text-xs text-zinc-500">Cost: {parseFloat(stake).toFixed(2)} SOL</div>
                              </td>
                              <td className="py-5 text-green-500 text-right font-bold text-lg">+0.00 (0.00%)</td>
                            </tr>
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-zinc-500 font-medium">No active positions for this market.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Side: Trading Panel */}
            <div className="w-full lg:w-[450px] bg-zinc-950 flex flex-col shrink-0 relative lg:min-h-full">
              <div className="flex-1 p-6 md:p-8">
                {/* Buy / Sell Tabs */}
                <div className="flex bg-zinc-900 p-1.5 rounded-2xl mb-8 border border-white/5">
                  <button 
                    onClick={() => setTradeMode('buy')}
                    className={`flex-1 py-3 font-bold rounded-xl transition-all ${tradeMode === 'buy' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Buy
                  </button>
                  <button 
                    onClick={() => setTradeMode('sell')}
                    className={`flex-1 py-3 font-bold rounded-xl transition-all ${tradeMode === 'sell' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Sell
                  </button>
                </div>

                {/* Yes / No Outcomes */}
                <div className="flex flex-col gap-4 mb-8">
                  {currentMarket.options.map(opt => (
                    <button 
                      key={opt.label}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full py-5 px-6 rounded-2xl border-2 font-black text-center transition-all flex justify-between items-center ${
                        selectedOption?.label === opt.label 
                          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.15)]' 
                          : 'border-white/5 bg-zinc-900 text-zinc-400 hover:border-white/20 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {opt.flag && (
                          <div className="w-8 h-6 relative rounded-sm overflow-hidden shrink-0 shadow-sm">
                            <Image src={`https://flagcdn.com/w40/${opt.flag.toLowerCase()}.png`} alt="" fill className="object-cover" />
                          </div>
                        )}
                        <span className="text-lg text-left">{opt.label}</span>
                      </div>
                      <span className="text-xl shrink-0">{opt.price} SOL</span>
                    </button>
                  ))}
                </div>

                {/* Limit Price */}
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 mb-8 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-zinc-400 font-bold text-sm uppercase tracking-wide">Limit Price</span>
                    <span className="text-zinc-500 text-sm font-bold">Balance: {user ? '12.4' : '0.00'} SOL</span>
                  </div>
                  <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-white/5">
                    <span className="text-zinc-600 font-bold px-3 text-xl cursor-pointer hover:text-white">−</span>
                    <span className="flex-1 text-center text-white font-black text-2xl">{selectedOption ? selectedOption.price || (1 / selectedOption.odd).toFixed(2) : 0} SOL</span>
                    <span className="text-zinc-600 font-bold px-3 text-xl cursor-pointer hover:text-white">+</span>
                  </div>
                </div>

                {/* Shares Input */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-zinc-400 font-bold text-sm uppercase tracking-wide">Shares</label>
                  </div>
                  <div className="relative mb-4">
                    <input 
                      type="number"
                      placeholder="0"
                      value={stake ? Math.round(parseFloat(stake) * 100).toString() : ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) setStake((val / 100).toFixed(2));
                        else setStake('');
                      }}
                      className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-white font-black text-3xl focus:outline-none focus:border-yellow-500 text-right transition-colors"
                    />
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {[-100, -10, '+Min', '+10', '+100'].map(val => (
                      <button 
                        key={val}
                        onClick={() => {
                          if (val === '+Min') { setStake('0.10'); return; }
                          const current = parseFloat(stake) || 0;
                          const amount = parseInt(val.toString()) / 100;
                          const newVal = Math.max(0, current + amount);
                          setStake(newVal.toFixed(2));
                        }}
                        className="bg-zinc-900 border border-white/5 hover:bg-zinc-800 hover:border-white/20 text-zinc-400 hover:text-white rounded-xl py-3 text-sm font-black transition-all"
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Section (Sticky Bottom) */}
              <div className="p-6 md:p-8 bg-zinc-950/80 backdrop-blur-md border-t border-white/10 shrink-0 sticky bottom-0 z-10">
                <div className="flex justify-between items-end mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-zinc-500">You'll receive</span>
                    <span className="text-yellow-500 font-black text-base uppercase tracking-widest">To Win</span>
                  </div>
                  <div className="flex flex-col text-right gap-1">
                    <span className="text-sm font-bold text-zinc-400">{stake ? stake : '0.00'} SOL</span>
                    <span className="text-yellow-500 font-black text-3xl">{stake && !isNaN(parseFloat(stake)) && selectedOption ? (parseFloat(stake) * selectedOption.odd).toFixed(2) : '0.00'} SOL</span>
                  </div>
                </div>

                <button 
                  onClick={handlePlaceBet}
                  disabled={predictionLoading || !stake || isNaN(parseFloat(stake)) || !selectedOption}
                  className="w-full py-5 bg-yellow-500 hover:bg-yellow-600 text-white font-black text-2xl rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(234,179,8,0.3)]"
                >
                  {predictionLoading ? 'Confirming...' : (selectedOption ? `Buy Yes` : 'Unavailable')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TxLINE Live Data Panel */}
        <div className="mt-8">
          <TxLineLivePanel />
        </div>
      </div>
    </div>
  );
}

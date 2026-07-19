'use client';

import { TrophyIcon, CheckBadgeIcon, MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useState } from 'react';

const mockLeaderboard = [
  { id: '1', rank: 1, wallet: '8x...2A9p', xp: 4500, level: 12, winRate: 78, predictions: 45 },
  { id: '2', rank: 2, wallet: '3K...9m2L', xp: 4250, level: 11, winRate: 75, predictions: 42 },
  { id: '3', rank: 3, wallet: 'F9...1x4B', xp: 3900, level: 10, winRate: 71, predictions: 40 },
  { id: '4', rank: 4, wallet: 'A1...7d3Z', xp: 3750, level: 10, winRate: 68, predictions: 43 },
  { id: '5', rank: 5, wallet: 'P4...8q5N', xp: 3500, level: 9, winRate: 65, predictions: 38 },
];

export default function LeaderboardPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="container mx-auto px-4 pt-32 pb-12 max-w-5xl font-inter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <TrophyIcon className="text-primary w-8 h-8" />
            Global Leaderboard
          </h1>
          <p className="text-zinc-400 text-lg">See how you rank against other fans globally.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search wallet..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-900 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold text-zinc-400 text-sm w-20 text-center">Rank</th>
                <th className="px-6 py-4 font-bold text-zinc-400 text-sm">Fan Identity (Wallet)</th>
                <th className="px-6 py-4 font-bold text-zinc-400 text-sm text-right">Predictions</th>
                <th className="px-6 py-4 font-bold text-zinc-400 text-sm text-right">Win Rate</th>
                <th className="px-6 py-4 font-bold text-zinc-400 text-sm text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockLeaderboard.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-6 text-center">
                    {user.rank === 1 ? (
                      <div className="w-8 h-8 mx-auto bg-[#F8DC6C]/20 rounded-full flex items-center justify-center text-[#F8DC6C] border border-[#F8DC6C]/30">
                        <CheckBadgeIcon className="w-4 h-4" />
                      </div>
                    ) : user.rank === 2 ? (
                      <div className="w-8 h-8 mx-auto bg-gray-300/20 rounded-full flex items-center justify-center text-gray-300 border border-gray-300/30">
                        <CheckBadgeIcon className="w-4 h-4" />
                      </div>
                    ) : user.rank === 3 ? (
                      <div className="w-8 h-8 mx-auto bg-amber-600/20 rounded-full flex items-center justify-center text-amber-500 border border-amber-600/30">
                        <CheckBadgeIcon className="w-4 h-4" />
                      </div>
                    ) : (
                      <span className="font-bold text-zinc-500">{user.rank}</span>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-white/10">
                        <StarIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{user.wallet}</p>
                        <p className="text-xs text-zinc-500 mt-1">Level {user.level} Fan</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right font-medium text-zinc-300">
                    {user.predictions}
                  </td>
                  <td className="px-6 py-6 text-right font-medium text-zinc-300">
                    {user.winRate}%
                  </td>
                  <td className="px-6 py-6 text-right font-bold text-primary">
                    {user.xp.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

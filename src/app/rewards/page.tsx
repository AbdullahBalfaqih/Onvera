'use client';

import { StarIcon, GiftIcon, TicketIcon, LockClosedIcon, UserCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useFanPassport } from '@/hooks/useFanPassport';
import Image from 'next/image';

const rewards = [
  {
    id: 1,
    title: 'World Cup Final Ticket',
    description: 'Win a VIP ticket to the 2026 World Cup Final. Requires Level 20.',
    xpCost: 50000,
    levelReq: 20,
    icon: <TicketIcon className="w-8 h-8 text-primary" />,
    image: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba6?auto=format&fit=crop&w=400&q=80',
    locked: true
  },
  {
    id: 2,
    title: 'Signed National Jersey',
    description: 'Get an official jersey signed by a player of your favorite team.',
    xpCost: 15000,
    levelReq: 10,
    icon: <GiftIcon className="w-8 h-8 text-primary" />,
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80',
    locked: true
  },
  {
    id: 3,
    title: 'Onvera Genesis NFT',
    description: 'Mint your exclusive Onvera Genesis Fan Badge as a compressed NFT.',
    xpCost: 5000,
    levelReq: 5,
    icon: <CheckBadgeIcon className="w-8 h-8 text-primary" />,
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80',
    locked: false
  },
  {
    id: 4,
    title: 'Premium Avatar Border',
    description: 'Stand out on the leaderboard with a shiny gold avatar border.',
    xpCost: 2000,
    levelReq: 2,
    icon: <UserCircleIcon className="w-8 h-8 text-primary" />,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    locked: false
  }
];

export default function RewardsPage() {
  const { user, passport } = useFanPassport();
  const currentXP = passport?.xp || 0;
  const currentLevel = passport?.level || 1;

  return (
    <div className="container mx-auto px-4 pt-32 pb-12 max-w-5xl font-inter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <GiftIcon className="text-primary w-8 h-8" />
            Fan Rewards
          </h1>
          <p className="text-zinc-400 text-lg">Exchange your hard-earned XP for exclusive prizes and digital collectibles.</p>
        </div>
        
        {user && (
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 flex items-center gap-6 shrink-0">
            <div>
              <p className="text-sm text-zinc-400 mb-1">Your Balance</p>
              <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-white">{currentXP.toLocaleString()} XP</span>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div>
              <p className="text-sm text-zinc-400 mb-1">Current Level</p>
              <span className="text-2xl font-bold text-white">Lvl {currentLevel}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rewards.map((reward) => {
          const canAfford = currentXP >= reward.xpCost;
          const meetsLevel = currentLevel >= reward.levelReq;
          const isEligible = canAfford && meetsLevel;

          return (
            <div key={reward.id} className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden group hover:border-primary/30 transition-colors flex flex-col">
              <div className="h-48 relative overflow-hidden bg-zinc-800">
                <Image 
                  src={reward.image} 
                  alt={reward.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                <div className="absolute bottom-4 left-6 drop-shadow-md">
                  {reward.icon}
                </div>
                {reward.locked && !meetsLevel && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center text-sm font-bold border border-white/10">
                    <LockClosedIcon className="w-4 h-4 mr-1.5" /> Requires Lvl {reward.levelReq}
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">{reward.title}</h3>
                <p className="text-zinc-400 flex-1 mb-6">{reward.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <StarIcon className={`w-5 h-5 ${canAfford ? 'text-primary' : 'text-zinc-500'}`} />
                    <span className={`font-bold text-lg ${canAfford ? 'text-white' : 'text-zinc-500'}`}>
                      {reward.xpCost.toLocaleString()} XP
                    </span>
                  </div>
                  
                  <button 
                    disabled={!isEligible || !user}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                      isEligible 
                        ? 'bg-primary text-black hover:bg-primary/90 hover:scale-105' 
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {isEligible ? 'Claim Reward' : 'Locked'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

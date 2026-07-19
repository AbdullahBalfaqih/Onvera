'use client';

import { useState } from 'react';
import Image from 'next/image';

const cards = [
  {
    id: 1,
    number: '01',
    title: 'Passport Minting',
    subtitle: 'Create your unique Web3 identity. Your passport securely tracks your predictions, rewards, and achievements on-chain.',
    tag: 'Identity',
    image: '/real_passport.png', 
  },
  {
    id: 2,
    number: '02',
    title: 'Match Predictions',
    subtitle: 'Predict match outcomes and climb the leaderboard with every correct guess. Prove your football knowledge.',
    tag: 'Predict',
    image: '/real_predictions.png',
  },
  {
    id: 3,
    number: '03',
    title: 'Global Community',
    subtitle: 'Join forces with other fans worldwide. Participate in massive global tournaments and discuss strategies.',
    tag: 'Social',
    image: '/real_community.png',
  },
  {
    id: 4,
    number: '04',
    title: 'Exclusive Rewards',
    subtitle: 'Unlock rare merchandise, VIP tickets, and digital collectibles based on your Web3 fan reputation.',
    tag: 'Program',
    image: '/real_rewards.png',
  }
];

export function ExpandingAccordion() {
  const [activeCard, setActiveCard] = useState(1);

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-5 shrink-0 w-full max-w-[1360px] h-[600px] lg:h-[500px]">
      {cards.map((card) => {
        const isActive = activeCard === card.id;
        return (
          <div
            key={card.id}
            onMouseEnter={() => setActiveCard(card.id)}
            className={`relative rounded-[24px] overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex ${
              isActive ? 'flex-[3] lg:flex-[4] shadow-2xl' : 'flex-1 shadow-md hover:flex-[1.2]'
            }`}
          >
            {/* Background Image */}
            <Image 
              src={card.image} 
              alt={card.title} 
              fill 
              className={`object-cover transition-transform duration-[2s] ease-out ${isActive ? 'scale-100' : 'scale-110'}`}
            />
            
            {/* Gradient Overlay & Bottom Blur */}
            <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${isActive ? 'from-black/80 via-black/20 to-transparent opacity-100' : 'from-black/50 to-transparent opacity-60'}`}></div>
            
            {/* Premium Bottom Blur (Fades upwards) - Always visible */}
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/80 via-black/30 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,black_10%,transparent_100%)]"></div>

            {/* Content Container */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              
              {/* Top Row: Number & Tag */}
              <div className="flex items-center gap-2.5">
                <div className="flex py-2.5 px-5 items-center justify-center rounded-[14px] bg-black/40 backdrop-blur-md">
                  <span className="text-white font-inter text-base font-medium tracking-wide">{card.number}</span>
                </div>
                
                {/* Tag only shows when active */}
                <div 
                  className={`flex py-2.5 px-5 items-center justify-center rounded-[14px] bg-black/40 backdrop-blur-md transition-all duration-500 delay-100 ${
                    isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
                  }`}
                >
                  <span className="text-white font-inter text-base font-medium tracking-wide">{card.tag}</span>
                </div>
              </div>

              {/* Bottom Row: Title & Subtitle */}
              <div 
                className={`flex flex-col items-start gap-3 transition-all duration-700 delay-100 relative z-10 ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                }`}
              >
                <h3 className="text-white font-inter text-[32px] sm:text-[40px] font-medium tracking-tight leading-tight">
                  {card.title}
                </h3>
                <p className="text-white/90 font-inter text-base sm:text-lg leading-relaxed max-w-[450px]">
                  {card.subtitle}
                </p>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}

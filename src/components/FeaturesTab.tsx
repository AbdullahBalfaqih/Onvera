'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  {
    id: 'predictions',
    label: 'Predictions',
    title: 'Predict matches on-chain with zero fees',
    desc: 'Make your predictions for every World Cup match. Our smart contracts ensure full transparency and immediate payouts.',
  },
  {
    id: 'reputation',
    label: 'Reputation',
    title: 'Why Web3 fan identity changes everything',
    desc: 'At Passport, we recognize that every fan is unique. Build your immutable reputation on Solana based on your sports knowledge.',
  },
  {
    id: 'nfts',
    label: 'NFTs',
    title: 'Collect exclusive digital memorabilia',
    desc: 'Unlock rare NFTs as you level up. Trade them on the marketplace or hold them for future utility and governance rights.',
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    title: 'Climb the global ranks and prove your worth',
    desc: 'Compete with thousands of fans worldwide. Top predictors share massive prize pools at the end of each tournament stage.',
  },
  {
    id: 'community',
    label: 'Community',
    title: 'Join a vibrant ecosystem of sports fans',
    desc: 'Connect with like-minded fans, form alliances, and discuss strategies in our token-gated community channels.',
  },
];

export function FeaturesTab() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeContent = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="flex py-[140px] px-4 sm:px-10 flex-col justify-center items-center shrink-0 bg-[#F6F6F6] w-full h-auto py-20 overflow-hidden max-w-full">
      <div className="flex max-w-[1360px] flex-col lg:flex-row items-stretch gap-6 shrink-0 w-full h-auto">
        
        {/* Left Side: Interactive Tabs and Content */}
        <div className="flex flex-col p-8 sm:p-12 items-start gap-12 shrink-0 rounded-[24px] bg-[#FFF] w-full lg:w-[55%] h-auto min-h-[600px] lg:min-h-[650px]">
          
          {/* Pills Container */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full h-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex py-4 px-2 sm:px-4 justify-center items-center rounded-[16.4px] transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  activeTab === tab.id ? 'bg-[#F8DC6C] shadow-md' : 'bg-[#F6F6F6] hover:bg-gray-200'
                }`}
              >
                <p className="text-[#000] font-inter text-[16px] sm:text-[20px] lg:text-[24px] xl:text-[28px] font-medium leading-[1.2] tracking-[-0.0313em] whitespace-nowrap">
                  {tab.label}
                </p>
              </button>
            ))}
          </div>

          {/* Dynamic Content */}
          <div className="flex flex-col items-start w-full h-auto mt-auto mb-auto relative min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-start gap-6"
              >
                <h3 className="text-[#000] font-inter text-[40px] sm:text-[56px] font-medium leading-[1.2] tracking-[-0.04em]">
                  {activeContent.title}
                </h3>
                <p className="text-[rgba(0,0,0,0.75)] font-inter text-[18px] sm:text-[20px] leading-[1.6] max-w-[500px] tracking-[-0.05em]">
                  {activeContent.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Fixed Image Component */}
        <div className="shrink-0 w-full lg:w-[45%] h-[600px] lg:h-auto min-h-[600px] lg:min-h-[650px] overflow-hidden rounded-[24px] relative bg-gray-900 group">
          <img 
            src="/person.png" 
            alt="Feature Image" 
            className="absolute inset-0 w-full h-full object-cover scale-[1.15] origin-bottom group-hover:scale-[1.20] transition-transform duration-[1.5s] ease-out" 
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

          {/* Overlay Content */}
          <div className="absolute bottom-8 left-8 right-8 flex flex-col justify-end items-start gap-8">
            <p className="text-[#FFF] font-inter text-[24px] sm:text-[32px] font-medium leading-[1.2] tracking-[-0.0313em]">
              We deliver rewarding experiences tailored to each fan's unique passion and goals.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 w-full">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F8DC6C] to-orange-500 overflow-hidden relative border-2 border-white/20 flex items-center justify-center">
                    <span className="text-[#000] font-bold text-2xl">S</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-[#FFF] font-inter text-xl font-semibold leading-tight tracking-[-0.0417em]">
                    Satoshi
                  </p>
                  <p className="text-[rgba(255,255,255,0.75)] font-inter text-lg leading-tight tracking-[-0.05em]">
                    Top Fan
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button className="flex py-4 px-8 justify-center items-center rounded-xl bg-[#FFF] hover:bg-[#F8DC6C] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg">
                <p className="text-[#000] font-inter text-[20px] sm:text-[24px] font-medium leading-[1.2] tracking-[-0.0385em]">
                  Join Now
                </p>
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

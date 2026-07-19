'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { TrophyIcon } from '@heroicons/react/24/solid';
import { useFanPassport } from '@/hooks/useFanPassport';
import { motion } from 'framer-motion';

import { useWalletModal } from '@solana/wallet-adapter-react-ui';

function CustomWalletButton() {
  const { connected, disconnect, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  const address = publicKey?.toBase58();
  const displayAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "Connect";

  return (
    <button 
      onClick={handleClick}
      className="flex py-3 px-6 justify-center items-center shrink-0 rounded-xl bg-[#F8DC6C] border-none outline-none cursor-pointer shadow-lg hover:bg-[#e5ca63] transition-colors"
    >
      <div className="flex justify-center items-center shrink-0 overflow-hidden">
        <p className="text-[#000] font-inter text-[20px] font-medium leading-[24px] w-fit tracking-[-0.0385em]">
          {displayAddress}
        </p>
      </div>
    </button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { connected } = useWallet();
  const { user, passport } = useFanPassport();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= window.innerHeight - 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[1360px] px-4 pointer-events-none">
      <div className="flex justify-between items-center w-full h-16 pointer-events-auto bg-[#888888] sm:bg-transparent rounded-2xl">
        
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0 w-auto sm:w-[179px] h-full pl-2 sm:pl-0">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center shrink-0 w-[55px] h-[55px]">
              <TrophyIcon className="w-8 h-8 text-[#F8DC6C]" />
            </div>
            <div className="flex flex-col items-start w-fit">
              <p className={`${isScrolled ? 'text-black' : 'text-[#FFF]'} transition-colors duration-300 font-inter text-[32px] font-medium leading-[38.4px] w-fit tracking-[-0.0313em] drop-shadow-md`}>
                Onvera
              </p>
            </div>
          </Link>
        </div>

        {/* Pill Navigation */}
        <div className="hidden lg:flex p-1 justify-center items-center shrink-0 rounded-2xl bg-[rgba(25,25,25,0.8)] backdrop-blur-md h-16 shadow-lg border border-white/10 relative">
          {[
            { name: 'Home', path: '/' },
            { name: 'Passport', path: '/passport' },
            { name: 'Predictions', path: '/predictions' },
            { name: 'Leaderboard', path: '/leaderboard' },
            { name: 'Rewards', path: '/rewards' },
            { name: 'Matches', path: '/matches' },
          ].map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`relative cursor-pointer text-nowrap flex py-3 px-5 flex-col justify-center items-center gap-2.5 shrink-0 rounded-xl h-14 overflow-hidden transition-colors z-10 ${
                  !isActive ? 'hover:bg-white/10' : ''
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-[#FFF] rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <p className={`font-inter text-xl leading-8 w-fit tracking-[-0.05em] transition-colors duration-300 ${isActive ? 'text-[#000]' : 'text-[#FFF]'}`}>
                  {item.name}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Right Action Area */}
        <div className="flex h-full items-center mr-2 sm:mr-0 gap-4">
          {user && (
            <div className="hidden sm:flex justify-center items-center gap-3 px-6 py-3 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
              <span className="text-white font-inter text-[20px] font-medium leading-[24px]">Lvl {passport?.level || 1}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
              <span className="text-primary font-inter text-[20px] font-medium leading-[24px]">{passport?.xp || 0} XP</span>
            </div>
          )}
          <CustomWalletButton />
        </div>
        
      </div>
    </nav>
  );
}

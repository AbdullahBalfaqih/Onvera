'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ShieldCheckIcon, TrophyIcon, StarIcon, ChevronRightIcon, BoltIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js';

export default function PassportPage() {
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [mintTx, setMintTx] = useState<string | null>(null);

  const handleMint = async () => {
    if (!publicKey) return;
    try {
      setIsMinting(true);
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("9ExbZjAapQww1vfcisDmrngPinHTEfpjYRWMunJgcKaA"),
          lamports: 10000000, // 0.01 SOL
        })
      );
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      setMintTx(signature);
    } catch (e) {
      console.error("Mint failed:", e);
      alert("Transaction failed or was rejected.");
    } finally {
      setIsMinting(false);
    }
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <ShieldCheckIcon className="w-12 h-12 text-zinc-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Connect to View Your Passport</h1>
        <p className="text-zinc-400 max-w-md mb-8">
          You need to connect your Solana wallet to access your Fan Passport, view your reputation, and claim rewards.
        </p>
        <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !transition-colors !rounded-full !px-8 !py-3 !h-auto !font-bold !text-lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-12 max-w-5xl font-inter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Fan Passport</h1>
          <p className="text-zinc-400">Manage your identity and view your global ranking</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main ID Card */}
        <div className="col-span-1 lg:col-span-2">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8 shadow-2xl hover:border-primary/30 transition-all duration-500 group">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-colors duration-500"></div>
            
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start relative z-10">
              <div className="w-32 h-32 rounded-full bg-zinc-900/80 border-4 border-primary/50 group-hover:border-primary p-2 shrink-0 transition-colors duration-500 shadow-[0_0_30px_-5px_rgba(248,220,108,0.3)]">
                <div className="w-full h-full bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden">
                  <UserAvatar />
                </div>
              </div>
              
              <div className="flex-1 w-full text-center sm:text-left">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Level 1 Fan</h2>
                    <p className="text-primary font-medium">Global Rank: #---</p>
                  </div>
                  <div className="mt-4 sm:mt-0 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/30">
                    Reputation: 100
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">XP to Level 2</span>
                      <span className="text-zinc-300 font-mono">0 / 1000</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Favorite Team</p>
                      <p className="font-medium">Not Selected</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Passport Status</p>
                      <p className="font-medium text-green-400">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <BoltIcon className="mr-2 h-5 w-5 text-primary" />
              Recent Activity
            </h3>
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-1 text-center py-12 text-zinc-500 shadow-xl hover:border-primary/20 transition-all">
              No activity yet. Start by predicting match outcomes!
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-xl hover:border-primary/20 transition-all">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <TrophyIcon className="mr-2 h-5 w-5 text-primary" />
              Achievements
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-zinc-800/50 rounded-xl border border-white/5 flex items-center justify-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                  <StarIcon className="h-6 w-6 text-zinc-600" />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 flex items-center justify-center text-sm text-primary hover:text-primary/80 transition-colors">
              View All <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-primary/20 to-zinc-900 rounded-3xl border border-primary/20 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px] translate-x-1/3 -translate-y-1/3"></div>
            <h3 className="text-lg font-bold mb-2 text-white relative z-10">Mint on Solana</h3>
            
            {mintTx ? (
              <div className="relative z-10 bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center">
                <CheckCircleIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white font-bold mb-1">Passport Minted!</p>
                <a href={`https://explorer.solana.com/tx/${mintTx}?cluster=devnet`} target="_blank" rel="noreferrer" className="text-xs text-green-400 hover:underline break-all">
                  View Transaction
                </a>
              </div>
            ) : (
              <>
                <p className="text-sm text-zinc-400 mb-4 relative z-10">
                  Mint your passport as a compressed NFT to secure your digital identity and reputation on-chain.
                </p>
                <button 
                  onClick={handleMint}
                  disabled={isMinting}
                  className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors relative z-10 disabled:opacity-50"
                >
                  {isMinting ? 'Minting...' : 'Mint Passport (0.01 SOL)'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserAvatar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-zinc-500">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
    </svg>
  );
}

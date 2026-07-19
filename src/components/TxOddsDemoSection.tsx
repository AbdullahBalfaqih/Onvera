'use client';

import { CodeBracketIcon, CircleStackIcon, ShieldCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const TxOddsDemoSection = () => {
  return (
    <section className="w-full py-24 bg-[#09090b] relative border-t border-white/5 z-20">
      <div className="max-w-[1360px] mx-auto px-6 xl:px-0">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-20 text-center">
          <div className="px-4 py-1.5 rounded-full bg-[#f8dc6c]/10 border border-[#f8dc6c]/20 mb-6 flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-[#f8dc6c]" />
            <span className="text-[#f8dc6c] text-xs font-bold uppercase tracking-widest">Built for Judges</span>
          </div>
          <h2 className="text-white font-inter text-5xl md:text-7xl font-bold tracking-tight mb-6">
            TxODDS V3 Integration
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
            Our platform features deep integration with the TxODDS V3 API, utilizing historical data replays, compressed multiproofs, and on-chain Merkle tree validation for Trustless payouts.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Historical Data */}
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 hover:border-[#f8dc6c]/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CircleStackIcon className="w-7 h-7 text-[#f8dc6c]" />
            </div>
            <h3 className="text-2xl text-white font-bold mb-3">Historical Replay API</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Instead of relying on live streams (`/api/scores/stream`) during the hackathon, we utilize the historical data endpoint for accurate demo replays, fetching sequential real-world data from up to 2 weeks ago.
            </p>
            <div className="bg-black rounded-xl p-4 border border-white/5 font-mono text-xs text-zinc-300 overflow-x-auto">
              <span className="text-blue-400">const</span> endpoint = <span className="text-green-400">`/api/scores/historical/${'{'}fixtureId{'}'}`</span>;<br/>
              <span className="text-blue-400">const</span> response = <span className="text-blue-400">await</span> axios.get(endpoint);<br/>
              <span className="text-zinc-500">{"// Extracting real Seq for stat validation"}</span><br/>
              <span className="text-blue-400">const</span> seq = response.data.seq;
            </div>
          </div>

          {/* Card 2: 12-Byte Leaf Hashing */}
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 hover:border-[#f8dc6c]/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CodeBracketIcon className="w-7 h-7 text-[#f8dc6c]" />
            </div>
            <h3 className="text-2xl text-white font-bold mb-3">TxLINE Validation Format</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              To validate outcomes securely on-chain, we format leaves for SHA-256 hashing strictly as 12-bytes using little-endian encoding before traversing the Merkle tree.
            </p>
            <div className="bg-black rounded-xl p-4 border border-white/5 font-mono text-xs text-zinc-300 overflow-x-auto">
              <span className="text-zinc-500">{"// SHA-256 over exactly 12 bytes"}</span><br/>
              <span className="text-pink-400">struct</span> StatLeaf {'{'}<br/>
              &nbsp;&nbsp;key: <span className="text-blue-400">u32</span>, <span className="text-zinc-500">{"// 4 bytes (LE)"}</span><br/>
              &nbsp;&nbsp;value: <span className="text-blue-400">i32</span>, <span className="text-zinc-500">{"// 4 bytes (LE)"}</span><br/>
              &nbsp;&nbsp;period: <span className="text-blue-400">i32</span>, <span className="text-zinc-500">{"// 4 bytes (LE)"}</span><br/>
              {'}'}
            </div>
          </div>

          {/* Card 3: Compressed Multiproofs */}
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 hover:border-[#f8dc6c]/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <DocumentTextIcon className="w-7 h-7 text-[#f8dc6c]" />
            </div>
            <h3 className="text-2xl text-white font-bold mb-3">V3 Multiproofs & Verification</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Fully upgraded to the latest `validateStatV3` method. We parse `is_right_sibling` directly on-chain to determine hash ordering, ensuring completely trustless Oracle resolution.
            </p>
            <div className="bg-black rounded-xl p-4 border border-white/5 font-mono text-xs text-zinc-300 overflow-x-auto">
              <span className="text-blue-400">if</span> (node.is_right_sibling) {'{'}<br/>
              &nbsp;&nbsp;hash(current || sibling);<br/>
              {'}'} <span className="text-blue-400">else</span> {'{'}<br/>
              &nbsp;&nbsp;hash(sibling || current);<br/>
              {'}'}<br/>
              <span className="text-zinc-500">{"// V3 On-chain call"}</span><br/>
              program.methods.validateStatV3(...)
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TxOddsDemoSection;

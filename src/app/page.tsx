import Image from "next/image";
import { CountUp } from "@/components/CountUp";
import { FeaturesTab } from "@/components/FeaturesTab";
import { ExpandingAccordion } from "@/components/ExpandingAccordion";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
export default function PassportSportsCoachFramerTemplate() {
  return (
    <div className="flex flex-col items-start bg-transparent w-full min-h-screen relative isolate overflow-x-hidden">
      <div className="flex flex-col items-start bg-transparent w-full">
        <div className="flex min-h-screen h-auto flex-col items-center bg-transparent w-full h-full overflow-hidden max-w-full">
          <div className="shrink-0 w-full min-h-screen h-auto overflow-hidden max-w-full relative">
            <div className="flex justify-center items-center gap-2.5 w-full min-h-screen h-auto fixed -z-10 left-0 top-0 overflow-hidden max-w-full">
              <Image src="/hero.png" alt="Hero Background" fill className="object-cover" priority />
            </div>
            <div className="bg-linear-[180deg,rgba(84,84,84,0.00)0%,rgba(0,0,0,0.60)100%] w-full h-auto fixed -z-10 left-0 top-[297px] overflow-hidden max-w-full"></div>
            <div className="flex py-5 px-10 flex-col justify-end items-center gap-[100px] w-full min-h-screen h-auto fixed -z-10 left-0 top-0 overflow-hidden max-w-full">
              <div className="flex max-w-[1360px] flex-col justify-end items-start gap-2.5 shrink-0 w-full h-auto overflow-visible relative z-10">
                <div className="flex flex-col xl:flex-row justify-between items-center xl:items-end gap-8 shrink-0 w-full max-w-[1360px] h-auto overflow-visible flex-wrap xl:flex-nowrap">
                  <div className="flex flex-col items-center xl:items-start shrink-0 flex-1 min-w-0 w-full xl:w-auto">
                    <p className="text-[#F8DC6C] font-inter text-[80px] sm:text-[120px] md:text-[150px] lg:text-[180px] xl:text-[200px] 2xl:text-[250px] font-bold leading-none w-full text-center xl:text-left tracking-[-0.04em] whitespace-nowrap">
                      Onvera
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-center xl:items-start gap-10 shrink-0 w-full xl:w-[398px] h-auto overflow-visible mb-10 xl:mb-0">
                    <p className="text-[#FFF] font-inter text-[24px] sm:text-[32px] font-medium leading-[1.2] w-full max-w-[399px] text-center xl:text-left tracking-[-0.0313em]">
                      On-chain fan identity layer
                    </p>
                    <div className="flex py-3 px-6 justify-center items-center shrink-0 rounded-xl bg-[#F8DC6C] w-[157px] h-[55px]">
                      <div className="flex justify-center items-center shrink-0 w-[109px] h-[31px] overflow-hidden max-w-full">
                        <div className="flex items-start shrink-0 w-[109px] h-[31px] overflow-hidden max-w-full">
                          <div className="flex flex-col items-start w-fit h-full">
                            <p className="text-[#000] font-inter text-[26px] font-medium leading-[31.2px] w-fit tracking-[-0.0385em]">
                              J
                            </p>
                          </div>
                          <div className="flex flex-col items-start w-fit h-full">
                            <p className="text-[#000] font-inter text-[26px] font-medium leading-[31.2px] w-fit tracking-[-0.0385em]">
                              o
                            </p>
                          </div>
                          <div className="flex flex-col items-start w-fit h-full">
                            <p className="text-[#000] font-inter text-[26px] font-medium leading-[31.2px] w-fit tracking-[-0.0385em]">
                              i
                            </p>
                          </div>
                          <div className="flex flex-col items-start w-fit h-full">
                            <p className="text-[#000] font-inter text-[26px] font-medium leading-[31.2px] w-fit tracking-[-0.0385em]">
                              n
                            </p>
                          </div>
                          <div className="shrink-0 w-1.5 h-full"></div>
                          <div className="flex flex-col items-start w-fit h-full">
                            <p className="text-[#000] font-inter text-[26px] font-medium leading-[31.2px] w-fit tracking-[-0.0385em]">
                              N
                            </p>
                          </div>
                          <div className="flex flex-col items-start w-fit h-full">
                            <p className="text-[#000] font-inter text-[26px] font-medium leading-[31.2px] w-fit tracking-[-0.0385em]">
                              o
                            </p>
                          </div>
                          <div className="flex flex-col items-start w-fit h-full">
                            <p className="text-[#000] font-inter text-[26px] font-medium leading-[31.2px] w-fit tracking-[-0.0385em]">
                              w
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex py-[140px] px-[41px] flex-col justify-center items-center shrink-0 bg-[#FFF] w-full h-auto py-20 overflow-hidden max-w-full">
            <div className="flex max-w-full max-w-[1360px] flex-col items-start gap-20 shrink-0 w-full max-w-[1360px] h-auto">
              {/* Top Big Stats Block */}
              <div className="flex flex-col justify-center items-center lg:items-start gap-2 shrink-0 w-full max-w-[1360px] h-auto overflow-hidden max-w-full mb-4">
                <p className="text-[#000] text-center lg:text-left font-inter text-[80px] sm:text-[120px] font-semibold leading-[1] tracking-[-0.04em]">
                  <CountUp end={10000} suffix="+" format="comma" />
                </p>
                <p className="text-[#000] text-center lg:text-left font-inter text-[24px] sm:text-[32px] font-medium leading-[1.2] tracking-[-0.0313em]">
                  Active Web3 Passports Minted
                </p>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 lg:gap-24 shrink-0 w-full max-w-[1360px] h-auto">
                {/* Left Column - Image Grid */}
                <div className="w-full lg:w-[45%] flex justify-center lg:justify-start">
                  <div className="grid grid-cols-2 gap-4 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px]">
                    <div className="w-full h-full rounded-[40px] overflow-hidden relative shadow-md">
                      <img src="/FANS.png" alt="Fan 1" className="absolute w-[220%] max-w-none h-[220%] top-[-10%] left-[-10%] object-cover" />
                    </div>
                    <div className="w-full h-full rounded-full overflow-hidden relative shadow-md">
                      <img src="/FANS.png" alt="Fan 2" className="absolute w-[220%] max-w-none h-[220%] top-[-10%] right-[-10%] object-cover" />
                    </div>
                    <div className="w-full h-full rounded-full overflow-hidden relative shadow-md">
                      <img src="/FANS.png" alt="Fan 3" className="absolute w-[220%] max-w-none h-[220%] bottom-[-10%] left-[-10%] object-cover" />
                    </div>
                    <div className="w-full h-full rounded-[40px] overflow-hidden relative shadow-md">
                      <img src="/FANS.png" alt="Fan 4" className="absolute w-[220%] max-w-none h-[220%] bottom-[-10%] right-[-10%] object-cover" />
                    </div>
                  </div>
                </div>

                {/* Right Column - Text & Stats */}
                <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start gap-16">
                  <div className="w-full h-auto relative text-center lg:text-left">
                    <p className="text-[#000] font-inter text-[40px] sm:text-[56px] font-medium leading-[1.2] tracking-[-0.04em]">
                      Join Today, Passport has united over 10,000 football fans to build reputation.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8 shrink-0 w-full h-auto overflow-hidden">
                    {/* Column 1 */}
                    <div className="flex flex-col justify-center sm:justify-start items-center sm:items-start gap-4 flex-1">
                      <p className="text-[#000] text-center sm:text-left font-inter text-[64px] lg:text-[80px] font-semibold leading-[1] tracking-[-0.04em]">
                        <CountUp end={10000} suffix="+" format="comma" />
                      </p>
                      <p className="text-[#000] text-center sm:text-left font-inter text-[20px] sm:text-[24px] font-bold leading-[1.2] tracking-[-0.0313em]">
                        Active Solana Fans
                      </p>
                      <p className="text-[#000] text-center sm:text-left opacity-60 font-inter text-[16px] sm:text-[18px] leading-[1.5]">
                        Thousands of users have minted their Web3 Passport and are actively predicting matches.
                      </p>
                    </div>

                    {/* Vertical Separator */}
                    <div className="w-[1px] bg-[#000]/10 self-stretch hidden sm:block mx-2"></div>
                    {/* Horizontal Separator on mobile */}
                    <div className="w-full h-[1px] bg-[#000]/10 block sm:hidden my-4"></div>

                    {/* Column 2 */}
                    <div className="flex flex-col justify-center sm:justify-start items-center sm:items-start gap-4 flex-1">
                      <p className="text-[#000] text-center sm:text-left font-inter text-[64px] lg:text-[80px] font-semibold leading-[1] tracking-[-0.04em]">
                        <CountUp end={1000000} suffix="+" format="compact" />
                      </p>
                      <p className="text-[#000] text-center sm:text-left font-inter text-[20px] sm:text-[24px] font-bold leading-[1.2] tracking-[-0.0313em]">
                        Predictions Made
                      </p>
                      <p className="text-[#000] text-center sm:text-left opacity-60 font-inter text-[16px] sm:text-[18px] leading-[1.5]">
                        Our smart contracts have securely processed over a million World Cup match predictions on-chain.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
          <FeaturesTab />
          <div className="flex py-[140px] px-10 flex-col justify-center items-center gap-2.5 shrink-0 bg-[#FFF] w-full h-auto py-20 overflow-hidden max-w-full">
            <div className="flex max-w-full max-w-[1360px] flex-col items-start gap-16 shrink-0 w-full max-w-[1360px] h-auto">
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 shrink-0 w-full max-w-[1360px] min-h-[134px] mb-8">
                <div className="max-w-[826px] shrink-0 w-full lg:w-[826px] relative">
                  <h2 className="text-[#000] text-center sm:text-left font-inter text-[40px] sm:text-[56px] font-medium leading-[1.2] tracking-[-0.04em]">
                    Mint your paspassport, we’ll guide you every step of the way
                  </h2>
                </div>
                <button className="flex py-3 px-8 justify-center items-center shrink-0 rounded-xl bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors">
                  <span className="text-[#000] font-inter text-[20px] font-medium tracking-tight">
                    View More
                  </span>
                </button>
              </div>
              <ExpandingAccordion />
            </div>
          </div>
          <TestimonialsSection />
          <ContactSection />
          {/* Footer Section */}
          <div className="relative w-full flex flex-col justify-center items-center pt-20 lg:pt-32 pb-0 bg-zinc-950 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/footer.png')", boxShadow: "0 50vh 0 50vh #09090b" }}>
            
            <div className="relative z-10 w-full max-w-[1360px] px-6 lg:px-10 flex flex-col items-center gap-16 mt-8 mb-0">
               
              {/* Subscription Bar */}
              <div className="w-full max-w-[660px] bg-[#00000030] backdrop-blur-md rounded-[20px] p-2 pl-6 flex justify-between items-center shadow-lg transition-all border border-white/10">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="bg-transparent text-white placeholder-white/60 outline-none w-full text-lg font-inter"
                />
                <button className="bg-[#F8DC6C] text-black font-medium text-lg px-8 py-3 rounded-xl whitespace-nowrap hover:bg-[#e5c95c] transition-colors ml-4">
                  Subscribe
                </button>
              </div>

              {/* Main Footer Card */}
              <div className="w-full bg-[#00000060] backdrop-blur-xl border border-white/10 rounded-[40px] p-10 sm:p-12 lg:p-16 flex flex-col gap-12 lg:gap-20 shadow-2xl">
                
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-20">
                  
                  {/* Left: Heading and Button */}
                  <div className="flex flex-col items-start gap-10 max-w-[540px]">
                    <h2 className="text-white font-inter text-[40px] sm:text-[48px] lg:text-[52px] font-medium leading-[1.15] tracking-[-0.03em]">
                      Join the Onvera Family and build your Web3 Fan Identity
                    </h2>
                    <button className="bg-white text-black font-medium text-xl px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
                      Join Now
                    </button>
                  </div>

                  {/* Right: Links */}
                  <div className="flex flex-wrap sm:flex-nowrap gap-16 lg:gap-24 pt-4">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-white text-2xl font-inter font-medium tracking-tight mb-2">Explore Features</h3>
                      <div className="flex flex-col gap-5">
                        <a href="#" className="text-white/70 hover:text-white font-inter transition-colors text-lg">Passports</a>
                        <a href="#" className="text-white/70 hover:text-white font-inter transition-colors text-lg">Predictions</a>
                        <a href="#" className="text-white/70 hover:text-white font-inter transition-colors text-lg">Rewards</a>
                        <a href="#" className="text-white/70 hover:text-white font-inter transition-colors text-lg">Leaderboard</a>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <h3 className="text-white text-2xl font-inter font-medium tracking-tight mb-2">Support</h3>
                      <div className="flex flex-col gap-5">
                        <a href="#" className="text-white/70 hover:text-white font-inter transition-colors text-lg">FAQs</a>
                        <a href="#" className="text-white/70 hover:text-white font-inter transition-colors text-lg">Contact us</a>
                        <a href="#" className="text-white/70 hover:text-white font-inter transition-colors text-lg">404</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div className="w-full h-[1px] bg-white/10 mt-4 mb-2"></div>

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-8">
                  {/* Logo Text */}
                  <h1 className="text-[#F8DC6C] font-inter text-[80px] sm:text-[100px] lg:text-[130px] font-bold leading-none tracking-[-0.04em] pb-2">
                    Onvera
                  </h1>
                  
                  {/* Policies */}
                  <div className="flex items-center gap-6 sm:gap-8 mb-4 sm:mb-8 flex-wrap justify-center">
                    <a href="#" className="text-white font-inter font-medium text-base sm:text-lg hover:text-white/80 transition-colors">Privacy & Policy</a>
                    <a href="#" className="text-white font-inter font-medium text-base sm:text-lg hover:text-white/80 transition-colors">Terms & Conditions</a>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
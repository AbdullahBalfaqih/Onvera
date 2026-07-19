"use client";

export function ContactSection() {
  return (
    <div className="w-full bg-white py-20 lg:py-32 px-6 lg:px-10 flex justify-center border-t border-gray-100">
      <div className="w-full max-w-[1360px] grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
        
        {/* Left Column */}
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <h2 className="text-black font-inter text-[60px] sm:text-[80px] lg:text-[100px] font-bold leading-none tracking-[-0.04em]">
              Let's talk
            </h2>
            <p className="text-[rgba(0,0,0,0.75)] font-inter text-[28px] sm:text-[32px] font-medium tracking-tight">
              Tell us about your intarested
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-20 lg:mt-32">
            <div className="flex flex-col gap-4">
              <h3 className="text-[#959595] font-inter text-2xl font-semibold tracking-[-0.02em]">
                Location
              </h3>
              <p className="text-black font-inter text-xl leading-relaxed max-w-[240px]">
                152 Thatcher Road St, Mahattan, NY 10463, US
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-[#959595] font-inter text-2xl font-semibold tracking-[-0.02em]">
                Inquiry
              </h3>
              <div className="flex flex-col gap-2">
                <a href="mailto:hello@coach.com" className="text-black font-inter text-xl hover:opacity-70 transition-opacity">
                  hello@coach.com
                </a>
                <a href="tel:+0685689696" className="text-black font-inter text-xl hover:opacity-70 transition-opacity">
                  +0685689696
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Form) */}
        <div className="flex flex-col gap-12 pt-4">
          <h2 className="text-black font-inter text-[40px] sm:text-[48px] lg:text-[56px] font-medium leading-[1.1] tracking-[-0.03em] max-w-[600px]">
            Interested in learning something for fitness
          </h2>
          
          <form className="flex flex-col gap-8 w-full max-w-[660px]" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-3">
              <label className="text-[rgba(0,0,0,0.75)] font-inter text-xl tracking-tight">
                Name
              </label>
              <input 
                type="text" 
                placeholder="Jane Smith"
                className="w-full bg-[#F6F6F6] rounded-[10px] px-6 py-4 outline-none text-lg text-black placeholder:text-[#959595] focus:ring-2 focus:ring-gray-200 transition-all"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[rgba(0,0,0,0.75)] font-inter text-xl tracking-tight">
                Email
              </label>
              <input 
                type="email" 
                placeholder="jane@framer.com"
                className="w-full bg-[#F6F6F6] rounded-[10px] px-6 py-4 outline-none text-lg text-black placeholder:text-[#959595] focus:ring-2 focus:ring-gray-200 transition-all"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[rgba(0,0,0,0.75)] font-inter text-xl tracking-tight">
                Email {/* Intentionally keeping the typo from the screenshot */}
              </label>
              <textarea 
                placeholder="Write a Message"
                rows={4}
                className="w-full bg-[#F6F6F6] rounded-[10px] px-6 py-4 outline-none text-lg text-black placeholder:text-[#959595] focus:ring-2 focus:ring-gray-200 transition-all resize-none"
              />
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <button 
                type="submit"
                className="w-full bg-black text-white rounded-[10px] py-5 text-2xl font-medium tracking-tight hover:bg-black/90 transition-colors active:scale-[0.99]"
              >
                Submit
              </button>
              <p className="text-[rgba(0,0,0,0.75)] font-inter text-sm tracking-tight">
                Straighten your teeth comfortably with clear aligners or traditional braces
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

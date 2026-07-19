'use client';

import { useState } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    quote: "“As a beginner, I was nervous about starting a structured sports program. Passport made the process smooth and encouraging. The step-by-step guidance, supportive community,”",
    role: "Top Predictor",
    image: "/fan_portrait_1.png"
  },
  {
    id: 2,
    quote: "“The rewards system completely changed how I interact with football matches. Predicting games on-chain and earning exclusive VIP tickets has been an incredible journey.”",
    role: "Die-hard Fan",
    image: "/fan_portrait_2.png"
  },
  {
    id: 3,
    quote: "“Connecting with a global community of fans who share the same passion is priceless. The digital passport is my proudest Web3 identity.”",
    role: "Community Leader",
    image: "/fan_portrait_3.png"
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');

  const changeTestimonial = (direction: 'next' | 'prev') => {
    if (fadeState === 'fade-out') return; // Prevent spam clicking while animating
    
    setFadeState('fade-out');
    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (direction === 'next') return (prev + 1) % testimonials.length;
        return (prev - 1 + testimonials.length) % testimonials.length;
      });
      setFadeState('fade-in');
    }, 400); // 400ms transition duration
  };

  const current = testimonials[currentIndex];

  return (
    <div className="flex py-20 lg:py-[140px] px-6 lg:px-10 flex-col justify-center items-center bg-white w-full h-auto overflow-hidden">
      <div className="flex flex-col gap-16 lg:gap-20 w-full max-w-[1360px]">
        
        {/* Top Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 w-full">
          {/* Top Left: Avatars */}
          <div className="flex flex-col items-start gap-5 w-full lg:w-[382px] shrink-0">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-[118px] h-[118px] rounded-full border-[6px] border-white overflow-hidden relative shadow-sm">
                  <Image 
                    src={`/fan_portrait_${i}.png`} 
                    alt={`Avatar ${i}`} 
                    fill 
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-[#959595] font-inter text-[32px] font-medium leading-[38.4px] tracking-[-0.03em]">
              10k+ Fans Connected
            </p>
          </div>

          {/* Top Right: Heading */}
          <div className="w-full lg:max-w-[808px]">
            <h2 className="text-[#000] font-inter text-[40px] lg:text-[56px] font-medium leading-[1.2] tracking-[-0.04em]">
              What our fans say about the Passport experience and the rewards they’ve earned
            </h2>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 w-full">
          
          {/* Bottom Left: Image */}
          <div className="w-full lg:w-[465px] shrink-0 aspect-[4/5] sm:aspect-square relative rounded-[34px] overflow-hidden shadow-sm bg-gray-100">
            <Image 
              src={current.image} 
              alt={current.role} 
              fill 
              className={`object-cover transition-all duration-500 ease-in-out ${
                fadeState === 'fade-out' ? 'opacity-0 scale-90 translate-x-4' : 'opacity-100 scale-100 translate-x-0'
              }`}
            />
          </div>

          {/* Bottom Right: Testimonial Card */}
          <div className="flex-1 bg-[#F6F6F6] rounded-[34.8px] p-8 sm:p-12 lg:p-[60px] flex flex-col justify-between overflow-hidden">
            <div className={`flex-1 transition-all duration-500 ease-in-out ${
              fadeState === 'fade-out' ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'
            }`}>
              <p className="text-[#000] font-inter text-[24px] sm:text-[28px] lg:text-[32px] font-medium leading-[1.4] tracking-[-0.02em] max-w-[834px]">
                {current.quote}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-8 mt-12 w-full">
              <div className={`transition-all duration-500 ease-in-out delay-75 ${
                fadeState === 'fade-out' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}>
                <p className="text-[#959595] font-inter text-[32px] font-medium tracking-[-0.03em]">
                  {current.role}
                </p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => changeTestimonial('prev')}
                  className="w-[84px] h-[84px] bg-white rounded-2xl flex justify-center items-center shadow-sm hover:shadow-md transition-shadow active:scale-95 text-black"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => changeTestimonial('next')}
                  className="w-[84px] h-[84px] bg-white rounded-2xl flex justify-center items-center shadow-sm hover:shadow-md transition-shadow active:scale-95 text-black"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

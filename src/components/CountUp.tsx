'use client';

import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  format?: 'comma' | 'compact';
}

export function CountUp({ end, duration = 2500, suffix = '', format = 'comma' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end); // Ensure we end exactly on the target
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  let formattedCount = count.toString();
  if (format === 'comma') {
    formattedCount = count.toLocaleString('en-US');
  } else if (format === 'compact') {
    formattedCount = Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(count);
  }

  return (
    <span ref={ref} className="tabular-nums">
      {formattedCount}{suffix}
    </span>
  );
}

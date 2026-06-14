import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScoreRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ percentage, size = 64, strokeWidth = 6 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const [animatedOffset, setAnimatedOffset] = useState(circumference);
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedOffset(strokeDashoffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [strokeDashoffset]);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayNumber(Math.round(eased * percentage));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [percentage]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={`${percentage} percent complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2A2A2A"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#CCFF00"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: animatedOffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold text-white leading-none">{displayNumber}</span>
        <span className="text-[9px] text-[#A1A1AA] font-medium">%</span>
      </div>
    </div>
  );
}

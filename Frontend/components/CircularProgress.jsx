import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const CircularProgress = ({ value, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      controls.start({
        strokeDashoffset: 440 - (440 * value) / 100,
        transition: { duration: 1.5, ease: "easeOut" }
      });

      // Animate the counter
      const duration = 1500;
      const step = (value / duration) * 10;
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= value) {
          current = value;
          clearInterval(timer);
        }
        setAnimatedValue(Math.round(current));
      }, 10);

      return () => clearInterval(timer);
    }
  }, [isInView, value, controls]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const initialOffset = circumference;

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 160 160">
          {/* Background circle with gradient */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#bgGradient)"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          {/* Progress circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: initialOffset }}
            animate={controls}
            transform="rotate(-90 80 80)"
          />
          <defs>
            {/* Background gradient matching bg-gradient-to-br from-primary/5 to-blue-500/5 */}
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(0, 0%, 9%, 0.05)" /> {/* --primary at 5% opacity */}
              <stop offset="100%" stopColor="hsl(217, 91%, 60%, 0.05)" /> {/* blue-500 equivalent at 5% opacity */}
            </linearGradient>
            
            {/* Progress gradient - using your chart colors for better visibility */}
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(198, 30.90%, 31.80%)" /> {/* --chart-3 */}
              <stop offset="100%" stopColor="hsl(173, 58%, 39%)" /> {/* --chart-2 */}
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="hsl(173, 58%, 39%)" floodOpacity="0.4" />
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="hsl(197, 37%, 24%)" floodOpacity="0.2" />
            </filter>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">
            {animatedValue}%
          </span>
        </div>
      </div>
      <p className="mt-1 text-xs text-center text-muted-foreground">{label}</p>
    </div>
  );
};

export { CircularProgress };
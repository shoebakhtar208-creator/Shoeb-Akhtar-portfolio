
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const AnimatedMoon = () => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);
  
  // --- CURSOR TRACKING ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Soft, realistic spring physics
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate smooth offset
      const { innerWidth, innerHeight } = window;
      const range = 10; // 10px movement radius
      const xPct = (e.clientX / innerWidth - 0.5) * 2;
      const yPct = (e.clientY / innerHeight - 0.5) * 2;
      
      mouseX.set(xPct * range);
      mouseY.set(yPct * range);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // --- BLINK ANIMATION (Random 1-2s) ---
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const cycleBlink = () => {
      const delay = Math.random() * 1000 + 1000; // 1s to 2s
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 180); // Fast blink
        cycleBlink();
      }, delay);
    };
    cycleBlink();
    return () => clearTimeout(timeoutId);
  }, []);

  // --- SMILE ANIMATION (Every 3-4s) ---
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const cycleSmile = () => {
      const delay = Math.random() * 1000 + 3000; // 3s to 4s
      timeoutId = setTimeout(() => {
        setIsSmiling(true);
        setTimeout(() => setIsSmiling(false), 2000); // Hold smile
        cycleSmile();
      }, delay);
    };
    cycleSmile();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    // CSS & HTML STRUCTURE
    // Strict positioning per user request: Top-Right
    <div 
      className="absolute pointer-events-none opacity-90"
      style={{ 
        position: 'absolute', 
        right: '12%', 
        top: '8%', 
        zIndex: -1 
      }}
    >
      <div className="relative w-32 h-32 md:w-56 md:h-56 filter drop-shadow-[0_0_40px_rgba(255,216,90,0.3)]">
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id="moonGradient" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFFDE7" />
            </radialGradient>
          </defs>
          
          {/* Moon Body */}
          <circle cx="100" cy="100" r="90" fill="url(#moonGradient)" />
          
          {/* Subtle Craters */}
          <circle cx="60" cy="60" r="10" fill="rgba(220,220,230,0.2)" />
          <circle cx="140" cy="130" r="15" fill="rgba(220,220,230,0.15)" />
          
          {/* EYES GROUP - Follows Cursor */}
          <motion.g style={{ x, y }}>
             {/* Left Eye */}
             <motion.ellipse 
               cx="70" cy="85" 
               rx="8" ry={12} 
               fill="#1a1a1a"
               animate={{ scaleY: isBlinking ? 0.1 : 1 }}
               transition={{ duration: 0.1 }}
             />
             {/* Right Eye */}
             <motion.ellipse 
               cx="130" cy="85" 
               rx="8" ry={12} 
               fill="#1a1a1a" 
               animate={{ scaleY: isBlinking ? 0.1 : 1 }}
               transition={{ duration: 0.1 }}
             />
             {/* Eye Shine */}
             <motion.g animate={{ opacity: isBlinking ? 0 : 1 }}>
               <circle cx="74" cy="80" r="3" fill="white" opacity="0.9" />
               <circle cx="134" cy="80" r="3" fill="white" opacity="0.9" />
             </motion.g>
          </motion.g>
          
          {/* MOUTH GROUP */}
          <g transform="translate(100, 115)">
            {/* Neutral Mouth (Fades out when smiling) */}
            <motion.path 
              d="M -10 0 Q 0 5 10 0" 
              fill="none" 
              stroke="#1a1a1a" 
              strokeWidth="2" 
              strokeLinecap="round"
              animate={{ opacity: isSmiling ? 0 : 0.5 }}
            />
            
            {/* Smile (Fades in and scales) */}
            <motion.path 
              d="M -15 -2 Q 0 15 15 -2" 
              fill="none" 
              stroke="#1a1a1a" 
              strokeWidth="3" 
              strokeLinecap="round"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isSmiling ? 1 : 0,
                scale: isSmiling ? 1.1 : 0.8,
                y: isSmiling ? 0 : -2
              }}
              transition={{ duration: 0.4 }}
            />
          </g>
          
          {/* Cheeks (Appear with smile) */}
          <motion.g animate={{ opacity: isSmiling ? 0.6 : 0 }}>
             <ellipse cx="60" cy="105" rx="10" ry="6" fill="#FFB6C1" />
             <ellipse cx="140" cy="105" rx="10" ry="6" fill="#FFB6C1" />
          </motion.g>

        </svg>
      </div>
    </div>
  );
};

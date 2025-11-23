import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const AnimatedMoon = () => {
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Motion values for tracking (relative offset in pixels)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for eye movement (Ease: easeOutQuad-ish feel via damping)
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    // --- 1. IDLE ANIMATION (Blinking) ---
    let blinkTimeout: ReturnType<typeof setTimeout>;
    
    const blinkLoop = () => {
      // Random interval between 1s and 3s
      const nextBlink = Math.random() * 2000 + 1000; 
      
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        
        // Blink duration: 150ms
        setTimeout(() => {
          setIsBlinking(false);
          blinkLoop();
        }, 150);
      }, nextBlink);
    };
    
    blinkLoop();
    return () => clearTimeout(blinkTimeout);
  }, []);

  useEffect(() => {
    // --- 2. CURSOR TRACKING ANIMATION ---
    let idleResetTimeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = (e: MouseEvent) => {
      // Interaction Rule: On mobile (<768px), cursor tracking is disabled
      if (window.innerWidth < 768) return;

      const { innerWidth, innerHeight } = window;
      
      // Normalize mouse position (-1 to 1)
      const xPct = (e.clientX / innerWidth - 0.5) * 2;
      const yPct = (e.clientY / innerHeight - 0.5) * 2;

      // Interaction Rule: Eyes move within a small radius (12px)
      const range = 12; 
      mouseX.set(xPct * range);
      mouseY.set(yPct * range);

      // Interaction Rule: If cursor stops for 2s -> return to idle (center)
      clearTimeout(idleResetTimeout);
      idleResetTimeout = setTimeout(() => {
        mouseX.set(0);
        mouseY.set(0);
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(idleResetTimeout);
    };
  }, [mouseX, mouseY]);

  return (
    // Visual Design: Soft white glow, slight shadow
    <div className="relative w-32 h-32 md:w-48 md:h-48 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="moonGradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFFDE7" /> {/* Subtle yellow tint */}
          </radialGradient>
        </defs>
        
        {/* Moon Base */}
        <circle cx="100" cy="100" r="95" fill="url(#moonGradient)" />
        
        {/* Subtle Craters for texture (Premium feel) */}
        <circle cx="60" cy="60" r="12" fill="rgba(220,220,230,0.2)" />
        <circle cx="140" cy="130" r="18" fill="rgba(220,220,230,0.15)" />
        <circle cx="90" cy="160" r="8" fill="rgba(220,220,230,0.1)" />

        {/* Eyes Group - Moves with Cursor */}
        <motion.g style={{ x, y }}>
           {/* Left Eye */}
           <motion.ellipse 
             cx="70" cy="85" 
             rx="8" ry={12} 
             fill="#1a1a1a"
             animate={{ 
               scaleY: isBlinking ? 0.1 : 1, // Squash effect for blink
             }}
             transition={{ duration: 0.1 }}
           />
           
           {/* Right Eye */}
           <motion.ellipse 
             cx="130" cy="85" 
             rx="8" ry={12} 
             fill="#1a1a1a" 
             animate={{ 
               scaleY: isBlinking ? 0.1 : 1 
             }}
             transition={{ duration: 0.1 }}
           />
           
           {/* Eye Shine (Cute Factor) - Hidden during blink */}
           <motion.g animate={{ opacity: isBlinking ? 0 : 1 }}>
             <circle cx="74" cy="80" r="3" fill="white" opacity="0.9" />
             <circle cx="134" cy="80" r="3" fill="white" opacity="0.9" />
           </motion.g>
        </motion.g>
        
        {/* Cheeks (Subtle cute detail) */}
        <ellipse cx="60" cy="105" rx="10" ry="5" fill="#FFB6C1" opacity="0.3" />
        <ellipse cx="140" cy="105" rx="10" ry="5" fill="#FFB6C1" opacity="0.3" />
      </svg>
    </div>
  );
};
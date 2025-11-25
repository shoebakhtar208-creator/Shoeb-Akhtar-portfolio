
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS, CAROUSEL_CONFIG } from '../constants';
import { GlassCard } from './GlassCard';

export const TestimonialCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentX, setCurrentX] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs for animation state to avoid re-renders during loop
  const stateRef = useRef({
    x: 0,
    lastTime: 0,
    isHovering: false,
    isTouching: false,
    dragStartX: 0,
    dragCurrentX: 0
  });

  // accessibility live region text
  const [ariaMessage, setAriaMessage] = useState("");

  // Create a tripled list to ensure smooth infinite looping even on large screens
  const displayItems = useMemo(() => [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS], []);
  const singleSetCount = TESTIMONIALS.length;

  // Animation Loop
  const animate = useCallback((time: number) => {
    if (!stateRef.current.lastTime) stateRef.current.lastTime = time;
    const delta = time - stateRef.current.lastTime;
    stateRef.current.lastTime = time;

    const { isHovering, isTouching } = stateRef.current;
    
    // Auto-scroll logic (only if not paused by interaction)
    if (!isHovering && !isTouching && !isPaused) {
      // Move left (negative X)
      const moveAmount = (CAROUSEL_CONFIG.SPEED_PX_PER_SEC * delta) / 1000;
      stateRef.current.x -= moveAmount;
    }

    // Measure widths dynamically for responsiveness
    // Assuming all cards + gaps are roughly uniform, but we measure the single set width
    if (containerRef.current && containerRef.current.firstElementChild) {
       const firstCard = containerRef.current.firstElementChild as HTMLElement;
       const cardWidth = firstCard.offsetWidth + CAROUSEL_CONFIG.GAP_PX;
       const singleSetWidth = cardWidth * singleSetCount;

       // Infinite Loop Check
       // If we've scrolled past the first set, reset position instantly to 0 (or technically add singleSetWidth)
       if (stateRef.current.x <= -singleSetWidth) {
         stateRef.current.x += singleSetWidth;
       }
       // If we dragged too far right (positive), wrap back to end
       if (stateRef.current.x > 0) {
         stateRef.current.x -= singleSetWidth;
       }
    }

    // Apply Transform
    if (containerRef.current) {
      containerRef.current.style.transform = `translate3d(${stateRef.current.x}px, 0, 0)`;
    }

    requestAnimationFrame(animate);
  }, [singleSetCount, isPaused]);

  useEffect(() => {
    const rAF = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rAF);
  }, [animate]);

  // Handlers
  const handleMouseEnter = () => { stateRef.current.isHovering = true; };
  const handleMouseLeave = () => { stateRef.current.isHovering = false; };

  const handleTouchStart = (e: React.TouchEvent) => {
    stateRef.current.isTouching = true;
    stateRef.current.dragStartX = e.touches[0].clientX;
    stateRef.current.dragCurrentX = stateRef.current.x;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!stateRef.current.isTouching) return;
    const deltaX = e.touches[0].clientX - stateRef.current.dragStartX;
    stateRef.current.x = stateRef.current.dragCurrentX + deltaX;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Add small delay before resuming auto-scroll to allow "flick" reading
    setTimeout(() => {
        stateRef.current.isTouching = false;
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % displayItems.length;
      document.getElementById(`testimonial-${nextIndex}`)?.focus();
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + displayItems.length) % displayItems.length;
      document.getElementById(`testimonial-${prevIndex}`)?.focus();
    } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        setAriaMessage(isPaused ? "Auto-scroll resumed" : "Auto-scroll paused");
    }
  };

  const handleFocus = (index: number) => {
    stateRef.current.isHovering = true; // Pause on focus
    setFocusedIndex(index);
    // Announce position
    const realIndex = (index % singleSetCount) + 1;
    setAriaMessage(`Testimonial ${realIndex} of ${singleSetCount}: ${displayItems[index].name}`);
  };

  const handleBlur = () => {
    stateRef.current.isHovering = false; // Resume
    setFocusedIndex(null);
  };

  return (
    <div 
      className="relative w-full overflow-hidden py-10 group"
      role="region" 
      aria-label="Success Stories Carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Visually Hidden Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite">{ariaMessage}</div>

      <div 
        ref={containerRef}
        className="flex will-change-transform"
        style={{ gap: `${CAROUSEL_CONFIG.GAP_PX}px` }}
      >
        {displayItems.map((testi, index) => (
          <div 
            key={`${index}-${testi.name}`}
            id={`testimonial-${index}`}
            role="article"
            aria-label={`Testimonial from ${testi.name}`}
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            className="flex-shrink-0 relative transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-2xl"
            style={{ 
                width: 'var(--card-width)',
                // CSS variable logic for responsive width
                '--card-width': `clamp(${CAROUSEL_CONFIG.CARD_WIDTH_MOBILE}px, 30vw, ${CAROUSEL_CONFIG.CARD_WIDTH_DESKTOP}px)`
            } as React.CSSProperties}
          >
            <GlassCard 
                className="h-full flex flex-col justify-between hover:!scale-100" 
                hoverEffect={false} // Disable default hover scale to prevent layout thrashing in carousel
            >
              <div>
                <div className="flex gap-1 mb-4" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#D4AF37" className="text-gold-400" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-300 italic mb-6 leading-relaxed">
                  "{testi.text}"
                </blockquote>
              </div>
              <footer className="flex items-center gap-4">
                 {/* Placeholder for Logo/Avatar if needed, using initials for now */}
                 <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold text-sm">
                    {testi.name.charAt(0)}
                 </div>
                 <div>
                    <cite className="font-bold text-white not-italic block">{testi.name}</cite>
                    <span className="text-gold-500 text-sm">{testi.role}</span>
                 </div>
              </footer>
            </GlassCard>
          </div>
        ))}
      </div>
      
      {/* Debug Overlay */}
      {typeof window !== 'undefined' && (window as any).DEBUG_TESTIMONIALS && (
         <div className="absolute top-0 left-0 bg-black/80 text-green-500 p-2 text-xs font-mono pointer-events-none z-50">
            OFFSET: {stateRef.current.x.toFixed(1)}px<br/>
            TOTAL ITEMS: {displayItems.length}<br/>
            PAUSED: {String(stateRef.current.isHovering)}
         </div>
      )}
    </div>
  );
};

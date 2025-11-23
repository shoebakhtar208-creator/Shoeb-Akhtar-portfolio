
import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
// @ts-ignore
import { BeeController } from '../utils/bee';

export const Bee3D = () => {
  const { scene, camera, size } = useThree();
  const beeRef = useRef<any>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize Bee Module
  useEffect(() => {
    beeRef.current = new BeeController(scene, camera);
    return () => {
      if (beeRef.current) beeRef.current.dispose();
    };
  }, [scene, camera]);

  // Handle Mouse Interaction
  useEffect(() => {
    // Check mobile (disable interaction)
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;

      // Reset Idle Timer
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      // If cursor stops for 2s, deactivate repulsion
      timeoutRef.current = setTimeout(() => {
        mouseRef.current.active = false;
      }, 2000);
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Frame Loop
  useFrame((state, delta) => {
    if (beeRef.current) {
      beeRef.current.update(
        delta, 
        mouseRef.current, 
        size.width, 
        size.height
      );
    }
  });

  return null; // The bee adds itself to the scene
};
    
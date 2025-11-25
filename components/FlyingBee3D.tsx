
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function FlyingBee3D() {
  const group = useRef<THREE.Group>(null);
  const leftWing = useRef<THREE.Mesh>(null);
  const rightWing = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // --- MATERIALS ---
  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#1a1a1a', // Glassy Black
    roughness: 0.1,
    metalness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  }), []);

  const stripeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFD700', // Bright Yellow
    emissive: '#FFD700',
    emissiveIntensity: 0.6,
    roughness: 0.3,
  }), []);

  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFD700',
    emissive: '#FFA500',
    emissiveIntensity: 1.5, // Glowing eyes
  }), []);

  const wingMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    transmission: 0.6,
    opacity: 0.7,
    transparent: true,
    roughness: 0.1,
    metalness: 0,
  }), []);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.getElapsedTime();

    // 1. MOUSE TRACKING
    // Convert mouse range (-1 to 1) to viewport units
    const targetX = (state.mouse.x * viewport.width) / 3; 
    const targetY = (state.mouse.y * viewport.height) / 3;

    // Smooth Lerp Position
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.06);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.06);
    
    // Rotate body to face movement slightly (Banking)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -state.mouse.x * 0.5, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.mouse.y * 0.3, 0.05);

    // 2. HOVER ANIMATION (Gentle Sine Wave)
    group.current.position.y += Math.sin(time * 3) * 0.003;

    // 3. WING FLAPPING (Fast Sine Wave)
    if (leftWing.current && rightWing.current) {
        const flap = Math.sin(time * 35) * 0.5;
        leftWing.current.rotation.z = 0.4 + flap;
        rightWing.current.rotation.z = -0.4 - flap;
    }
  });

  return (
    <group ref={group} position={[2, 0, 1]} scale={0.5}>
      {/* --- BODY --- */}
      {/* Main Thorax */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.35, 0.6, 4, 16]} />
        <primitive object={bodyMaterial} />
      </mesh>
      
      {/* Stripes (Torus Rings) */}
      <mesh position={[0, -0.15, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.34, 0.05, 16, 32]} />
        <primitive object={stripeMaterial} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.35, 0.05, 16, 32]} />
        <primitive object={stripeMaterial} />
      </mesh>
      <mesh position={[0, 0.25, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.32, 0.05, 16, 32]} />
        <primitive object={stripeMaterial} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <primitive object={bodyMaterial} />
      </mesh>

      {/* Glowing Eyes */}
      <mesh position={[-0.12, 0.65, 0.2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <primitive object={eyeMaterial} />
      </mesh>
      <mesh position={[0.12, 0.65, 0.2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <primitive object={eyeMaterial} />
      </mesh>
      
      {/* Antennae */}
      <mesh position={[-0.1, 0.8, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.02, 0.3]} />
        <primitive object={bodyMaterial} />
      </mesh>
      <mesh position={[0.1, 0.8, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.02, 0.3]} />
        <primitive object={bodyMaterial} />
      </mesh>

      {/* --- WINGS --- */}
      <group position={[0, 0.2, 0.25]}>
        {/* Left Wing pivot */}
        <mesh ref={leftWing} position={[-0.1, 0, 0]}>
             {/* Offset geometry to rotate from base */}
             <group position={[-0.5, 0, 0]}>
                <mesh scale={[1, 0.05, 0.6]}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <primitive object={wingMaterial} />
                </mesh>
             </group>
        </mesh>
        
        {/* Right Wing pivot */}
        <mesh ref={rightWing} position={[0.1, 0, 0]}>
             <group position={[0.5, 0, 0]}>
                <mesh scale={[1, 0.05, 0.6]}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <primitive object={wingMaterial} />
                </mesh>
             </group>
        </mesh>
      </group>

      {/* Stinger */}
      <mesh position={[0, -0.55, 0]}>
        <coneGeometry args={[0.15, 0.4, 16]} />
        <primitive object={bodyMaterial} />
      </mesh>
    </group>
  );
}

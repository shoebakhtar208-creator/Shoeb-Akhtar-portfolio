
import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Float, Stars, useGLTF, useAnimations, Image } from '@react-three/drei';
import * as THREE from 'three';

// Fix for missing JSX types in this environment
// Augmenting both global JSX and React.JSX to handle different TS/React versions
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      primitive: any;
      axesHelper: any;
      boxHelper: any;
      ambientLight: any;
      directionalLight: any;
      spotLight: any;
      pointLight: any;
      fog: any;
      instancedMesh: any;
      dodecahedronGeometry: any;
      meshBasicMaterial: any;
    }
  }
}

// Ensure React.JSX is also patched for newer React versions
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      primitive: any;
      axesHelper: any;
      boxHelper: any;
      ambientLight: any;
      directionalLight: any;
      spotLight: any;
      pointLight: any;
      fog: any;
      instancedMesh: any;
      dodecahedronGeometry: any;
      meshBasicMaterial: any;
    }
  }
}

// --- CONFIG ---
// Toggle to visualize skeletons/helpers
const DEBUG_3D = false; 

// --- COMPONENTS ---

// Fallback component if 3D model fails to load or on extremely low-end devices
const Fallback2D = () => {
  const group = useRef<THREE.Object3D>(null!);
  const scroll = useScroll(); // Access scroll state from ScrollControls

  useFrame((state) => {
    if (!group.current) return;
    
    // --- PARALLAX & LIVENESS EFFECT ---
    
    // 1. Breathing / Floating (Idle)
    // Keeps the image feeling "alive" similar to the 3D robot's idle sway
    const t = state.clock.elapsedTime;
    const breatheY = Math.sin(t * 1.5) * 0.1; 
    
    // 2. Scroll-Driven Parallax (Depth Simulation)
    // Move slightly up/down based on scroll to simulate it being on a different plane than background
    const targetY = -2.5 + (scroll.offset * 0.5) + breatheY;
    
    // 3. Dynamic Tilt
    // Slight rotation on Z axis based on scroll velocity or position gives momentum
    const targetRotZ = (scroll.offset - 0.5) * 0.1; 
    
    // Apply smooth lerps
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.1);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotZ, 0.1);
    
    // 4. Subtle Scale Pulse on Scroll
    const targetScale = 1 + (Math.abs(scroll.delta) * 2); // Puff up slightly on fast scroll
    const currentScale = group.current.scale.x; // Assuming uniform scale
    const smoothScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
    // We don't apply scale to group to avoid messing up Image scale, applied via logic if needed.
  });

  return (
    <group ref={group} position={[2, -2.5, 0]}>
       <Image 
        url="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop"
        scale={[4, 5.5]} // Matches the visual footprint (silhouette) of the RobotExpressive model
        transparent 
        opacity={0.95}
        toneMapped={false} // Retain original colors brightness
      />
    </group>
  );
};

interface RobotModelProps {
  url: string;
  highQuality?: boolean;
}

// Individual Robot Component (Handles GLTF logic)
const RobotModel: React.FC<RobotModelProps> = ({ url, highQuality = false }) => {
  const group = useRef<THREE.Object3D>(null!);
  
  // useGLTF suspends. If url is invalid, it throws.
  // We use the 'true' flag for the second argument to enable default Draco compression handling.
  const { scene, animations } = useGLTF(url, true);
  const { actions, mixer } = useAnimations(animations, group);
  const scroll = useScroll();
  
  // Setup initial pose & Material Overrides
  useEffect(() => {
    // 1. Animation Init
    const idleAnim = actions['Idle'] || (actions && Object.values(actions)[0]);
    if (idleAnim) {
      idleAnim.reset().fadeIn(0.5).play();
    }
    
    // 2. Material "Repainting"
    // Force the robot to be White with Metallic finish, Blue Eyes, and prepare for Yellow Rim lights
    scene.traverse((child) => {
      if ((child as any).isMesh) {
        const mesh = child as any;
        const oldMat = mesh.material as THREE.MeshStandardMaterial;
        
        // Check if this part is likely an eye (based on common naming conventions)
        // If the specific GLB doesn't have named eyes, this will just default to white body
        const name = mesh.name.toLowerCase();
        const isEye = name.includes('eye') || name.includes('light') || name.includes('lens');

        // Create a new material to ensure consistency
        const newMat = new THREE.MeshStandardMaterial({
          // Preserve surface details/scratches
          normalMap: oldMat.normalMap, 
          
          // BODY STYLE: Pure White (#FFFFFF), Metallic
          color: new THREE.Color(isEye ? '#00A8FF' : '#FFFFFF'),
          metalness: isEye ? 0.0 : 0.3,
          roughness: isEye ? 0.0 : 0.35,
          
          // GLOW: Electric Blue (#00A8FF) for eyes with High Intensity (3.0)
          emissive: new THREE.Color(isEye ? '#00A8FF' : '#000000'),
          emissiveIntensity: isEye ? 3.0 : 0.0,
          
          // BLOOM EFFECT: toneMapped=false allows colors to exceed 1.0, creating a "glow"
          toneMapped: !isEye 
        });

        mesh.material = newMat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return () => { 
      mixer.stopAllAction(); 
    };
  }, [actions, mixer, url, scene]);

  useFrame((state, delta) => {
    if (!group.current) return;

    // --- BEHAVIOR MAPPING (Exact Movement Parity) ---
    
    // MAP: Building.rotateY -> robotRoot.rotation.y
    // Continuous slow spin + scroll acceleration
    // We match the original building speed: delta * 0.1 is base spin, scroll.delta * 5 is interaction
    group.current.rotation.y += delta * 0.1 + (scroll.delta * 5);

    // MAP: Sway/Morph -> Robot secondary motion
    // We add a subtle sway to the Z rotation to mimic the "alive" feel
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      Math.sin(state.clock.elapsedTime * 1) * 0.02,
      0.1
    );

    // --- ANIMATION BLENDING ---
    // Blend "Running" or "Walking" animation based on scroll velocity
    const runAnim = actions['Running'] || actions['Run'];
    const idleAnim = actions['Idle'];

    if (runAnim && idleAnim) {
      const targetWeight = Math.min(Math.abs(scroll.delta * 200), 1);
      
      // Smoothly blend weights
      const falloff = 0.1;
      runAnim.weight = THREE.MathUtils.lerp(runAnim.weight, targetWeight, falloff);
      idleAnim.weight = THREE.MathUtils.lerp(idleAnim.weight, 1 - targetWeight, falloff);

      if (runAnim.weight > 0.01) runAnim.play();
      else runAnim.stop();
      
      idleAnim.play();
    }
  });

  // Debug Visuals
  if (DEBUG_3D) {
    return (
      <group ref={group} position={[0, -5, 0]} scale={2}>
        <primitive object={scene} />
        <axesHelper args={[5]} />
        <boxHelper args={[scene]} />
      </group>
    );
  }

  // Adjusted scale and position to match the original visual footprint of the tower
  // RobotExpressive is around 2-3 units tall.
  const scale = highQuality ? 0.5 : 0.5;

  return (
    <group ref={group} position={[2, -2.5, 0]} scale={scale}>
      <primitive object={scene} />
    </group>
  );
};

// Error Boundary Component for 3D Loading
class RobotErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error("3D Model Load Failed:", error);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// Progressive Loader Component
const ProgressiveRobot = () => {
  const [highQualityLoaded, setHighQualityLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const isMobile = window.innerWidth < 768;

  // Use string paths directly to avoid dependency on missing constants in this context snippet if any
  const ASSETS = {
     HIGH: 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
     MED: 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb'
  };

  useEffect(() => {
    // Simulate progressive loading or actually preload
    if (!isMobile && !loadError) {
      try {
        useGLTF.preload(ASSETS.HIGH);
        // In a real scenario, we might listen to a loader manager. 
        // Here we assume if preload doesn't throw immediately, we upgrade after a short delay.
        const timer = setTimeout(() => setHighQualityLoaded(true), 1000);
        return () => clearTimeout(timer);
      } catch (e) {
        console.warn("Preload failed, staying on low quality", e);
      }
    }
  }, [isMobile, loadError]);

  if (loadError) {
    return <Fallback2D />;
  }

  return (
    <group>
      <Suspense fallback={null}>
        <RobotErrorBoundary onError={() => setLoadError(true)}>
           {highQualityLoaded && !isMobile ? (
             <RobotModel url={ASSETS.HIGH} highQuality={true} />
           ) : (
             <RobotModel url={ASSETS.MED} />
           )}
        </RobotErrorBoundary>
      </Suspense>
    </group>
  );
};

const Particles = ({ count = 200 }) => {
  const mesh = useRef<any>(null); // Use any for InstancedMesh to avoid type errors in this env
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.05, 0]} />
      <meshBasicMaterial color="#D4AF37" transparent opacity={0.6} blending={2} />
    </instancedMesh>
  );
};

const CameraRig = () => {
  const { camera } = useThree();
  const scroll = useScroll();
  
  useFrame(() => {
    // SCENE 1: Camera Dolly Animation
    // MAP: Camera position logic maintained for parity
    const targetZ = 10 - (scroll.offset * 5); // Dolly in
    const targetY = 0 - (scroll.offset * 2);  // Pan down slightly
    
    // Smooth interpolation
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    
    // Look slightly towards the center/tower
    camera.lookAt(0, 0, 0);
  });
  
  return null;
};

export const Scene3D: React.FC = () => {
  return (
    <>
      <CameraRig />
      
      {/* --- LIGHTING RIG --- */}
      {/* 1. High Ambient to remove dark shadows and ensure white body is visible */}
      <ambientLight intensity={2.0} color="#ffffff" />
      
      {/* 2. Front Key Light (Soft White) to illuminate the white body */}
      <directionalLight position={[2, 5, 5]} intensity={1.2} color="#ffffff" />
      
      {/* 3. Back Rim Lights (Yellow Neon) to create the edge outline effect */}
      <spotLight 
        position={[0, 5, -5]} 
        intensity={5.0} 
        color="#FFD53D" 
        distance={20}
        angle={0.5}
        penumbra={1}
      />
      {/* Side fills for yellow accent */}
      <pointLight position={[-5, 0, -5]} intensity={2.0} color="#FFD53D" />
      <pointLight position={[5, 0, -5]} intensity={2.0} color="#FFD53D" />
      
      {/* Volumetric fog simulation */}
      <fog attach="fog" args={['#050505', 5, 25]} />
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <ProgressiveRobot />
      </Float>
      
      {/* Bee removed to restore stability */}
      
      <Particles count={300} />
      
      {/* Background Stars for depth */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
};


import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Preload } from '@react-three/drei';
import { Scene3D } from './components/Scene3D';
import { HTMLContent } from './components/HTMLContent';
import { DUBAI_BG_URL } from './constants';

const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white">
    <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="font-serif tracking-widest text-gold-400 animate-pulse">INITIALIZING EXPERIENCE</p>
  </div>
);

const ErrorHandler = ({ error }: { error: Error }) => (
  <div className="fixed top-4 left-4 p-4 bg-red-900/80 border border-red-500 rounded text-white z-[9999]">
    <p className="font-bold">System Alert</p>
    <p className="text-sm">{error.message}</p>
  </div>
);

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <>
          <ErrorHandler error={this.state.error} />
          {/* Fallback UI if 3D crashes completely */}
          <div className="fixed inset-0 bg-black -z-10" />
          {this.props.children}
        </>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      
      {/* GLOBAL BACKGROUND: Cinematic Dubai Skyline */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src={DUBAI_BG_URL} 
          alt="Dubai Skyline" 
          className="w-full h-full object-cover opacity-25 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          {/* 
            Performance Note: 
            dpr restricted to [1, 2] to avoid lag on high-res screens.
            eventSource ref not needed as we use ScrollControls for full page.
          */}
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 10], fov: 45 }}
            className="absolute inset-0 z-10"
            gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
          >
            {/* 
              ScrollControls handles the synchronization between HTML scroll 
              and 3D animations.
              pages={5} approximates the height of HTMLContent.
              damping={0.2} gives that "Apple-like" smoothness.
            */}
            <ScrollControls pages={5} damping={0.2}>
              <Scene3D />
              <HTMLContent />
            </ScrollControls>
            
            <Preload all />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;

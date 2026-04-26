import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';

export function Preloader() {
  const { progress: realProgress } = useProgress();
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Artificial smooth loading logic to mask WebGL compilation lag
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Slowly tick up artificially to max out at 99%
        const artificialTarget = Math.min(prev + 1.2, 99);
        let nextProgress = Math.max(artificialTarget, prev);
        
        // Once actual Three.js scene is fully loaded (100%), accelerate to 100% swiftly
        if (realProgress === 100) {
          nextProgress = prev + 3;
        }
        
        if (nextProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        return nextProgress;
      });
    }, 16); // ~60fps target tick rate
    
    return () => clearInterval(interval);
  }, [realProgress]);

  useEffect(() => {
    // Hold at 100% for a split second before dismissing the loading screen
    if (progress === 100) {
      const timer = setTimeout(() => setShow(false), 600);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    // Lock scrolling while the preloader is active
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          // Slide out smoothly like a heavy curtain
          initial={{ y: "0%" }}
          exit={{ y: "-100%", transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#030303] text-white overflow-hidden"
        >
          {/* Subtle branding top left */}
          <div className="absolute top-6 left-6 md:top-12 md:left-12 font-display font-bold text-xl tracking-tight text-white/50">
            MN.
          </div>
          
          <div className="flex flex-col items-center w-full max-w-sm px-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-accent-light uppercase tracking-widest text-[10px] md:text-xs mb-8"
            >
              Initializing Digital Experience
            </motion.div>
            
            {/* The giant percentage counter */}
            <div className="font-display text-7xl md:text-9xl font-bold tracking-tighter mb-8 tabular-nums">
              {Math.round(progress)}%
            </div>
            
            {/* Immersive glow progress bar */}
            <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-light via-blue-400 to-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Subtle bottom-right identifier */}
          <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] text-right">
            System / Online <br />
            {new Date().getUTCFullYear()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

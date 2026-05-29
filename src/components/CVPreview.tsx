import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, LockIcon, ScanEye, AlertTriangle } from "lucide-react";
import { useLenis } from "lenis/react";

interface CVPreviewProps {
  onClose: () => void;
  pdfUrl?: string;
  title?: string;
}

export function CVPreview({ 
  onClose, 
  pdfUrl = "https://drive.google.com/file/d/1wzvYQdy3LTLekoCOhytPM5m0AGO0n9nr/preview",
  title = "Secure Vault View"
}: CVPreviewProps) {
  const [isFocused, setIsFocused] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const lenis = useLenis();

  const triggerWarning = () => {
    setShowWarning(true);
    setTimeout(() => {
      setShowWarning(false);
    }, 3500);
  };

  // Stop background scrolling when modal is open
  useEffect(() => {
    if (lenis) lenis.stop();
    document.body.style.overflow = "hidden";
    
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = "auto";
    };
  }, [lenis]);

  useEffect(() => {
    // Prevent context menu (right-click)
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      triggerWarning();
      return false;
    };

    // Attempt to block screenshot shortcuts and print commands
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText(""); // Attempt to clear clipboard
        triggerWarning();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === "p" || e.key.toLowerCase() === "s")) {
        e.preventDefault();
        triggerWarning();
      }
    };

    // Detect when the window loses focus or becomes hidden
    const handleVisibilityChange = () => {
      setIsFocused(!document.hidden);
    };

    const handleBlur = () => setIsFocused(false);
    const handleFocus = () => setIsFocused(true);

    const handleBeforePrint = (e: Event) => {
      e.preventDefault();
      triggerWarning();
    }

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("beforeprint", handleBeforePrint);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("beforeprint", handleBeforePrint);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-8 pointer-events-auto"
      style={{
        // Prevent all user selection
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {/* Decorative tech background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none crt-scanline opacity-30 mix-blend-overlay z-0" />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors z-[110] backdrop-blur-md border border-white/10"
      >
        <X className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Main CV Container */}
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl h-full max-h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Privacy Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 md:px-8 py-4 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] md:text-xs font-mono text-gray-500">
            <span className="flex items-center gap-1.5 md:gap-2">
              <LockIcon className="w-3 h-3" /> Encrypted View
            </span>
            <span className="flex items-center gap-1.5 md:gap-2">
              <ScanEye className="w-3 h-3" /> Anti-Capture Active
            </span>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="relative flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start p-4 sm:p-8">
          {/* Inner CRT Scanline Overlay over PDF */}
          <div className="absolute inset-0 pointer-events-none crt-scanline opacity-10 mix-blend-overlay z-[60]" />
          
          {/* Privacy Blur Overlay when out of focus */}
          <AnimatePresence>
            {!isFocused && (
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                className="absolute inset-0 z-40 bg-black/60 flex flex-col items-center justify-center text-white"
              >
                <LockIcon className="w-10 h-10 md:w-16 md:h-16 mb-4 text-emerald-400/80" />
                <h3 className="font-display text-xl md:text-3xl font-semibold mb-2">
                  View Paused
                </h3>
                <p className="font-mono text-xs md:text-sm text-gray-400">
                  Click to resume secure viewing
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.02] select-none flex items-center justify-center mix-blend-overlay">
            <div className="transform -rotate-12 font-display text-[8rem] md:text-[18rem] font-bold text-white whitespace-nowrap leading-none">
              PRIVATE
            </div>
          </div>

          <AnimatePresence>
            {showWarning && (
              <motion.div
                initial={{ opacity: 0, y: -20, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: -20, x: "-50%" }}
                className="fixed top-[15%] left-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-red-500/90 text-white rounded-full shadow-2xl backdrop-blur-md font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase border border-red-400"
              >
                <AlertTriangle className="w-5 h-5" />
                Screenshots & Printing Disabled
              </motion.div>
            )}
          </AnimatePresence>

          {/* CV Content - PDF display */}
          <div className="relative z-10 w-full h-full max-w-4xl flex-1 flex flex-col items-center justify-center select-none" style={{ pointerEvents: 'auto', minHeight: '600px' }}>
            {!isImageLoaded && (
              <div className="absolute inset-0 z-0 bg-white/5 animate-pulse rounded-lg shadow-xl flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-400/50 border-t-emerald-400 rounded-full animate-spin"></div>
              </div>
            )}
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              className={`w-full h-full rounded-lg shadow-2xl relative z-10 transition-opacity duration-500 border-none ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
              allow="autoplay"
              title={title}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

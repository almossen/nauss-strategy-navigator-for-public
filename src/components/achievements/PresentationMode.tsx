import { useState, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface PresentationModeProps {
  slides: ReactNode[];
  isOpen: boolean;
  onClose: () => void;
}

export default function PresentationMode({ slides, isOpen, onClose }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const goNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide, slides.length]);

  const goPrev = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    if (!isOpen) { setCurrentSlide(0); return; }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        // RTL: right = prev, left = next
        if (e.key === 'ArrowRight') goPrev();
        else goNext();
      }
      if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowUp') goPrev();
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    // Try fullscreen
    document.documentElement.requestFullscreen?.().catch(() => {});

    return () => {
      document.removeEventListener('keydown', handleKey);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, [isOpen, goNext, goPrev, onClose]);

  if (!isOpen) return null;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col" dir="rtl">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-gradient-to-b from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
        <span className="text-white/60 text-sm font-medium">
          {currentSlide + 1} / {slides.length}
        </span>
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <div className="absolute inset-y-0 right-0 flex items-center z-40">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="p-3 m-4 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all backdrop-blur-sm"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute inset-y-0 left-0 flex items-center z-40">
          <button
            onClick={goNext}
            disabled={currentSlide === slides.length - 1}
            className="p-3 m-4 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-50">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, hsl(37, 38%, 63%), hsl(186, 37%, 29%))' }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// Reusable slide wrapper
export function SlideWrapper({ children, bg }: { children: ReactNode; bg?: string }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16 relative"
      style={{ background: bg || 'linear-gradient(135deg, #1a2e35 0%, #2e6066 50%, #1a2e35 100%)' }}
      dir="rtl"
    >
      <div className="w-full max-w-[1400px] mx-auto flex-1 flex items-center justify-center">
        {children}
      </div>
      {/* Subtle footer */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 text-white/25 text-[10px]">
        <span>مكتب الاستراتيجية والتحول</span>
        <span style={{ color: '#b79d6940' }}>|</span>
        <span>Office of Strategy & Transformation</span>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusTimerProps {
  isOpen: boolean;
  onClose: () => void;
  habitName: string;
  habitEmoji: string;
  habitColor: string;
  onComplete: () => void;
}

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

export const FocusTimer = ({
  isOpen,
  onClose,
  habitName,
  habitEmoji,
  habitColor,
  onComplete,
}: FocusTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasCompletedRef = useRef(false);

  const progress = ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100;
  const circumference = 2 * Math.PI * 135; // radius = 135
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    
    setIsRunning(false);
    setShowConfetti(true);
    onComplete();

    // Auto close after celebration
    setTimeout(() => {
      setShowConfetti(false);
      onClose();
      // Reset for next time
      setTimeLeft(POMODORO_DURATION);
      hasCompletedRef.current = false;
    }, 4000);
  }, [onComplete, onClose]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, handleComplete]);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(POMODORO_DURATION);
    hasCompletedRef.current = false;
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsRunning(false);
      setTimeLeft(POMODORO_DURATION);
      hasCompletedRef.current = false;
      onClose();
    }
  };

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2.5 + Math.random() * 2,
    color: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
  }));

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 border-none bg-black/95 text-white max-w-full h-[100dvh] rounded-none sm:rounded-none flex flex-col items-center justify-between z-[200] focus:outline-none">
        
        {/* Top Header/Dismiss bar */}
        <div className="w-full flex items-center justify-between px-6 pt-12 pb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleOpenChange(false)}
            className="text-white/40 hover:text-white hover:bg-white/10"
          >
            <ChevronDown className="w-8 h-8" />
          </Button>
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Focusing On</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">{habitEmoji}</span>
              <span className="font-semibold">{habitName}</span>
            </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <div className="flex-1 w-full flex flex-col items-center justify-center relative overflow-hidden px-6">
          
          {/* Confetti Animation */}
          <AnimatePresence>
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none z-50">
                {confettiParticles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    initial={{ 
                      opacity: 1, 
                      y: "100%", 
                      x: `${particle.x}%`,
                      scale: 0
                    }}
                    animate={{ 
                      opacity: [1, 1, 0],
                      y: ["100%", "-20%", "-120%"],
                      x: `${particle.x + (Math.random() - 0.5) * 50}%`,
                      scale: [0, 1.2, 0.6],
                      rotate: [0, 360, 1080],
                    }}
                    transition={{ 
                      duration: particle.duration, 
                      delay: particle.delay,
                      ease: "easeOut"
                    }}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{ backgroundColor: particle.color }}
                  />
                ))}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center px-8 py-12 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    >
                      <Sparkles className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                    </motion.div>
                    <h2 className="text-3xl font-black text-white mb-2">Well Done!</h2>
                    <p className="text-white/60 text-lg">Daily goal achieved</p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Large Progress Indicator */}
          <div className={cn("relative flex items-center justify-center transition-all duration-700", showConfetti && "scale-110 opacity-0")}>
            
            {/* Soft Glow */}
            <div 
              className="absolute w-[320px] h-[320px] rounded-full blur-[80px] opacity-20 animate-pulse"
              style={{ backgroundColor: habitColor }}
            />

            <svg width="340" height="340" className="transform -rotate-90 relative z-10">
              <circle
                cx="170"
                cy="170"
                r="150"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="4"
              />
              <motion.circle
                cx="170"
                cy="170"
                r="135"
                fill="none"
                stroke={habitColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                initial={false}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: "linear" }}
                style={{ 
                  filter: `drop-shadow(0 0 12px ${habitColor}80)` 
                }}
              />
            </svg>

            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <motion.div 
                key={timeLeft}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl font-black font-mono tabular-nums tracking-tighter text-white"
              >
                {String(minutes).padStart(2, '0')}
                <span className={cn("inline-block", isRunning && "animate-pulse")}>:</span>
                {String(seconds).padStart(2, '0')}
              </motion.div>
              <div className="h-6 mt-4">
                <p className="text-white/40 text-sm font-medium tracking-widest uppercase">
                  {isRunning ? 'Deep Work' : 'Paused'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="w-full px-8 pb-20 flex flex-col items-center">
          <div className="flex items-center justify-center gap-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="w-14 h-14 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 transition-all active:scale-90"
            >
              <RotateCcw className="w-6 h-6" />
            </Button>

            <Button
              onClick={handlePlayPause}
              className="w-24 h-24 rounded-full text-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] transition-all active:scale-95 flex items-center justify-center"
              style={{ 
                backgroundColor: isRunning ? 'rgba(255,255,255,0.1)' : habitColor,
                border: isRunning ? '1px solid rgba(255,255,255,0.2)' : 'none'
              }}
            >
              {isRunning ? (
                <Pause className="w-10 h-10" fill="currentColor" />
              ) : (
                <Play className="w-10 h-10 ml-1.5" fill="currentColor" />
              )}
            </Button>

            <div className="w-14 h-14" /> {/* Symmetry spacer */}
          </div>
          
          <div className="mt-12 w-full max-w-[200px] h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white/20"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
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
  const circumference = 2 * Math.PI * 120; // radius = 120
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
    }, 3500);
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
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
  }));

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-primary/95 via-primary to-primary/90 border-primary/20 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <span className="text-3xl">{habitEmoji}</span>
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Focus Mode
            </span>
          </DialogTitle>
          <p className="text-center text-white/70 text-sm">{habitName}</p>
        </DialogHeader>

        <div className="relative flex flex-col items-center py-8">
          {/* Confetti Animation */}
          <AnimatePresence>
            {showConfetti && (
              <>
                {confettiParticles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    initial={{ 
                      opacity: 1, 
                      y: 0, 
                      x: `${particle.x}%`,
                      scale: 0
                    }}
                    animate={{ 
                      opacity: [1, 1, 0],
                      y: [0, -200, -400],
                      x: `${particle.x + (Math.random() - 0.5) * 40}%`,
                      scale: [0, 1, 0.5],
                      rotate: [0, 360, 720],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: particle.duration, 
                      delay: particle.delay,
                      ease: "easeOut"
                    }}
                    className="absolute top-1/2 w-3 h-3 rounded-full"
                    style={{ backgroundColor: particle.color }}
                  />
                ))}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      <Sparkles className="w-16 h-16 text-accent mx-auto mb-2" />
                    </motion.div>
                    <p className="text-2xl font-bold text-white">Session Complete!</p>
                    <p className="text-accent mt-1">Habit marked as done 🎉</p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Circular Progress Ring */}
          <div className={cn("relative", showConfetti && "opacity-20")}>
            <svg width="280" height="280" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <motion.circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke={habitColor}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                initial={false}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="drop-shadow-lg"
                style={{ 
                  filter: `drop-shadow(0 0 20px ${habitColor}50)` 
                }}
              />
            </svg>

            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                key={timeLeft}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl font-mono font-bold tracking-wider"
              >
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </motion.span>
              <span className="text-white/60 text-sm mt-2">
                {isRunning ? 'Focus in progress...' : 'Ready to focus'}
              </span>
            </div>
          </div>

          {/* Controls */}
          {!showConfetti && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mt-8"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="w-12 h-12 rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>

              <Button
                onClick={handlePlayPause}
                className="w-16 h-16 rounded-full text-white shadow-lg"
                style={{ 
                  backgroundColor: habitColor,
                  boxShadow: `0 10px 40px -10px ${habitColor}80`
                }}
              >
                {isRunning ? (
                  <Pause className="w-7 h-7" />
                ) : (
                  <Play className="w-7 h-7 ml-1" />
                )}
              </Button>

              <div className="w-12 h-12" /> {/* Spacer for symmetry */}
            </motion.div>
          )}

          {/* Progress indicator */}
          {!showConfetti && (
            <div className="mt-6 text-center">
              <p className="text-xs text-white/50">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

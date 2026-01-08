import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PenguinCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
  userName?: string;
}

const compliments = [
  "You're amazing! 🎉",
  "Perfect day! Keep it up! ⭐",
  "You crushed it today! 💪",
  "Superstar performance! 🌟",
  "100% complete! You rock! 🎊",
  "Incredible work today! 🏆",
  "You're unstoppable! 🚀",
];

export const PenguinCelebration = ({ isVisible, onClose, userName }: PenguinCelebrationProps) => {
  const [compliment, setCompliment] = useState('');

  useEffect(() => {
    if (isVisible) {
      const randomIndex = Math.floor(Math.random() * compliments.length);
      setCompliment(compliments[randomIndex]);
      
      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="relative bg-card rounded-3xl p-8 shadow-2xl border border-border max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Confetti particles */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: '50%', 
                    y: '50%',
                    scale: 0 
                  }}
                  animate={{ 
                    x: `${Math.random() * 100}%`, 
                    y: `${Math.random() * 100}%`,
                    scale: [0, 1, 0.8],
                    rotate: Math.random() * 360
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: i * 0.05,
                    ease: 'easeOut'
                  }}
                  className={`absolute w-3 h-3 rounded-full ${
                    i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-accent' : 'bg-yellow-400'
                  }`}
                />
              ))}
            </div>

            {/* Penguin */}
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 10 }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Penguin SVG */}
              <motion.svg
                width="120"
                height="140"
                viewBox="0 0 120 140"
                className="mb-4"
                animate={{ 
                  rotate: [0, -5, 5, -5, 0],
                  y: [0, -8, 0]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              >
                {/* Body */}
                <ellipse cx="60" cy="90" rx="45" ry="50" fill="#1a1a2e" />
                
                {/* White belly */}
                <ellipse cx="60" cy="95" rx="30" ry="38" fill="#f8f9fa" />
                
                {/* Head */}
                <circle cx="60" cy="45" r="35" fill="#1a1a2e" />
                
                {/* White face */}
                <ellipse cx="60" cy="50" rx="22" ry="20" fill="#f8f9fa" />
                
                {/* Left eye */}
                <circle cx="50" cy="45" r="8" fill="#1a1a2e" />
                <circle cx="52" cy="43" r="3" fill="#ffffff" />
                
                {/* Right eye */}
                <circle cx="70" cy="45" r="8" fill="#1a1a2e" />
                <circle cx="72" cy="43" r="3" fill="#ffffff" />
                
                {/* Beak */}
                <path d="M55 55 L60 65 L65 55 Z" fill="#ff9500" />
                
                {/* Blush */}
                <circle cx="40" cy="55" r="6" fill="#ffb3ba" opacity="0.6" />
                <circle cx="80" cy="55" r="6" fill="#ffb3ba" opacity="0.6" />
                
                {/* Left wing */}
                <motion.ellipse
                  cx="20"
                  cy="85"
                  rx="12"
                  ry="30"
                  fill="#1a1a2e"
                  animate={{ rotate: [0, -20, 0, -20, 0] }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                  style={{ transformOrigin: '30px 70px' }}
                />
                
                {/* Right wing */}
                <motion.ellipse
                  cx="100"
                  cy="85"
                  rx="12"
                  ry="30"
                  fill="#1a1a2e"
                  animate={{ rotate: [0, 20, 0, 20, 0] }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                  style={{ transformOrigin: '90px 70px' }}
                />
                
                {/* Left foot */}
                <ellipse cx="45" cy="138" rx="12" ry="6" fill="#ff9500" />
                
                {/* Right foot */}
                <ellipse cx="75" cy="138" rx="12" ry="6" fill="#ff9500" />
              </motion.svg>

              {/* Greeting */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold text-foreground text-center"
              >
                {userName ? `Great job, ${userName}!` : 'Great job!'}
              </motion.p>

              {/* Compliment */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-muted-foreground text-center mt-2"
              >
                {compliment}
              </motion.p>

              {/* All habits complete message */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 px-4 py-2 bg-primary/10 rounded-full"
              >
                <p className="text-sm font-medium text-primary">
                  All habits completed! 🎯
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

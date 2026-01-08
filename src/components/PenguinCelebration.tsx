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
      
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
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
                width="160"
                height="160"
                viewBox="0 0 160 160"
                className="mb-4"
                animate={{ 
                  rotate: [0, -3, 3, -3, 0],
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {/* Hair/Tuft */}
                <path d="M75 15 Q80 5 85 15" fill="#2c2c2c" stroke="#2c2c2c" strokeWidth="2" />
                <path d="M78 12 Q80 2 82 12" fill="#2c2c2c" stroke="#2c2c2c" strokeWidth="2" />

                {/* Main Body (Black) */}
                <ellipse cx="80" cy="85" rx="55" ry="60" fill="#2c2c2c" />
                
                {/* White Belly/Face Area */}
                <path 
                  d="M80 35 
                     C55 35, 40 55, 40 85 
                     C40 120, 55 135, 80 135 
                     C105 135, 120 120, 120 85 
                     C120 55, 105 35, 80 35 Z" 
                  fill="#ffffff" 
                />
                
                {/* Black bridge between eyes */}
                <path d="M65 45 Q80 35 95 45 L80 60 Z" fill="#2c2c2c" />

                {/* Left Eye */}
                <g transform="translate(60, 65)">
                  <circle r="12" fill="#2c2c2c" />
                  <circle cx="3" cy="-3" r="4" fill="#ffffff" />
                  <circle cx="-2" cy="2" r="1.5" fill="#ffffff" />
                </g>

                {/* Right Eye */}
                <g transform="translate(100, 65)">
                  <circle r="12" fill="#2c2c2c" />
                  <circle cx="3" cy="-3" r="4" fill="#ffffff" />
                  <circle cx="-2" cy="2" r="1.5" fill="#ffffff" />
                </g>
                
                {/* Beak */}
                <path 
                  d="M70 78 Q80 92 90 78 Q80 82 70 78" 
                  fill="#f39c12" 
                  stroke="#d35400" 
                  strokeWidth="1"
                />
                
                {/* Blush */}
                <circle cx="45" cy="80" r="8" fill="#ffb3ba" opacity="0.4" />
                <circle cx="115" cy="80" r="8" fill="#ffb3ba" opacity="0.4" />
                
                {/* Left wing */}
                <motion.path
                  d="M35 85 Q10 100 25 125 Q40 110 35 85"
                  fill="#2c2c2c"
                  animate={{ rotate: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '35px 85px' }}
                />
                
                {/* Right wing */}
                <motion.path
                  d="M125 85 Q150 100 135 125 Q120 110 125 85"
                  fill="#2c2c2c"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '125px 85px' }}
                />
                
                {/* Left foot */}
                <path d="M55 135 Q50 145 65 145 Q70 145 70 135" fill="#f39c12" />
                
                {/* Right foot */}
                <path d="M90 135 Q95 145 110 145 Q105 145 90 135" fill="#f39c12" />
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

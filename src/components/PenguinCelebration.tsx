import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Penguin } from './Penguin';
import { Puppy } from './Puppy';
import { HabitCompanion } from './HabitCompanion';
import { Habit } from '@/lib/habitTypes';

interface PenguinCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
  userName?: string;
  habits: Habit[];
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

export const PenguinCelebration = ({ isVisible, onClose, userName, habits }: PenguinCelebrationProps) => {
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

            {/* Habit Companion */}
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 10 }}
              className="relative z-10 flex flex-col items-center"
            >
              <HabitCompanion 
                completedCount={habits.reduce((acc, h) => acc + h.completedDates.length, 0)} 
                size={160} 
                className="mb-4" 
                isCelebrating={true}
              />

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

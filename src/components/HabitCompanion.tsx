import { motion } from 'framer-motion';

interface HabitCompanionProps {
  completedCount: number;
  className?: string;
  size?: number;
  isCelebrating?: boolean;
}

export const HabitCompanion = ({ completedCount, className, size = 64, isCelebrating = false }: HabitCompanionProps) => {
  // Stages: Seed (< 6), Sprout (6-10), Tree (> 10)
  const getStage = () => {
    if (completedCount <= 5) return 'seed';
    if (completedCount <= 10) return 'sprout';
    return 'tree';
  };

  const stage = getStage();

  return (
    <motion.div
      className={className}
      animate={isCelebrating ? {
        scale: [1, 1.2, 1],
        rotate: [0, -5, 5, -5, 0],
      } : {
        y: [0, -2, 0],
      }}
      transition={{
        duration: isCelebrating ? 0.5 : 3,
        repeat: isCelebrating ? 3 : Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {stage === 'seed' && (
          <g>
            <circle cx="80" cy="120" r="15" fill="#8d6e63" />
            <motion.path
              d="M80 105 Q85 95 80 85"
              stroke="#4caf50"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </g>
        )}
        {stage === 'sprout' && (
          <g>
            <path d="M80 140 L80 80" stroke="#8d6e63" strokeWidth="6" strokeLinecap="round" />
            <motion.path
              d="M80 100 Q100 80 80 60"
              fill="#4caf50"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path
              d="M80 100 Q60 80 80 60"
              fill="#4caf50"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </g>
        )}
        {stage === 'tree' && (
          <g>
            {/* Trunk with slight curve */}
            <path 
              d="M80 140 Q75 100 80 60" 
              stroke="#5d4037" 
              strokeWidth="12" 
              strokeLinecap="round" 
              fill="none"
            />
            
            {/* Branches */}
            <motion.path
              d="M80 90 Q100 80 115 85"
              stroke="#5d4037"
              strokeWidth="6"
              strokeLinecap="round"
              animate={{ rotate: [0, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.path
              d="M80 100 Q60 90 45 95"
              stroke="#5d4037"
              strokeWidth="6"
              strokeLinecap="round"
              animate={{ rotate: [0, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />

            {/* Lush Foliage (Multiple overlapping circles for texture) */}
            <motion.circle
              cx="80"
              cy="45"
              r="42"
              fill="#2e7d32"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.circle
              cx="55"
              cy="65"
              r="28"
              fill="#388e3c"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}
            />
            <motion.circle
              cx="105"
              cy="65"
              r="28"
              fill="#388e3c"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.8 }}
            />
            <motion.circle
              cx="80"
              cy="70"
              r="30"
              fill="#43a047"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1.2 }}
            />

            {/* Little fruits (Apples) */}
            <motion.circle
              cx="65"
              cy="55"
              r="4"
              fill="#ef5350"
              animate={{ y: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.circle
              cx="95"
              cy="45"
              r="4"
              fill="#ef5350"
              animate={{ y: [0, 1, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle
              cx="85"
              cy="80"
              r="4"
              fill="#ef5350"
              animate={{ y: [0, 1, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: 1 }}
            />
            <motion.circle
              cx="110"
              cy="75"
              r="4"
              fill="#ef5350"
              animate={{ y: [0, 1, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: 1.5 }}
            />
          </g>
        )}
        {/* Glow effect when celebrating */}
        {isCelebrating && (
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="url(#glowGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 1, repeat: 5 }}
          />
        )}
        <defs>
          <radialGradient id="glowGradient">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

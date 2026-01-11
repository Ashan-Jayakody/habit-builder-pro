import { motion } from 'framer-motion';

interface HabitCompanionProps {
  completedCount: number;
  className?: string;
  size?: number;
  isCelebrating?: boolean;
}

export const HabitCompanion = ({ completedCount, className, size = 64, isCelebrating = false }: HabitCompanionProps) => {
  // Stages: Seed (< 10), Sprout (10-50), Tree (> 50)
  const getStage = () => {
    if (completedCount < 10) return 'seed';
    if (completedCount <= 50) return 'sprout';
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
            <path d="M80 140 L80 60" stroke="#8d6e63" strokeWidth="10" strokeLinecap="round" />
            <motion.circle
              cx="80"
              cy="50"
              r="40"
              fill="#4caf50"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.circle
              cx="60"
              cy="70"
              r="25"
              fill="#388e3c"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.circle
              cx="100"
              cy="70"
              r="25"
              fill="#388e3c"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
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

import { motion } from 'framer-motion';

interface PuppyProps {
  className?: string;
  size?: number;
}

export const Puppy = ({ className, size = 160 }: PuppyProps) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      className={className}
      animate={{
        rotate: [0, -3, 3, -3, 0],
        y: [0, -6, 0, -3, 0],
        scale: [1, 1.02, 1, 1.01, 1]
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {/* Sparkle/Heart particles */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1.2, 0],
          x: [0, 15, 30],
          y: [0, -10, -20]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 0.5
        }}
      >
        <path d="M25 40 L27 45 L32 45 L28 48 L30 53 L25 50 L20 53 L22 48 L18 45 L23 45 Z" fill="#ff8a80" opacity="0.6" />
      </motion.g>

      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          x: [0, -15, -30],
          y: [0, -15, -25]
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 0.3,
          delay: 0.5
        }}
      >
        <circle cx="135" cy="45" r="3" fill="#ffd700" />
      </motion.g>

      {/* Ears with bounce */}
      <motion.path
        d="M40 45 Q30 35 25 60 Q20 85 35 80 Z"
        fill="#8d6e63"
        animate={{
          rotate: [0, -8, 5, -8, 0],
          y: [0, -2, 0, -1, 0]
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '32px 60px' }}
      />
      <motion.path
        d="M120 45 Q130 35 135 60 Q140 85 125 80 Z"
        fill="#8d6e63"
        animate={{
          rotate: [0, 8, -5, 8, 0],
          y: [0, -2, 0, -1, 0]
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        style={{ transformOrigin: '128px 60px' }}
      />

      {/* Head with slight tilt */}
      <motion.g
        animate={{
          rotate: [0, -1, 1, -1, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: '80px 75px' }}
      >
        <circle cx="80" cy="75" r="45" fill="#f5f5f5" />

        {/* Brown patch on eye */}
        <path
          d="M55 55 Q45 65 50 85 Q70 85 75 65 Z"
          fill="#8d6e63"
          opacity="0.8"
        />

        {/* Rosy cheeks */}
        <motion.circle
          cx="50"
          cy="85"
          r="6"
          fill="#ffb3ba"
          opacity="0.5"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="110"
          cy="85"
          r="6"
          fill="#ffb3ba"
          opacity="0.5"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />

        {/* Eyes with blink and sparkle */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1, 1, 1, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.48, 0.5, 0.52, 0.6, 0.8, 0.9, 1] }}
          style={{ transformOrigin: '65px 75px' }}
        >
          <g transform="translate(65, 75)">
            <circle r="7" fill="#2c2c2c" />
            <circle cx="2" cy="-2" r="2.5" fill="#ffffff" />
            <motion.circle
              cx="3"
              cy="-3"
              r="1"
              fill="#ffffff"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </g>
        </motion.g>

        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1, 1, 1, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.48, 0.5, 0.52, 0.6, 0.8, 0.9, 1], delay: 0.1 }}
          style={{ transformOrigin: '95px 75px' }}
        >
          <g transform="translate(95, 75)">
            <circle r="7" fill="#2c2c2c" />
            <circle cx="2" cy="-2" r="2.5" fill="#ffffff" />
            <motion.circle
              cx="3"
              cy="-3"
              r="1"
              fill="#ffffff"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </g>
        </motion.g>

        {/* Muzzle */}
        <ellipse cx="80" cy="95" rx="16" ry="13" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1" />

        {/* Nose with wiggle */}
        <motion.path
          d="M75 90 Q80 85 85 90 Q80 100 75 90"
          fill="#2c2c2c"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ transformOrigin: '80px 92px' }}
        />

        {/* Tongue with playful movement */}
        <motion.path
          d="M75 102 Q80 116 85 102 Z"
          fill="#ff8a80"
          animate={{
            scaleY: [1, 1.3, 1],
            y: [0, 2, 0]
          }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ transformOrigin: '80px 102px' }}
        />

        {/* Happy mouth line */}
        <motion.path
          d="M75 98 Q80 101 85 98"
          stroke="#2c2c2c"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          animate={{ d: ['M75 98 Q80 101 85 98', 'M75 98 Q80 103 85 98', 'M75 98 Q80 101 85 98'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.g>

      {/* Body with bounce */}
      <motion.path
        d="M45 110 Q80 145 115 110 L100 140 Q80 150 60 140 Z"
        fill="#f5f5f5"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '80px 130px' }}
      />

      {/* Paws with wiggle */}
      <motion.circle
        cx="65"
        cy="145"
        r="8"
        fill="#f5f5f5"
        stroke="#e0e0e0"
        strokeWidth="1"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.circle
        cx="95"
        cy="145"
        r="8"
        fill="#f5f5f5"
        stroke="#e0e0e0"
        strokeWidth="1"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />

      {/* Energetic tail wag */}
      <motion.path
        d="M110 125 Q130 115 125 135"
        fill="none"
        stroke="#f5f5f5"
        strokeWidth="7"
        strokeLinecap="round"
        animate={{
          rotate: [0, 25, -5, 25, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 0.6, repeat: Infinity }}
        style={{ transformOrigin: '110px 125px' }}
      />

      {/* Tail tip decoration */}
      <motion.circle
        cx="125"
        cy="135"
        r="3"
        fill="#f5f5f5"
        animate={{
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
    </motion.svg>
  );
};

import { motion } from 'framer-motion';

interface PenguinProps {
  className?: string;
  size?: number;
}

export const Penguin = ({ className, size = 160 }: PenguinProps) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      className={className}
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
  );
};

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
        rotate: [0, -2, 2, -2, 0],
        y: [0, -4, 0]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {/* Ears */}
      <motion.path
        d="M40 45 Q30 35 25 60 Q20 85 35 80 Z"
        fill="#8d6e63"
        animate={{ rotate: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '40px 45px' }}
      />
      <motion.path
        d="M120 45 Q130 35 135 60 Q140 85 125 80 Z"
        fill="#8d6e63"
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '120px 45px' }}
      />

      {/* Head */}
      <circle cx="80" cy="75" r="45" fill="#f5f5f5" />
      
      {/* Brown patch on eye */}
      <path 
        d="M55 55 Q45 65 50 85 Q70 85 75 65 Z" 
        fill="#8d6e63" 
        opacity="0.8"
      />

      {/* Eyes */}
      <g transform="translate(65, 75)">
        <circle r="6" fill="#2c2c2c" />
        <circle cx="2" cy="-2" r="2" fill="#ffffff" />
      </g>
      <g transform="translate(95, 75)">
        <circle r="6" fill="#2c2c2c" />
        <circle cx="2" cy="-2" r="2" fill="#ffffff" />
      </g>
      
      {/* Muzzle */}
      <ellipse cx="80" cy="95" rx="15" ry="12" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1" />
      
      {/* Nose */}
      <path 
        d="M75 90 Q80 85 85 90 Q80 100 75 90" 
        fill="#2c2c2c" 
      />
      
      {/* Tongue */}
      <motion.path
        d="M75 102 Q80 115 85 102 Z"
        fill="#ff8a80"
        animate={{ scaleY: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '80px 102px' }}
      />

      {/* Body */}
      <path d="M45 110 Q80 145 115 110 L100 140 Q80 150 60 140 Z" fill="#f5f5f5" />
      
      {/* Paws */}
      <circle cx="65" cy="145" r="8" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="1" />
      <circle cx="95" cy="145" r="8" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="1" />
      
      {/* Tail */}
      <motion.path
        d="M110 125 Q130 115 125 135"
        fill="none"
        stroke="#f5f5f5"
        strokeWidth="6"
        strokeLinecap="round"
        animate={{ rotate: [0, 20, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ transformOrigin: '110px 125px' }}
      />
    </motion.svg>
  );
};

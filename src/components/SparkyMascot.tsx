import { motion } from 'motion/react';

interface SparkyMascotProps {
  state: 'welcoming' | 'delivering' | 'celebrating' | 'waving';
  className?: string;
}

export function SparkyMascot({ state, className = '' }: SparkyMascotProps) {
  const getAnimation = () => {
    switch (state) {
      case 'welcoming':
        return {
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        };
      case 'delivering':
        return {
          x: [0, 10, -5, 0],
          y: [0, -8, 0],
          rotate: [0, 10, -5, 0]
        };
      case 'celebrating':
        return {
          y: [0, -15, 0],
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        };
      case 'waving':
        return {
          rotate: [0, 15, -15, 0],
          y: [0, -5, 0]
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      animate={getAnimation()}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`relative ${className}`}
    >
      {/* Sparky SVG - ASU Sun Devil Mascot */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Head */}
        <circle cx="60" cy="45" r="25" fill="#8C1D40" />
        
        {/* Horns */}
        <path d="M45 25 L50 15 L55 25" stroke="#FFC627" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M65 25 L70 15 L75 25" stroke="#FFC627" strokeWidth="3" fill="none" strokeLinecap="round" />
        
        {/* Eyes */}
        <circle cx="52" cy="42" r="3" fill="white" />
        <circle cx="68" cy="42" r="3" fill="white" />
        <circle cx="52" cy="42" r="1.5" fill="black" />
        <circle cx="68" cy="42" r="1.5" fill="black" />
        
        {/* Nose */}
        <ellipse cx="60" cy="48" rx="2" ry="1" fill="black" />
        
        {/* Mouth */}
        <path d="M55 52 Q60 55 65 52" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Body */}
        <ellipse cx="60" cy="80" rx="20" ry="25" fill="#8C1D40" />
        
        {/* Arms */}
        <ellipse cx="40" cy="75" rx="8" ry="15" fill="#8C1D40" transform="rotate(-20 40 75)" />
        <ellipse cx="80" cy="75" rx="8" ry="15" fill="#8C1D40" transform="rotate(20 80 75)" />
        
        {/* Hands */}
        <circle cx="35" cy="85" r="5" fill="#FFC627" />
        <circle cx="85" cy="85" r="5" fill="#FFC627" />
        
        {/* Legs */}
        <ellipse cx="50" cy="105" rx="6" ry="12" fill="#8C1D40" />
        <ellipse cx="70" cy="105" rx="6" ry="12" fill="#8C1D40" />
        
        {/* Feet */}
        <ellipse cx="48" cy="115" rx="8" ry="4" fill="black" />
        <ellipse cx="72" cy="115" rx="8" ry="4" fill="black" />
        
        {/* ASU Logo on chest */}
        <text x="60" y="82" textAnchor="middle" fill="#FFC627" fontSize="8" fontWeight="bold">ASU</text>
        
        {/* Pitchfork */}
        {state === 'celebrating' && (
          <g>
            <line x1="85" y1="85" x2="95" y2="70" stroke="#FFC627" strokeWidth="2" />
            <path d="M93 68 L97 68 M95 68 L95 72" stroke="#FFC627" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
        
        {/* Mail/Letter for delivering state */}
        {state === 'delivering' && (
          <g>
            <rect x="30" y="80" width="12" height="8" fill="white" stroke="#8C1D40" strokeWidth="1" rx="1" />
            <path d="M30 80 L36 84 L42 80" stroke="#8C1D40" strokeWidth="1" fill="none" />
          </g>
        )}
      </svg>
      
      {/* Floating particles for celebration */}
      {state === 'celebrating' && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? '#FFC627' : '#8C1D40',
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 20}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export type GlowColor = 'purple' | 'orange' | 'red' | 'green' | 'yellow' | 'cyan' | 'rainbow' | 'none';

interface FlashGlowCardProps extends HTMLMotionProps<'div'> {
  glowColor?: GlowColor;
  withFlashLine?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const FlashGlowCard: React.FC<FlashGlowCardProps> = ({
  glowColor = 'purple',
  withFlashLine = false,
  className = '',
  children,
  ...props
}) => {
  const getGlowClass = () => {
    switch (glowColor) {
      case 'purple':
        return 'glow-border-purple';
      case 'orange':
        return 'glow-border-orange';
      case 'red':
        return 'glow-border-red';
      case 'green':
        return 'glow-border-green';
      case 'yellow':
        return 'glow-border-yellow';
      case 'cyan':
        return 'border-cyan-500/50 shadow-[0_0_24px_-4px_rgba(6,182,212,0.35)]';
      case 'rainbow':
        return 'flash-glow-card-rainbow';
      case 'none':
      default:
        return 'border-white/10 hover:border-white/20';
    }
  };

  return (
    <motion.div
      className={`flash-glow-card ${getGlowClass()} ${withFlashLine ? 'flash-line-cyber' : ''} ${className}`}
      {...props}
    >
      {/* Soft Ambient Inner Glow Mesh */}
      <div 
        className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-20"
        style={{
          background: glowColor === 'purple' ? '#a855f7' :
                      glowColor === 'orange' ? '#f97316' :
                      glowColor === 'red' ? '#ef4444' :
                      glowColor === 'green' ? '#10b981' :
                      glowColor === 'yellow' ? '#eab308' : '#8b5cf6'
        }}
      />
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default FlashGlowCard;

'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React, { useRef } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = '', onClick, disabled }) => {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    
    // Calculate distance from center of button
    const middleX = rect.width / 2;
    const middleY = rect.height / 2;
    
    const offsetX = e.clientX - rect.left - middleX;
    const offsetY = e.clientY - rect.top - middleY;
    
    // Move the button slightly towards the cursor (magnetic pull)
    x.set(offsetX * 0.2);
    y.set(offsetY * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`relative ${className}`}
    >
      {children}
    </motion.button>
  );
};

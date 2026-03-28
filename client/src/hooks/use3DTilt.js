import { useState } from 'react';
import { useMotionValue, useTransform, useSpring } from 'framer-motion';

export function use3DTilt({
  stiffness = 150,
  damping = 20,
  rotationRange = 8,
  mouseRange = [-0.5, 0.5],
  elementRelative = true,
  disabled = false,
} = {}) {
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(
      mouseY,
      [mouseRange[0], mouseRange[1]],
      [rotationRange, -rotationRange]
    ),
    { stiffness, damping }
  );
  const rotateY = useSpring(
    useTransform(
      mouseX,
      [mouseRange[0], mouseRange[1]],
      [-rotationRange, rotationRange]
    ),
    { stiffness, damping }
  );

  const handleMouseMove = (e) => {
    if (disabled) return;
    if (elementRelative) {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    } else {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX - innerWidth / 2) / (innerWidth / 2));
      mouseY.set((e.clientY - innerHeight / 2) / (innerHeight / 2));
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return {
    rotateX,
    rotateY,
    mouseX,
    mouseY,
    handleMouseMove,
    handleMouseLeave,
    isHovered,
  };
}

export default use3DTilt;

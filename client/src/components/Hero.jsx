import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import TerminalLoader from './TerminalLoader';
import SvgText from './SvgText';
import PrimeBtn from './buttons/PrimeBtn';
import use3DTilt from '../hooks/use3DTilt';
import { TRANSITION_SLOW } from '../utils/motionPresets';

const Hero = () => {
  const [loadingState, setLoadingState] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleLoadingComplete = () => {
    setLoadingState(1);
    setHasLoaded(true);
  };

  useEffect(() => {
    if (hasLoaded && loadingState === 0) {
      setLoadingState(1);
    }
  }, [hasLoaded, loadingState]);

  return (
    <section className="relative min-h-screen">
      <AnimatePresence mode="sync">
        {loadingState === 0 && !hasLoaded && (
          <TerminalLoader
            key="terminal-loader"
            onComplete={handleLoadingComplete}
          />
        )}

        {(loadingState === 1 || hasLoaded) && (
          <HeroContent key="hero-content" />
        )}
      </AnimatePresence>
    </section>
  );
};

const HeroContent = () => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const { rotateX, rotateY, handleMouseMove, handleMouseLeave, isHovered } =
    use3DTilt({
      elementRelative: false,
      mouseRange: [-1, 1],
      stiffness: 150,
      damping: 20,
      disabled: prefersReducedMotion,
    });

  return (
    <motion.div
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={TRANSITION_SLOW}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      {/* Gradient atmosphere with 3D depth */}
      <motion.div
        className="absolute inset-0 z-10"
        animate={{
          backgroundImage: [
            `radial-gradient(
              ellipse at 50% 0%,
              var(--color-inner-glow) 1%,
              var(--color-md-glow) 25%,
              var(--color-outer-glow) 35%,
              var(--color-border-glow) 75%
            )`,
            `radial-gradient(
              ellipse at 50% 8%,
              var(--color-inner-glow) 1%,
              var(--color-md-glow) 26%,
              var(--color-outer-glow) 36%,
              var(--color-border-glow) 95%
            )`,
            `radial-gradient(
              ellipse at 50% 0%,
              var(--color-inner-glow) 1%,
              var(--color-md-glow) 25%,
              var(--color-outer-glow) 35%,
              var(--color-border-glow) 75%
            )`,
          ],
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          backgroundImage: {
            duration: 60,
            ease: 'easeInOut',
            repeat: Infinity,
          },
          scale: {
            duration: 0.3,
            ease: 'easeOut',
          },
        }}
      />

      {/* 3D Tilt Container */}
      <motion.div
        className="hero__inner relative z-20 flex flex-col justify-center items-center h-full min-h-screen px-8 py-20"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: prefersReducedMotion ? 'flat' : 'preserve-3d',
        }}
      >
        {/* Floating decorative elements */}
        <FloatingElements />

        {/* Title */}
        <motion.div
          className="hero__content mb-6 text-center"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          <h1 className="hero__title">
            <SvgText
              text="HELLO WORLD"
              className="text-heading text-4xl sm:text-5xl md:text-7xl"
              staggerDelay={0.08}
              withCursor={true}
              startDelay={0.3}
            />
          </h1>

          <motion.p
            className="hero__subtitle text-lg md:text-xl mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            My name is{' '}
            <span className="hero__title-name font-bold">Your Name</span>
          </motion.p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="hero__subtitle text-sm text-text-muted font-mono"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          Curiosity - Creativity - Code.
        </motion.p>

        {/* Actions */}
        <motion.div
          className="hero__actions flex flex-col sm:flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <PrimeBtn
            as="a"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="gradient"
            tone="primary"
            className="font-mono"
          >
            Visit my GitHub
          </PrimeBtn>

          <PrimeBtn
            as={Link}
            to="/contact"
            variant="gradient"
            tone="secondary"
            className="font-mono"
          >
            Get In Touch
          </PrimeBtn>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const FloatingElements = () => {
  return (
    <>
      <motion.div
        className="absolute top-[15%] left-[15%] w-2 h-2 rounded-full bg-brand-primary"
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-[25%] right-[20%] w-3 h-3 rounded-full bg-brand-accent"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-[40%] left-[25%] w-1.5 h-1.5 rounded-full bg-brand-secondary"
        animate={{
          y: [0, -25, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute top-[10%] right-[40%] w-1 h-1 rounded-full bg-brand-primary"
        animate={{
          y: [0, -15, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </>
  );
};

export default Hero;

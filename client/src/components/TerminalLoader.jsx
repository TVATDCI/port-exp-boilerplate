import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const bootStrings = [
  'System initialization started...',
  'Boot sequence initiated...',
  'Loading core modules...',
  'Mounting file systems...',
  'Establishing secure connection...',
  'Loading user profile...',
  'Initializing display adapter...',
  'Loading animation frameworks...',
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const TerminalLoader = ({ onComplete = () => {} }) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    let timeoutId = null;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          timeoutId = setTimeout(onComplete, 800);
          return 100;
        }
        const next = prev + 1;
        setPhaseIndex(
          Math.min(
            Math.floor((next / 100) * bootStrings.length),
            bootStrings.length - 1
          )
        );
        return next;
      });
    }, 30);

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onComplete]);

  const progressBar = Array(30)
    .fill(0)
    .map((_, i) => (i < (progress / 100) * 30 ? '█' : '░'))
    .join('');

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center font-mono text-sm bg-surface-base"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
      }}
    >
      <div className="relative w-full max-w-2xl p-8">
        <div className="rounded-lg overflow-hidden backdrop-blur-sm border border-brand-accent bg-surface-base relative">
          {/* Terminal header */}
          <div className="px-4 py-2 bg-surface-elevated border-b border-brand-accent flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-text-muted ml-2">system_boot.exe</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 space-y-4 text-text-primary">
            {/* Boot lines with Framer Motion stagger */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1 text-xs text-text-muted"
            >
              {bootStrings.slice(0, phaseIndex + 1).map((line, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <span className="text-brand-primary">$</span> {line}
                </motion.div>
              ))}
            </motion.div>

            {/* Loading phases */}
            <div className="space-y-2 text-xs">
              {bootStrings.slice(0, phaseIndex + 1).map((p, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 ${
                    i === phaseIndex ? 'text-brand-primary' : 'text-text-muted'
                  }`}
                >
                  <span className="text-status-success">✓</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-text-muted">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="font-mono text-xs tracking-wider text-status-success">
                [{progressBar}]
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TerminalLoader;

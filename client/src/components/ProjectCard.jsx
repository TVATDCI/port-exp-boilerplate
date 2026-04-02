import React from 'react';
import { motion, useTransform } from 'framer-motion';
import use3DTilt from '../hooks/use3DTilt';
import { useInView, usePrefersReducedMotion } from '../hooks/useInView';
import { PROJECT_CARD_ENTRY, TRANSITION_NORMAL, TRANSITION_FAST } from '../utils/motionPresets';

const ProjectCard = ({ project, index }) => {
  const [ref, isInView] = useInView({ threshold: 0.1, once: true });
  const prefersReducedMotion = usePrefersReducedMotion();

  const { rotateX, rotateY, mouseY, handleMouseMove, handleMouseLeave, isHovered } = use3DTilt({
    stiffness: 300,
    damping: 30,
    disabled: prefersReducedMotion,
  });

  const imageParallaxY = useTransform(mouseY, [-0.5, 0.5], [-8, 8]);

  return (
    <motion.div
      ref={ref}
      className="relative group cursor-pointer"
      variants={PROJECT_CARD_ENTRY}
      custom={index}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (project.projectUrl) {
          window.open(project.projectUrl, '_blank', 'noopener,noreferrer');
        }
      }}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="relative rounded-xl overflow-hidden bg-surface-elevated border border-border-color"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
        whileHover={{
          scale: 1.02,
          transition: TRANSITION_NORMAL,
        }}
      >
        {/* Image with parallax effect */}
        <motion.div
          className="relative h-56 overflow-hidden"
          style={{
            y: imageParallaxY,
            scale: isHovered ? 1.05 : 1,
            transition: 'scale 0.3s ease',
          }}
        >
          <img className="w-full h-full object-cover" src={project.imageUrl} alt={project.title} />

          {/* Gradient overlay on hover */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, var(--color-bg-body) 0%, transparent 60%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Content overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
          }}
          transition={{ ...TRANSITION_NORMAL, delay: isHovered ? 0.1 : 0 }}
          style={{
            background: `linear-gradient(to top, var(--color-bg-body) 0%, transparent 100%)`,
          }}
        >
          <h3
            className="text-xl font-mono font-bold mb-2"
            style={{ color: 'var(--color-heading)' }}
          >
            {project.title}
          </h3>
          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded text-xs font-mono"
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* View Project link */}
          <motion.a
            href={project.projectUrl || project.link}
            className="inline-flex items-center gap-2 text-sm font-mono"
            style={{ color: 'var(--color-brand-primary)' }}
            whileHover={{ x: 5 }}
            transition={TRANSITION_NORMAL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <span>View Project</span>
          </motion.a>
        </motion.div>

        {/* ID badge */}
        <div
          className="absolute top-4 left-4 px-2 py-1 rounded text-xs font-mono z-10"
          style={{
            backgroundColor: 'var(--color-surface-base)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {project.title}
        </div>

        {/* Featured badge */}
        {project.featured && (
          <motion.div
            className="absolute top-4 right-4 px-2 py-1 rounded text-xs font-mono z-10 flex items-center gap-1"
            style={{
              backgroundColor: 'var(--color-brand-primary)',
              color: 'var(--color-text-base)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span>★</span>
            <span>FEATURED</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;

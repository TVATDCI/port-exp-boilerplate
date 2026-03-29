import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { API_ENDPOINTS } from '../api';
import { STAGGER_CONTAINER } from '../utils/motionPresets';

const categories = ['All', 'MERN', 'APIs', 'Frontend', 'Experiments'];

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetch(API_ENDPOINTS.projects)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="font-mono text-text-muted">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="font-mono text-status-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl font-dune font-bold text-center mb-8"
          style={{ color: 'var(--color-heading)' }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          ./showcase_work
        </motion.h2>

        {/* Filter tabs - terminal style */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded font-mono text-sm transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-brand-primary text-surface-base'
                  : 'bg-surface-elevated text-text-muted hover:text-text-primary border border-border-color'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="font-mono text-text-muted">
              No projects found in this category.
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

// [Last Session] Implemented client-side filtering by category
// Filter logic: activeFilter state filters projects by category property
// Future: Add server-side filtering via query params (e.g., ?category=MERN)
export default ProjectList;

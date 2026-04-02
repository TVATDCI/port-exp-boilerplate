import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div
      className="container mx-auto px-5 py-24 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold">About Me</h1>
      </div>
      <div className="max-w-3xl mx-auto text-lg text-gray-300 leading-relaxed">
        <p className="mb-4">
          Hello! A production-ready full-stack portfolio template for React developers transitioning
          from junior to mid-level. Features modern tooling, enterprise-grade security,
          comprehensive testing, Docker containerization, and CI/CD automation.{' '}
          <p>
            & i&apos;m a passionately and created by a developer with a love for building beautiful,
            interactive, and user-friendly web applications.
          </p>
        </p>
        <p className="mb-4">
          With a bit background of design and a strong foundation in modern frontend technologies
          like React, I strive to bridge the gap between aesthetics and functionality. I believe
          that great software is not just about powerful features, but also about providing a
          seamless and enjoyable experience for the end-user.
        </p>
        <p></p>
      </div>
    </motion.div>
  );
};

export default About;

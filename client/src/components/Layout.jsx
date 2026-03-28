import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from './Toast';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background atmosphere */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at 50% 0%,
            var(--color-atmo-center) 1%,
            var(--color-atmo-mid) 25%,
            var(--color-atmo-edge) 35%,
            var(--color-atmo-deep) 75%
          )`
        }}
      />
      
      {/* Content layer */}
      <motion.div 
        className="relative z-10 flex flex-col min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
        <Toast />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </motion.div>
    </div>
  );
};

export default Layout;

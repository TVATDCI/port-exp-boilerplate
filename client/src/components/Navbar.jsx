import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggleBtn from './ThemeToggleBtn';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-surface-base/80 backdrop-blur-md sticky top-0 z-50 border-b border-border-color">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/"
              className="text-2xl font-bold text-heading hover:text-brand-primary transition-colors"
            >
              Portfolio
            </Link>
          </motion.div>
          <div className="hidden md:flex items-center space-x-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                to="/work"
                className="text-text-muted hover:text-text-base transition-colors font-mono text-sm uppercase tracking-wider"
              >
                Work
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/about"
                className="text-text-muted hover:text-text-base transition-colors font-mono text-sm uppercase tracking-wider"
              >
                About
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/contact"
                className="text-text-muted hover:text-text-base transition-colors font-mono text-sm uppercase tracking-wider"
              >
                Contact
              </Link>
            </motion.div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-text-muted text-sm font-mono">{user.email}</span>
                <button
                  onClick={logout}
                  className="text-text-muted hover:text-text-base transition-colors text-sm font-mono"
                >
                  Logout
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/login"
                  className="text-text-muted hover:text-text-base transition-colors font-mono text-sm uppercase tracking-wider"
                >
                  Login
                </Link>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ThemeToggleBtn />
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

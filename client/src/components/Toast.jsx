import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Toast = () => {
  const { notification } = useAuth();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className={`fixed top-20 left-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-600'
              : notification.type === 'error'
                ? 'bg-red-600'
                : 'bg-gray-800'
          } text-white`}
        >
          {notification.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

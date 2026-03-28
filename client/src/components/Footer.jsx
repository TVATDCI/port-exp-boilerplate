import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-surface-base border-t border-border-color py-6">
      <div className="container mx-auto text-center">
        <p className="text-text-muted font-mono text-sm">&copy; {year} Your Name. All Rights Reserved.</p>
        <p className="mt-2 text-text-muted font-mono text-xs">
          Built with React, Tailwind CSS, and Framer Motion.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

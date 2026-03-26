import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-white">
            <Link to="/">MyPortfolio</Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/work" className="text-gray-300 hover:text-white transition-colors">Work</Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">{user.email}</span>
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

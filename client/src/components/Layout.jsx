import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from './Toast';

const Layout = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Navbar />
      <Toast />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white">
      <Navbar />
      {/* Add padding-top to account for the fixed Navbar across all pages */}
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

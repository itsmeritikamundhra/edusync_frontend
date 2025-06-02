import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out? 🥹')) {
      clearAuth();
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">EduSync</div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            {userRole === 'Instructor' ? 'Instructor' : 'Student'} Dashboard
          </span>
          <button
            onClick={handleSignOut}
            className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
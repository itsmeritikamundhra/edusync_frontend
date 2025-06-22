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

  const handleDashboardClick = () => {
    if (userRole === 'Instructor') {
      navigate('/instructor-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">EduSync</div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDashboardClick}
            className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200 flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {userRole === 'Instructor' ? 'Instructor' : 'Student'} Dashboard
          </button>
          <button
            onClick={handleSignOut}
            className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
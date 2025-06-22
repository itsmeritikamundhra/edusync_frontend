import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseDetails from './pages/CourseDetails';
import AssessmentResults from './pages/AssessmentResults';
import TakeAssessment from './pages/TakeAssessment';
import EditCourse from './pages/EditCourse';
import Assessments from './pages/Assessments';
import { isAuthenticated } from './utils/auth';
import './App.css';

// Navigation guard component
const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated() && !['/', '/login', '/register'].includes(location.pathname)) {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  if (!isAuthenticated() && !['/', '/login', '/register'].includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  // If no token, show the public route (login/register)
  if (!token) {
    return children;
  }

  // If there is a token but no role, clear auth and show login
  if (!userRole) {
    localStorage.clear();
    return children;
  }

  // Only redirect to dashboard if both token and role exist
  return <Navigate to={`/${userRole.toLowerCase()}-dashboard`} replace />;
};

const RoleBasedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('userRole');
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (userRole !== allowedRole) {
    // If user is not authorized for this route, redirect to their dashboard
    return <Navigate to={`/${userRole.toLowerCase()}-dashboard`} replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
        
        <Route
          path="/student-dashboard"
          element={
            <AuthGuard>
              <RoleBasedRoute allowedRole="Student">
                <StudentDashboard />
              </RoleBasedRoute>
            </AuthGuard>
          }
        />
        
        <Route
          path="/instructor-dashboard"
          element={
            <AuthGuard>
              <RoleBasedRoute allowedRole="Instructor">
                <InstructorDashboard />
              </RoleBasedRoute>
            </AuthGuard>
          }
        />
        
        <Route
          path="/course/:courseId"
          element={
            <AuthGuard>
              <CourseDetails />
            </AuthGuard>
          }
        />

        <Route
          path="/edit-course/:courseId"
          element={
            <AuthGuard>
              <RoleBasedRoute allowedRole="Instructor">
                <EditCourse />
              </RoleBasedRoute>
            </AuthGuard>
          }
        />

        <Route
          path="/assessment/:assessmentId/results"
          element={
            <AuthGuard>
              <AssessmentResults />
            </AuthGuard>
          }
        />

        <Route
          path="/assessment/:assessmentId/take"
          element={
            <AuthGuard>
              <TakeAssessment />
            </AuthGuard>
          }
        />

        <Route
          path="/assessments"
          element={
            <AuthGuard>
              <RoleBasedRoute allowedRole="Instructor">
                <Assessments />
              </RoleBasedRoute>
            </AuthGuard>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

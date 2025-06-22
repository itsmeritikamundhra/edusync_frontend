import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/Assessments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }

      const data = await response.json();
      setAssessments(data);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssessment = () => {
    navigate('/create-assessment');
  };

  const handleEditAssessment = (assessmentId) => {
    navigate(`/edit-assessment/${assessmentId}`);
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/Assessments/${assessmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete assessment');
      }

      setAssessments(assessments.filter(a => a.id !== assessmentId));
      alert('Assessment deleted successfully!');
    } catch (err) {
      console.error('Error deleting assessment:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Assessments</h1>
          <button
            onClick={handleCreateAssessment}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Assessment
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {assessments.map(assessment => (
            <div key={assessment.id} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2">{assessment.title}</h2>
              <p className="text-gray-600 mb-2">Course: {assessment.courseTitle || 'Not assigned'}</p>
              <p className="text-gray-600 mb-4">Questions: {
                Array.isArray(assessment.questions) 
                  ? assessment.questions.length 
                  : (typeof assessment.questions === 'string' 
                    ? JSON.parse(assessment.questions).length 
                    : 0)
              }</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditAssessment(assessment.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAssessment(assessment.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {assessments.length === 0 && (
            <p className="text-gray-500">No assessments found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Assessments; 
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth'; // Importing the authentication context

const SubmissionHistory = ({ problem, setUserCode }) => {
  const { user } = useAuth(); // Get the user from the context
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // To show a loading state

  // Fetch submission history when the component mounts or problem changes
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/submissions/${problem._id}/${user.id}`);
        const data = await response.json();
        setSubmissions(data.submissions || []);
      } catch (error) {
        console.error('Error fetching submission history:', error);
        setSubmissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (problem && problem._id && user) {
      fetchSubmissions();
    }
  }, [problem, user]);

  if (isLoading) {
    return <div>Loading submission history...</div>; // Loading state
  }

  // Helper function to determine the text color based on the submission status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-500';
      case 'Wrong Answer':
        return 'text-red-500';
      case 'Runtime Error':
        return 'text-yellow-500';
      case 'Compilation Error':
        return 'text-gray-500';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-700">Submission History:</h3>
      <ul className="mt-2">
        {submissions.length > 0 ? (
          submissions.map((submission, index) => (
            <li key={index} className="border-b py-2">
              <div className="flex justify-between items-center">
                <div className={`text-sm ${getStatusColor(submission.status)}`}>
                  <p>{submission.status}</p>
                  <p className="text-xs">{new Date(submission.submittedAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setUserCode(submission.code)} // Set user code on click
                  className="bg-blue-500 text-white px-4 py-2 rounded-sm text-xs hover:bg-blue-600"
                >
                  Use Code
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No submissions yet.</p>
        )}
      </ul>
    </div>
  );
};

export default SubmissionHistory;

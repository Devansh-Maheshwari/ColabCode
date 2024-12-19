import React, { useState } from 'react';
import { useAuth } from '../context/auth';

const Signup = () => {
  const { signup } = useAuth(); // Access signup function from AuthContext
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { username, email, password } = formData;
      console.log(formData)
      await signup({username, email, password}); // Call the signup function
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="bg-gray-700 h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-md w-full p-8 bg-gray-800 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Signup</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-600 border border-gray-500 rounded-lg"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-600 border border-gray-500 rounded-lg"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-600 border border-gray-500 rounded-lg"
          required
        />
        <button type="submit" className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;

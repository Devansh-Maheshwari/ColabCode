import React, { useState } from 'react';
import { useAuth } from '../context/auth';

const Login = () => {
  const { login } = useAuth(); // Access login function from AuthContext
  const [formData, setFormData] = useState({
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
      const { email, password } = formData;
      await login(email, password); // Call the login function
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-gray-700 h-screen flex items-center justify-center w-screen">
      <form onSubmit={handleSubmit} className="max-w-md w-full p-8 bg-gray-800 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
        <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

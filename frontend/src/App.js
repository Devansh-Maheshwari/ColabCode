import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './component/Navbar';
import PostChallenge from './component/PostChallenge';
import Explore from './component/Explore';
import Dashboard from './component/Dashboard';
import Hero from './component/Hero';
import Signup from './component/Signup';
import Login from './component/Login';
import  ProblemDetail  from './component/ProblemDetail';
import ProtectedRoute from './context/ProtectedRoute';
function App() {
  return (
    <>
      <Navbar />
      <div className="container  ">
        <Routes>
          <Route path="/" element={<Hero/>} />
          <Route path="/post-challenge" element={<ProtectedRoute><PostChallenge /> </ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:id" element={<ProblemDetail />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

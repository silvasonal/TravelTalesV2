import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './home';
import Register from './Register';
import Profile from './profile';
import Layout from './layout';
import CreateBlog from './createBlog';
import ForgotPassword from './ForgotPassword';

const App = () => {
  const savedToken = localStorage.getItem('token');
  const [token, setToken] = useState(savedToken); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null); 
  };

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  }
  
  return (
    <Router> 
      <Routes>
            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
        
            {/* Shared Layout */}
            <Route path="/" element={<Layout token={token} handleLogout={handleLogout} />}>

              {/* Public pages accessible by all users */}
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />

              {/* Private pages (require token) */}
              <Route path="/profile" element={ <PrivateRoute>  <Profile />  </PrivateRoute>} />
              <Route path="/profile/:authorId?" element={ <PrivateRoute>  <Profile />  </PrivateRoute>} />
              <Route path="/create" element={ <PrivateRoute>  <CreateBlog />  </PrivateRoute>} />
              <Route path="/update/:postId?" element={ <PrivateRoute> <CreateBlog />  </PrivateRoute>} />
              </Route>

            <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default App;

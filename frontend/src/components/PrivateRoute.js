import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Handle function as child (render prop pattern)
  if (typeof children === 'function') {
    return children({ user });
  }

  return children;
}

export default PrivateRoute;
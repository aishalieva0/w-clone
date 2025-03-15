import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.user);

    if (loading) return null;

    return isAuthenticated ? children : <Navigate to="/register" replace />;
};


export default PrivateRoute;



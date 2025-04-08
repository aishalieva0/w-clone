import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  console.log("🔍 authReady:", authReady);

  const { isAuthenticated, loading, authReady } = useSelector(
    (state) => state.user
  );

  if (loading) return null;
  // if (!authReady) {
  //   return null;
  // }
  return isAuthenticated ? children : <Navigate to="/register" replace />;
};

export default PrivateRoute;

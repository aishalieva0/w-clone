import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Welcome from '../pages/Welcome';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Chat from '../pages/Chat';
import PrivateRoute from './PrivateRoute';
const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Welcome />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/chat" element={<PrivateRoute>
                <Chat />
            </PrivateRoute>} />
            <Route path="/login" element={<PrivateRoute>
                <Login />
            </PrivateRoute>} />

            <Route path="*" element={<Welcome />} />
        </Routes>
    )
}

export default AppRoutes
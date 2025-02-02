import React, { useContext } from 'react';
import { UserContext } from './context/UserContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { getUserInfos } = useContext(UserContext);
    const user = getUserInfos();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/welcome" replace />;
    }

    return children;
};

export default ProtectedRoute;
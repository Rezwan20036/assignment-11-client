import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, role: requiredRole }) => {
    const { user, role, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace></Navigate>
    }

    if (requiredRole && role !== requiredRole) {
        // Redirect to their respective home if they try to access wrong role dashboard
        const redirectPath = role === 'admin' ? '/admin/home' : (role === 'staff' ? '/staff/home' : '/citizen/home');
        return <Navigate to={redirectPath} replace />
    }

    return children;
};

export default PrivateRoute;

import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const GuestRoute = ({ children }) => {
    const { user, role, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>
    }

    if (user) {
        // Redirect to home if they are already logged in
        const redirectPath = role === 'admin' ? '/admin/home' : (role === 'staff' ? '/staff/home' : '/citizen/home');
        return <Navigate to={redirectPath} replace />
    }

    return children;
};

export default GuestRoute;

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

const DashboardHome = () => {
    const { role, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-green-600"></span>
        </div>;
    }

    if (role === 'admin') {
        return <Navigate to="/admin/home" replace />;
    }

    if (role === 'staff') {
        return <Navigate to="/staff/home" replace />;
    }

    return <Navigate to="/citizen/home" replace />;
};

export default DashboardHome;

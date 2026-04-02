import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // You could return a full-page loading spinner here if desired
        return <div className="min-h-screen flex items-center justify-center bg-black"><span className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></span></div>;
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to so they might be redirected back after login if implemented
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isLoading, user, logout } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ width: 40, height: 40, border: "4px solid rgba(238,124,43,0.2)", borderTopColor: "#ee7c2b", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Not logged in at all → redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Logged in but NOT admin → show clear message with logout option
    if (user?.role !== "admin") {
        return (
            <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#fff" }}>
                <div style={{ fontSize: 48 }}>🚫</div>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Admin Access Only</h1>
                <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
                    Your account (<strong style={{ color: "#888" }}>{user?.email}</strong>) doesn't have admin privileges.
                </p>
                <p style={{ color: "#555", fontSize: 13, margin: 0 }}>
                    If you were just promoted to admin, please <strong style={{ color: "#ee7c2b" }}>log out and log back in</strong>.
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <button onClick={logout} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#ee7c2b,#d46a1f)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                        Log Out &amp; Re-Login
                    </button>
                    <a href="/" style={{ padding: "10px 24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#888", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminRoute;

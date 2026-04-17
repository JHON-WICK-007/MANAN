import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { LogOut, User } from "lucide-react";

const breadcrumbMap = {
    "/admin/dashboard":    ["Admin", "Dashboard"],
    "/admin/reservations": ["Admin", "Reservations"],
    "/admin/tables":       ["Admin", "Tables"],
    "/admin/menu":         ["Admin", "Menu"],
    "/admin/orders":       ["Admin", "Orders"],
    "/admin/customers":    ["Admin", "Customers"],
    "/admin/messages":     ["Admin", "Messages"],
    "/admin/analytics":    ["Admin", "Analytics"],
    "/admin/settings":     ["Admin", "Settings"],
};

const TopHeader = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const crumbs = breadcrumbMap[location.pathname] || ["Admin"];
    const pageTitle = crumbs[crumbs.length - 1];

    return (
        <header style={{
            position: "sticky",
            top: 0,
            height: 72,
            background: "rgba(10,10,10,0.92)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            zIndex: 40,
            flexShrink: 0,
        }}>
            {/* Left — Title + Breadcrumb */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    {crumbs.map((c, i) => (
                        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {i > 0 && <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>/</span>}
                            <span style={{
                                color: i === crumbs.length - 1 ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)",
                                fontSize: 12, fontWeight: 400,
                            }}>{c}</span>
                        </span>
                    ))}
                </div>
                <h1 style={{
                    color: "#fff", fontSize: 20, fontWeight: 700,
                    letterSpacing: "-0.02em", margin: 0,
                    fontFamily: "'Playfair Display', serif",
                }}>{pageTitle}</h1>
            </div>

            {/* Right — Avatar + Name + Logout */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 14px",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)",
                }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: "linear-gradient(135deg, #ee7c2b, #d46a1f)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <User size={15} color="#fff" />
                    </div>
                    <div>
                        <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Admin"}</div>
                        <div style={{ color: "#ee7c2b", fontSize: 11, fontWeight: 500 }}>Administrator</div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "8px 16px",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        borderRadius: 10, color: "#ef4444",
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(239,68,68,0.2)";
                        e.currentTarget.style.boxShadow = "0 0 12px rgba(239,68,68,0.2)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    <LogOut size={14} />
                    Logout
                </button>
            </div>
        </header>
    );
};

export default TopHeader;

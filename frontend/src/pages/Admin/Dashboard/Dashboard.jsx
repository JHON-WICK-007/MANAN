import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import { CalendarCheck, ShoppingBag, UtensilsCrossed, Users, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay, duration: 0.4 } }}
        style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            backdropFilter: "blur(10px)",
            cursor: "default",
        }}
        whileHover={{ y: -3, boxShadow: `0 12px 40px -10px ${color}60, 0 2px 10px -2px ${color}40`, transition: { duration: 0.15 } }}
    >
        <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `${color}18`,
            border: `1px solid ${color}30`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
            <Icon size={22} style={{ color }} />
        </div>
        <div>
            <div style={{ color: "#888", fontSize: 12, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
            <div style={{ color: "#fff", fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>{value ?? "—"}</div>
        </div>
    </motion.div>
);

const statusColors = {
    Pending: "#f59e0b", Confirmed: "#10b981", Cancelled: "#ef4444",
    Processing: "#3b82f6", Delivered: "#10b981",
};

const StatusBadge = ({ status }) => (
    <span style={{
        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
        background: `${statusColors[status] || "#888"}18`,
        color: statusColors[status] || "#888",
        border: `1px solid ${statusColors[status] || "#888"}30`,
    }}>{status}</span>
);

const Dashboard = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(d => { setData(d.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <div style={{ width: 40, height: 40, border: "3px solid rgba(238,124,43,0.2)", borderTopColor: "#ee7c2b", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
    );

    const stats = data?.stats || {};
    const cards = [
        { label: "Today's Reservations", value: stats.todayReservations, icon: CalendarCheck, color: "#ee7c2b" },
        { label: "Active Orders", value: stats.activeOrders, icon: ShoppingBag, color: "#3b82f6" },
        { label: "Tables Occupied", value: stats.tablesOccupied, icon: UtensilsCrossed, color: "#10b981" },
        { label: "Total Customers", value: stats.totalCustomers, icon: Users, color: "#a78bfa" },
    ];

    return (
        <div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 36 }}>
                {cards.map((c, i) => <StatCard key={c.label} {...c} delay={i * 0.08} />)}
            </div>

            {/* Two section tables */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

                {/* Recent Reservations */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 3, height: 18, background: "linear-gradient(180deg,#ee7c2b,#d46a1f)", borderRadius: 4 }} />
                            <h2 style={{ color: "#f0f0f0", fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: "0.01em" }}>Recent Reservations</h2>
                        </div>
                        <button onClick={() => navigate("/admin/reservations")}
                            style={{ color: "#ee7c2b", fontSize: 11, background: "rgba(238,124,43,0.08)", border: "1px solid rgba(238,124,43,0.2)", borderRadius: 8, cursor: "pointer", fontWeight: 600, padding: "5px 12px", transition: "all 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(238,124,43,0.15)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(238,124,43,0.08)"; }}
                        >View all →</button>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                {["Name", "Guests", "Date", "Status"].map(h => (
                                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "#555", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(data?.recentReservations || []).map((r, i) => (
                                <tr key={r._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                    <td style={{ padding: "14px 20px", color: "#e0e0e0", fontSize: 13 }}>{r.userName || "—"}</td>
                                    <td style={{ padding: "14px 20px", color: "#888", fontSize: 13 }}>{r.guests}</td>
                                    <td style={{ padding: "14px 20px", color: "#888", fontSize: 13 }}>{r.date}</td>
                                    <td style={{ padding: "14px 20px" }}><StatusBadge status={r.status} /></td>
                                </tr>
                            ))}
                            {!data?.recentReservations?.length && (
                                <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", fontSize: 13 }}><span style={{ color: "#ee7c2b", opacity: 0.7, fontWeight: 500 }}>No reservations yet</span></td></tr>
                            )}
                        </tbody>
                    </table>
                </motion.div>

                {/* Recent Orders */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 3, height: 18, background: "linear-gradient(180deg,#ee7c2b,#d46a1f)", borderRadius: 4 }} />
                            <h2 style={{ color: "#f0f0f0", fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: "0.01em" }}>Recent Orders</h2>
                        </div>
                        <button onClick={() => navigate("/admin/orders")}
                            style={{ color: "#ee7c2b", fontSize: 11, background: "rgba(238,124,43,0.08)", border: "1px solid rgba(238,124,43,0.2)", borderRadius: 8, cursor: "pointer", fontWeight: 600, padding: "5px 12px", transition: "all 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(238,124,43,0.15)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(238,124,43,0.08)"; }}
                        >View all →</button>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                {["Order ID", "Customer", "Total", "Status"].map(h => (
                                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "#555", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(data?.recentOrders || []).map((o) => (
                                <tr key={o._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                    <td style={{ padding: "14px 20px", color: "#ee7c2b", fontSize: 12, fontFamily: "monospace" }}>{o.orderId}</td>
                                    <td style={{ padding: "14px 20px", color: "#e0e0e0", fontSize: 13 }}>{o.user?.name || "—"}</td>
                                    <td style={{ padding: "14px 20px", color: "#10b981", fontSize: 13, fontWeight: 600 }}>₹{o.totalAmount}</td>
                                    <td style={{ padding: "14px 20px" }}><StatusBadge status={o.status} /></td>
                                </tr>
                            ))}
                            {!data?.recentOrders?.length && (
                                <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", fontSize: 13 }}><span style={{ color: "#ee7c2b", opacity: 0.7, fontWeight: 500 }}>No orders yet</span></td></tr>
                            )}
                        </tbody>
                    </table>
                </motion.div>

            </div>
        </div>
    );
};

export default Dashboard;

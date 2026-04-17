import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const API = "http://localhost:5000/api";
const PIE_COLORS = ["#ee7c2b", "#3b82f6", "#10b981", "#a78bfa", "#f59e0b"];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>{label}</div>
            {payload.map(p => (
                <div key={p.name} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
                    {p.name}: {p.value}
                </div>
            ))}
        </div>
    );
};

const ChartCard = ({ title, children, delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
        style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: "24px 28px",
        }}>
        <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 24px" }}>{title}</h3>
        {children}
    </motion.div>
);

const AdminAnalytics = () => {
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/admin/analytics`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json()).then(d => { setData(d.data); setLoading(false); });
    }, [token]);

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <div style={{ width: 40, height: 40, border: "3px solid rgba(238,124,43,0.2)", borderTopColor: "#ee7c2b", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const lineData = (data?.labels || []).map((label, i) => ({
        date: label.slice(5), // MM-DD
        Reservations: data.reservationCounts[i],
    }));

    const barData = (data?.labels || []).map((label, i) => ({
        date: label.slice(5),
        Orders: data.orderCounts[i],
    }));

    const pieData = (data?.popularDishes || []).map(d => ({ name: d.name, value: d.count }));

    const tickStyle = { fill: "#555", fontSize: 11 };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Line Chart */}
            <ChartCard title="Reservations — Last 7 Days" delay={0}>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" tick={tickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="Reservations" stroke="#ee7c2b" strokeWidth={2.5} dot={{ r: 4, fill: "#ee7c2b" }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Bar Chart */}
            <ChartCard title="Orders — Last 7 Days" delay={0.08}>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" tick={tickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="Orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Pie Chart */}
            <ChartCard title="Popular Dishes" delay={0.16}>
                {pieData.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}><span style={{ color: "#ee7c2b", fontSize: 16, fontWeight: 500, opacity: 0.7 }}>No order data yet.</span></div>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend formatter={(value) => <span style={{ color: "#888", fontSize: 12 }}>{value}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            {/* Summary Stats */}
            <ChartCard title="Summary" delay={0.24}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                        <span style={{ color: "#888", fontSize: 13 }}>Total Reservations (7d)</span>
                        <span style={{ color: "#ee7c2b", fontWeight: 700, fontSize: 20 }}>{data?.reservationCounts?.reduce((a, b) => a + b, 0) ?? 0}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                        <span style={{ color: "#888", fontSize: 13 }}>Total Orders (7d)</span>
                        <span style={{ color: "#3b82f6", fontWeight: 700, fontSize: 20 }}>{data?.orderCounts?.reduce((a, b) => a + b, 0) ?? 0}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                        <span style={{ color: "#888", fontSize: 13 }}>Top Dish</span>
                        <span style={{ color: "#10b981", fontWeight: 600, fontSize: 14 }}>{data?.popularDishes?.[0]?.name || "—"}</span>
                    </div>
                </div>
            </ChartCard>
        </div>
    );
};

export default AdminAnalytics;

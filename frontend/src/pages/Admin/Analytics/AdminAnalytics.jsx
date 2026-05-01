import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import {
    Calendar, ShoppingBag, IndianRupee, TrendingUp,
    LayoutGrid, RefreshCw, Star,
} from "lucide-react";

const API = "http://localhost:5000/api";

/* ─── Tooltip ─────────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: "rgba(10,10,10,0.96)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14,
            padding: "14px 18px", boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
        }}>
            <div style={{ color: "#666", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
            {payload.map(p => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
                    <span style={{ color: "#999", fontSize: 12, fontWeight: 500 }}>{p.name}</span>
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, marginLeft: "auto", paddingLeft: 16 }}>
                        {p.name === "Revenue" ? `₹${p.value}` : p.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

/* ─── KPI Card ─────────────────────────────────────────────────────────── */
const KPICard = ({ title, value, sub, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
            background: "linear-gradient(160deg, #141414 0%, #0c0c0c 100%)",
            border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20,
            padding: "24px 24px", position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column", gap: 16,
        }}
    >
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: `${color}15`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${color}15` }}>
                <Icon size={21} color={color} />
            </div>
            {sub && <div style={{ color: "#555", fontSize: 11, fontWeight: 600 }}>{sub}</div>}
        </div>
        <div>
            <div style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{title}</div>
            <div style={{ color: "#fff", fontSize: 26, fontWeight: 800, fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
        </div>
    </motion.div>
);

/* ─── Chart Card ───────────────────────────────────────────────────────── */
const ChartCard = ({ title, children, delay = 0, right }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
            background: "linear-gradient(160deg, #141414 0%, #0c0c0c 100%)",
            border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: "28px",
        }}
    >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
            {right}
        </div>
        {children}
    </motion.div>
);

/* ─── Status Pill ──────────────────────────────────────────────────────── */
const StatusPill = ({ label, count, color }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: `${color}08`, border: `1px solid ${color}18`, borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
            <span style={{ color: "#bbb", fontSize: 13, fontWeight: 500 }}>{label}</span>
        </div>
        <span style={{ color, fontSize: 16, fontWeight: 800 }}>{count}</span>
    </div>
);

/* ─── Axis tick ────────────────────────────────────────────────────────── */
const tick = { fill: "#555", fontSize: 11, fontWeight: 500 };

/* ─────────────────────────────────────────────────────────────────────── */
const AdminAnalytics = () => {
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const load = useCallback(async (silent = false) => {
        if (silent) setRefreshing(true);
        try {
            const res = await fetch(`${API}/admin/analytics`, { headers: { Authorization: `Bearer ${token}` } });
            const json = await res.json();
            setData(json.data);
            setLastUpdated(new Date());
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [token]);

    useEffect(() => {
        load();
        const interval = setInterval(() => load(true), 30000); // auto-refresh every 30s
        return () => clearInterval(interval);
    }, [load]);

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh", flexDirection: "column", gap: 16 }}>
            <div style={{ width: 44, height: 44, border: "3px solid rgba(238,124,43,0.1)", borderTopColor: "#ee7c2b", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <span style={{ color: "#555", fontSize: 13 }}>Loading analytics…</span>
        </div>
    );

    /* ── Derived values ── */
    const totalRes  = data?.reservationCounts?.reduce((a, b) => a + b, 0) ?? 0;
    const totalOrd  = data?.orderCounts?.reduce((a, b) => a + b, 0) ?? 0;
    const weekRev   = data?.weekRevenue ?? 0;
    const topDish   = data?.popularDishes?.[0]?.name ?? "—";

    const trendData = (data?.labels || []).map((label, i) => ({
        date: label.slice(5),
        Reservations: data.reservationCounts[i],
        Orders: data.orderCounts[i],
        Revenue: data.revenueCounts[i],
    }));

    const pieData  = data?.popularDishes || [];
    const tableB   = data?.tableBreakdown || {};
    const resB     = data?.resBreakdown || {};
    const dishMax  = Math.max(...pieData.map(d => d.count), 1);

    const DISH_COLORS = ["#ee7c2b", "#3b82f6", "#10b981", "#a78bfa", "#f59e0b"];
    const TABLE_COLORS = { Available: "#10b981", Occupied: "#ef4444", Reserved: "#f59e0b", Disabled: "#6b7280" };
    const RES_COLORS   = { Confirmed: "#10b981", Pending: "#f59e0b", Cancelled: "#ef4444", Completed: "#3b82f6" };

    const timeStr = lastUpdated ? lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 40 }}>

            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
                {timeStr && <span style={{ color: "#555", fontSize: 12 }}>Updated {timeStr}</span>}
                <button onClick={() => load(true)} disabled={refreshing}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "7px 14px", color: "#888", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                >
                    <RefreshCw size={13} style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }} />
                    Refresh
                </button>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
                <KPICard title="Reservations" value={totalRes} sub="Last 7 days" icon={Calendar} color="#ee7c2b" delay={0} />
                <KPICard title="Orders" value={totalOrd} sub="Last 7 days" icon={ShoppingBag} color="#3b82f6" delay={0.08} />
                <KPICard title="Revenue" value={`₹${weekRev.toLocaleString("en-IN")}`} sub="Last 7 days" icon={IndianRupee} color="#10b981" delay={0.16} />
                <KPICard title="Top Dish" value={topDish} sub={<Star size={12} />} icon={TrendingUp} color="#a78bfa" delay={0.24} />
            </div>

            {/* Main Trend Chart — full width */}
            <ChartCard title="Performance Overview — Last 7 Days" delay={0.3} right={
                <div style={{ display: "flex", gap: 20 }}>
                    {[["#ee7c2b", "Reservations"], ["#3b82f6", "Orders"], ["#10b981", "Revenue"]].map(([c, l]) => (
                        <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                            <span style={{ color: "#666", fontSize: 11, fontWeight: 600 }}>{l}</span>
                        </div>
                    ))}
                </div>
            }>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -18, bottom: 0 }}>
                        <defs>
                            {[["res", "#ee7c2b"], ["ord", "#3b82f6"], ["rev", "#10b981"]].map(([id, c]) => (
                                <linearGradient key={id} id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={c} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="rgba(255,255,255,0.035)" />
                        <XAxis dataKey="date" tick={tick} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tick={tick} axisLine={false} tickLine={false} allowDecimals={false} dx={-8} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.07)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                        <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#grev)" activeDot={{ r: 5, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="Orders" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gord)" activeDot={{ r: 5, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="Reservations" stroke="#ee7c2b" strokeWidth={2.5} fill="url(#gres)" activeDot={{ r: 5, strokeWidth: 0 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Bottom Row: Dishes | Table Status | Reservation Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>

                {/* Popular Dishes */}
                <ChartCard title="Popular Dishes" delay={0.4} right={<TrendingUp size={15} color="#555" />}>
                    {pieData.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "50px 0" }}>
                            <ShoppingBag size={36} color="#333" style={{ marginBottom: 12 }} />
                            <div style={{ color: "#555", fontSize: 13 }}>No order data yet</div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {pieData.map((d, i) => (
                                <div key={d.name}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                                        <span style={{ color: "#bbb", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{i + 1}. {d.name}</span>
                                        <span style={{ color: DISH_COLORS[i % 5], fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{d.count}</span>
                                    </div>
                                    <div style={{ height: 5, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                                        <motion.div
                                            initial={{ width: 0 }} animate={{ width: `${(d.count / dishMax) * 100}%` }}
                                            transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                                            style={{ height: "100%", background: DISH_COLORS[i % 5], borderRadius: 4, boxShadow: `0 0 8px ${DISH_COLORS[i % 5]}80` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ChartCard>

                {/* Table Status */}
                <ChartCard title="Table Status" delay={0.48} right={<LayoutGrid size={15} color="#555" />}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {Object.entries(TABLE_COLORS).map(([status, color]) => (
                            <StatusPill key={status} label={status} count={tableB[status] ?? 0} color={color} />
                        ))}
                    </div>
                </ChartCard>

                {/* Reservation Breakdown */}
                <ChartCard title="Reservations" delay={0.56} right={<Calendar size={15} color="#555" />}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {Object.entries(RES_COLORS).map(([status, color]) => (
                            <StatusPill key={status} label={status} count={resB[status] ?? 0} color={color} />
                        ))}
                    </div>
                </ChartCard>
            </div>
        </div>
    );
};

export default AdminAnalytics;

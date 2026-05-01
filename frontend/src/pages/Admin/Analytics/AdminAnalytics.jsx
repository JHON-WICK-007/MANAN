import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Calendar, ShoppingBag, IndianRupee, TrendingUp, LayoutGrid, RefreshCw, Star } from "lucide-react";

const API = "http://localhost:5000/api";

/* ─── Glassmorphism Tooltip ─────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: "rgba(8,8,8,0.97)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16,
            padding: "14px 20px", boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
            minWidth: 180,
        }}>
            <div style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{label}</div>
            {payload.map(p => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, flexShrink: 0, boxShadow: `0 0 8px ${p.color}` }} />
                    <span style={{ color: "#888", fontSize: 12, fontWeight: 500, flex: 1 }}>{p.name}</span>
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 800 }}>
                        {p.name === "Revenue" ? `₹${Number(p.value).toLocaleString("en-IN")}` : p.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

/* ─── KPI Card ──────────────────────────────────────────────────────── */
const KPICard = ({ title, value, sub, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
            position: "relative", overflow: "hidden",
            background: "linear-gradient(145deg, #161616 0%, #0d0d0d 100%)",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 22,
            padding: "26px 24px",
        }}
    >
        {/* Corner glow */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, background: `radial-gradient(circle, ${color}22 0%, transparent 65%)`, pointerEvents: "none" }} />
        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 24, right: 24, height: 1, background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 15, background: `${color}12`, border: `1px solid ${color}22`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 20px ${color}18` }}>
                <Icon size={22} color={color} strokeWidth={1.8} />
            </div>
            {sub && <div style={{ color: "#444", fontSize: 11, fontWeight: 600, letterSpacing: "0.03em" }}>{sub}</div>}
        </div>

        <div style={{ color: "#444", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{title}</div>
        <div style={{ color: "#fff", fontSize: 30, fontWeight: 800, fontFamily: "'Playfair Display', serif", letterSpacing: "-0.03em", lineHeight: 1.1, wordBreak: "break-word" }}>{value}</div>
    </motion.div>
);

/* ─── Section Card ──────────────────────────────────────────────────── */
const Card = ({ title, children, delay = 0, right, style = {} }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
            background: "linear-gradient(145deg, #161616 0%, #0d0d0d 100%)",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 22,
            padding: "28px 28px", ...style,
        }}
    >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h3 style={{ color: "#d4d4d4", fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
            {right && <div style={{ color: "#555" }}>{right}</div>}
        </div>
        {children}
    </motion.div>
);

/* ─── Status Row ────────────────────────────────────────────────────── */
const StatusRow = ({ label, count, color }) => (
    <div style={{ display: "flex", alignItems: "center", padding: "11px 14px", background: `${color}08`, border: `1px solid ${color}15`, borderRadius: 12, marginBottom: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, marginRight: 12, boxShadow: `0 0 8px ${color}` }} />
        <span style={{ color: "#aaa", fontSize: 13, fontWeight: 500, flex: 1 }}>{label}</span>
        <span style={{ color, fontSize: 18, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{count}</span>
    </div>
);

const TICK = { fill: "#444", fontSize: 11, fontWeight: 500 };

/* ─── Donut Pie Chart for Dishes ────────────────────────────────────── */
const DishPieChart = ({ dishes, colors }) => {
    const [hovered, setHovered] = useState(null);
    const total = dishes.reduce((s, d) => s + d.count, 0);
    const centerLabel = hovered ? hovered.name : null;
    const centerValue = hovered ? hovered.count : total;
    const centerSub   = hovered ? "orders" : "Total";
    const centerColor = hovered ? colors[dishes.indexOf(hovered) % 5] : "#fff";

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative", width: "100%", height: 210 }}>
                <ResponsiveContainer width="100%" height={210}>
                    <PieChart>
                        <Pie
                            data={dishes}
                            dataKey="count"
                            nameKey="name"
                            cx="50%" cy="50%"
                            innerRadius={66}
                            outerRadius={92}
                            paddingAngle={3}
                            strokeWidth={0}
                            onMouseEnter={(_, i) => setHovered(dishes[i])}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {dishes.map((d, i) => (
                                <Cell
                                    key={d.name}
                                    fill={colors[i % 5]}
                                    opacity={hovered && hovered !== d ? 0.35 : 1}
                                    style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center label — pure HTML, no Recharts tooltip conflict */}
                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center", pointerEvents: "none", width: 110,
                }}>
                    {centerLabel && (
                        <div style={{ color: "#888", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {centerLabel}
                        </div>
                    )}
                    <div style={{ color: centerColor, fontSize: 26, fontWeight: 800, fontFamily: "'Playfair Display', serif", lineHeight: 1, transition: "color 0.2s" }}>{centerValue}</div>
                    <div style={{ color: "#555", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>{centerSub}</div>
                </div>
            </div>
            {/* Legend */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                {dishes.map((d, i) => {
                    const pct = Math.round((d.count / total) * 100);
                    return (
                        <div key={d.name}
                            onMouseEnter={() => setHovered(d)}
                            onMouseLeave={() => setHovered(null)}
                            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "default", opacity: hovered && hovered !== d ? 0.4 : 1, transition: "opacity 0.2s" }}
                        >
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[i % 5], flexShrink: 0, boxShadow: `0 0 6px ${colors[i % 5]}` }} />
                            <span style={{ color: "#aaa", fontSize: 12, fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                            <span style={{ color: colors[i % 5], fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{d.count} <span style={{ color: "#555", fontWeight: 500 }}>({pct}%)</span></span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────── */
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
        const iv = setInterval(() => load(true), 30000);
        return () => clearInterval(iv);
    }, [load]);

    if (loading) return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "70vh", gap: 16 }}>
            <div style={{ width: 44, height: 44, border: "3px solid rgba(238,124,43,0.08)", borderTopColor: "#ee7c2b", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
            <span style={{ color: "#444", fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase" }}>Loading analytics…</span>
        </div>
    );

    /* derived */
    const totalRes  = data?.upcomingReservations ?? 0;
    const totalOrd  = data?.orderCounts?.reduce((a, b) => a + b, 0) ?? 0;
    const weekRev   = data?.weekRevenue ?? 0;
    const topDish   = data?.popularDishes?.[0]?.name ?? "—";

    const trendData = (data?.labels || []).map((l, i) => ({
        date: l.slice(5),
        Reservations: data.reservationCounts[i],
        Orders: data.orderCounts[i],
        Revenue: data.revenueCounts[i],
    }));

    const dishes     = data?.popularDishes || [];
    const dishMax    = Math.max(...dishes.map(d => d.count), 1);
    const tableB     = data?.tableBreakdown || {};
    const resB       = data?.resBreakdown   || {};

    const COLORS = { dish: ["#ee7c2b","#3b82f6","#10b981","#a78bfa","#f59e0b"] };
    const TABLE_C = { Available: "#10b981", Occupied: "#ef4444", Reserved: "#f59e0b", Disabled: "#6b7280" };
    const RES_C   = { Confirmed: "#10b981", Pending: "#f59e0b", Cancelled: "#ef4444", Completed: "#3b82f6" };
    const timeStr  = lastUpdated?.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) ?? "";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 22, paddingBottom: 48 }}>

            {/* ── Refresh bar ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
                {timeStr && <span style={{ color: "#444", fontSize: 11, letterSpacing: "0.04em" }}>Last updated {timeStr}</span>}
                <button onClick={() => load(true)} disabled={refreshing}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "7px 16px", color: "#666", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.02em" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#aaa"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#666"; }}
                >
                    <RefreshCw size={12} style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }} />
                    Refresh
                </button>
            </div>

            {/* ── KPI Cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
                <KPICard title="Reservations" value={totalRes} sub="Upcoming" icon={Calendar} color="#ee7c2b" delay={0} />
                <KPICard title="Orders (7d)" value={totalOrd} sub="Last 7 days" icon={ShoppingBag} color="#3b82f6" delay={0.07} />
                <KPICard title="Revenue (7d)" value={`₹${weekRev.toLocaleString("en-IN")}`} sub="Excl. Cancelled" icon={IndianRupee} color="#10b981" delay={0.14} />
                <KPICard title="Top Dish" value={topDish} sub="All time" icon={Star} color="#a78bfa" delay={0.21} />
            </div>

            {/* ── Two Charts Side by Side ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

                {/* Revenue Chart */}
                <Card title="Revenue" delay={0.28} right={
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
                        <span style={{ color: "#555", fontSize: 11, fontWeight: 600 }}>Last 7 Days</span>
                    </div>
                }>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={trendData} margin={{ top: 8, right: 0, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="grev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.28} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="2 6" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="date" tick={TICK} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} dx={-6} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(16,185,129,0.12)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                            <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#grev)" dot={false} activeDot={{ r: 5, fill: "#10b981", strokeWidth: 0 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* Orders + Reservations Chart */}
                <Card title="Orders & Reservations" delay={0.35} right={
                    <div style={{ display: "flex", gap: 16 }}>
                        {[["#3b82f6", "Orders"], ["#ee7c2b", "Reservations"]].map(([c, l]) => (
                            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
                                <span style={{ color: "#555", fontSize: 11, fontWeight: 600 }}>{l}</span>
                            </div>
                        ))}
                    </div>
                }>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={trendData} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gord" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gres" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ee7c2b" stopOpacity={0.25} />
                                    <stop offset="100%" stopColor="#ee7c2b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="2 6" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="date" tick={TICK} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} dx={-6} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                            <Area type="monotone" dataKey="Orders"       stroke="#3b82f6" strokeWidth={2.5} fill="url(#gord)" dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                            <Area type="monotone" dataKey="Reservations" stroke="#ee7c2b" strokeWidth={2.5} fill="url(#gres)" dot={{ r: 3, fill: "#ee7c2b", strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
            </div>


            {/* ── Bottom Three Columns ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 18 }}>

                {/* Popular Dishes — Donut Pie Chart */}
                <Card title="Most Popular Dishes" delay={0.35} right={<TrendingUp size={15} />}>
                    {dishes.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "48px 0" }}>
                            <ShoppingBag size={34} color="#2a2a2a" />
                            <div style={{ color: "#444", fontSize: 12, marginTop: 12 }}>No orders recorded yet</div>
                        </div>
                    ) : <DishPieChart dishes={dishes} colors={COLORS.dish} />}
                </Card>

                {/* Table Status */}
                <Card title="Table Status" delay={0.42} right={<LayoutGrid size={15} />}>
                    {Object.entries(TABLE_C).map(([s, c]) => <StatusRow key={s} label={s} count={tableB[s] ?? 0} color={c} />)}
                </Card>

                {/* Reservation Breakdown */}
                <Card title="Reservations" delay={0.49} right={<Calendar size={15} />}>
                    {Object.entries(RES_C).map(([s, c]) => <StatusRow key={s} label={s} count={resB[s] ?? 0} color={c} />)}
                </Card>
            </div>
        </div>
    );
};

export default AdminAnalytics;

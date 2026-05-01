import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
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

            {/* ── Main Trend Chart ── */}
            <Card title="Performance Overview — Last 7 Days" delay={0.28} right={
                <div style={{ display: "flex", gap: 18 }}>
                    {[["#ee7c2b", "Reservations"], ["#3b82f6", "Orders"], ["#10b981", "Revenue"]].map(([c, l]) => (
                        <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
                            <span style={{ color: "#555", fontSize: 11, fontWeight: 600 }}>{l}</span>
                        </div>
                    ))}
                </div>
            }>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={trendData} margin={{ top: 8, right: 0, left: -18, bottom: 0 }}>
                        <defs>
                            {[["res","#ee7c2b"],["ord","#3b82f6"],["rev","#10b981"]].map(([id, c]) => (
                                <linearGradient key={id} id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%"  stopColor={c} stopOpacity={0.2} />
                                    <stop offset="100%" stopColor={c} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="2 6" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="date" tick={TICK} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} dx={-6} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                        <Area type="monotone" dataKey="Revenue"      stroke="#10b981" strokeWidth={2.5} fill="url(#grev)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="Orders"       stroke="#3b82f6" strokeWidth={2.5} fill="url(#gord)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="Reservations" stroke="#ee7c2b" strokeWidth={2.5} fill="url(#gres)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            {/* ── Bottom Three Columns ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 18 }}>

                {/* Popular Dishes */}
                <Card title="Most Popular Dishes" delay={0.35} right={<TrendingUp size={15} />}>
                    {dishes.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "48px 0" }}>
                            <ShoppingBag size={34} color="#2a2a2a" />
                            <div style={{ color: "#444", fontSize: 12, marginTop: 12 }}>No orders recorded yet</div>
                        </div>
                    ) : dishes.map((d, i) => (
                        <div key={d.name} style={{ marginBottom: 18 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <span style={{ color: "#aaa", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "72%" }}>
                                    <span style={{ color: "#555", marginRight: 6 }}>{i + 1}.</span>{d.name}
                                </span>
                                <span style={{ color: COLORS.dish[i % 5], fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{d.count}</span>
                            </div>
                            <div style={{ height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                                <motion.div
                                    initial={{ width: 0 }} animate={{ width: `${(d.count / dishMax) * 100}%` }}
                                    transition={{ delay: 0.5 + i * 0.08, duration: 0.9, ease: "easeOut" }}
                                    style={{ height: "100%", background: `linear-gradient(90deg, ${COLORS.dish[i % 5]}, ${COLORS.dish[i % 5]}aa)`, borderRadius: 4, boxShadow: `0 0 8px ${COLORS.dish[i % 5]}60` }}
                                />
                            </div>
                        </div>
                    ))}
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

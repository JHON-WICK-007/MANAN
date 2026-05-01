import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";
import AdminSelect from "../../../components/AdminSelect";

const API = "http://localhost:5000/api";

const STATUS_COLORS = {
    Pending: "#f59e0b", Processing: "#3b82f6", Delivered: "#10b981", Cancelled: "#ef4444",
};

const StatusBadge = ({ status }) => (
    <span style={{
        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
        background: `${STATUS_COLORS[status] || "#888"}18`,
        color: STATUS_COLORS[status] || "#888",
        border: `1px solid ${STATUS_COLORS[status] || "#888"}30`,
    }}>{status}</span>
);

const AdminOrders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    const load = () => {
        fetch(`${API}/admin/orders`, { headers })
            .then(r => r.json()).then(d => { setOrders(d.data || []); setLoading(false); });
    };

    useEffect(() => { load(); }, []);

    const updateStatus = async (id, status) => {
        await fetch(`${API}/admin/orders/${id}`, { method: "PUT", headers, body: JSON.stringify({ status }) });
        load();
    };

    const filtered = orders.filter(o =>
        (!search ||
            o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
            o.user?.name?.toLowerCase().includes(search.toLowerCase())
        ) && (!statusFilter || o.status === statusFilter)
    );

    return (
        <div>
            {/* Search + Filter Bar */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <div className="admin-search-container">
                    <input
                        className="admin-search-input"
                        placeholder="Search by Order ID or customer…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <Search size={15} className="admin-search-icon" />
                </div>
                <AdminSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="All Statuses"
                    options={[
                        { value: "", label: "All Statuses" },
                        { value: "Pending", label: "Pending" },
                        { value: "Processing", label: "Processing" },
                        { value: "Delivered", label: "Delivered" },
                        { value: "Cancelled", label: "Cancelled" },
                    ]}
                />
            </div>
            <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, overflow: "hidden",
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <colgroup>
                        <col style={{ width: "160px" }} /> {/* Order ID */}
                        <col style={{ width: "140px" }} /> {/* Customer */}
                        <col style={{ width: "80px" }} />  {/* Items */}
                        <col style={{ width: "90px" }} />  {/* Total */}
                        <col style={{ width: "110px" }} /> {/* Status */}
                        <col style={{ width: "160px" }} /> {/* Time */}
                        <col style={{ width: "160px" }} /> {/* Change Status */}
                    </colgroup>
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                            {["Order ID", "Customer", "Items", "Total", "Status", "Time", "Change Status"].map((h, index) => (
                                <th key={h} style={{ padding: "14px 12px", paddingLeft: index === 0 ? 32 : 12, textAlign: "left", color: "#555", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#555" }}>Loading…</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={7}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, minHeight: 280 }}>
                                    <ShoppingBag size={40} color="#555" />
                                    <span style={{ color: "#ee7c2b", fontSize: 16, fontWeight: 500, opacity: 0.7 }}>
                                        {orders.length === 0 ? "No orders found" : "No orders match your filters."}
                                    </span>
                                </div>
                            </td></tr>
                        ) : filtered.map((o, i) => (
                            <motion.tr key={o._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                <td style={{ padding: "14px 12px", paddingLeft: 32, overflow: "hidden" }}>
                                    <span style={{ display: "block", color: "#ee7c2b", fontSize: 11, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={o.orderId}>{o.orderId}</span>
                                </td>
                                <td style={{ padding: "14px 12px", color: "#e0e0e0", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.user?.name || "—"}</td>
                                <td style={{ padding: "14px 12px", color: "#888", fontSize: 13, whiteSpace: "nowrap" }}>{o.items?.length} item{o.items?.length !== 1 ? "s" : ""}</td>
                                <td style={{ padding: "14px 12px", color: "#10b981", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>₹{o.totalAmount}</td>
                                <td style={{ padding: "14px 12px" }}><StatusBadge status={o.status} /></td>
                                <td style={{ padding: "14px 12px", color: "#555", fontSize: 12, whiteSpace: "nowrap" }}>
                                    {new Date(o.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </td>
                                <td style={{ padding: "14px 12px" }}>
                                    <AdminSelect
                                        value={o.status}
                                        onChange={val => updateStatus(o._id, val)}
                                        options={["Pending", "Processing", "Delivered", "Cancelled"]}
                                    />
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AdminOrders;

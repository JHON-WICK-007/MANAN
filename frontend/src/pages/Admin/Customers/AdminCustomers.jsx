import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import { User, Users, Search } from "lucide-react";

const API = "http://localhost:5000/api";

const AdminCustomers = () => {
    const { token } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch(`${API}/admin/customers`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json()).then(d => { setCustomers(d.data || []); setLoading(false); });
    }, [token]);

    const filtered = customers.filter(c =>
        !search || c.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Search Bar */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <div className="admin-search-container">
                    <input
                        className="admin-search-input"
                        placeholder="Search by name…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <Search size={15} className="admin-search-icon" />
                </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <colgroup>
                        <col style={{ width: "200px" }} /> {/* Customer */}
                        <col style={{ width: "220px" }} /> {/* Email */}
                        <col style={{ width: "140px" }} /> {/* Phone */}
                        <col style={{ width: "120px" }} /> {/* Reservations */}
                        <col style={{ width: "100px" }} /> {/* Orders */}
                        <col style={{ width: "130px" }} /> {/* Joined */}
                    </colgroup>
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                            {["Customer", "Email", "Phone", "Reservations", "Orders", "Joined"].map(h => (
                                <th key={h} style={{ padding: "14px 12px", textAlign: "left", verticalAlign: "middle", color: "#555", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#555" }}>Loading…</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, minHeight: 280 }}>
                                    <Users size={40} color="#555" />
                                    <span style={{ color: "#ee7c2b", fontSize: 16, fontWeight: 500, opacity: 0.7 }}>
                                        {customers.length === 0 ? "No customers found" : "No customers match your search."}
                                    </span>
                                </div>
                            </td></tr>
                        ) : filtered.map((c, i) => (
                            <motion.tr key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}
                                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                <td style={{ padding: "14px 12px", overflow: "hidden" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{
                                            width: 34, height: 34, borderRadius: "50%",
                                            background: "linear-gradient(135deg,#ee7c2b,#d46a1f)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            flexShrink: 0, overflow: "hidden",
                                            boxShadow: "0 2px 8px rgba(238,124,43,0.3)",
                                            fontSize: 13, fontWeight: 700, color: "#fff",
                                        }}>
                                            {c.profileImage ? (
                                                <img
                                                    src={c.profileImage}
                                                    alt={c.name}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    onError={e => {
                                                        e.currentTarget.style.display = "none";
                                                        e.currentTarget.parentElement.innerText = c.name?.[0]?.toUpperCase() || "U";
                                                    }}
                                                />
                                            ) : (
                                                c.name?.[0]?.toUpperCase() || "U"
                                            )}
                                        </div>
                                        <span style={{ color: "#e0e0e0", fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: "14px 12px", color: "#888", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</td>
                                <td style={{ padding: "14px 12px", color: "#888", fontSize: 13, whiteSpace: "nowrap" }}>{c.phone || "—"}</td>
                                <td style={{ padding: "14px 12px" }}>
                                    <span style={{ background: "rgba(238,124,43,0.12)", color: "#ee7c2b", border: "1px solid rgba(238,124,43,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>{c.reservationCount}</span>
                                </td>
                                <td style={{ padding: "14px 12px" }}>
                                    <span style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>{c.orderCount}</span>
                                </td>
                                <td style={{ padding: "14px 12px", color: "#555", fontSize: 12, whiteSpace: "nowrap" }}>
                                    {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCustomers;

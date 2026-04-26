import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Check, X, Search, Filter, CalendarX } from "lucide-react";
import AdminSelect from "../../../components/AdminSelect";
import ConfirmModal from "../../../components/ConfirmModal";
import AdminDatePicker from "../../../components/AdminDatePicker";

const API = "http://localhost:5000/api";

const statusColors = {
    Pending: "#f59e0b", Confirmed: "#10b981", Cancelled: "#ef4444", Completed: "#888",
};

const StatusBadge = ({ status }) => (
    <span style={{
        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
        background: `${statusColors[status] || "#888"}18`,
        color: statusColors[status] || "#888",
        border: `1px solid ${statusColors[status] || "#888"}30`,
    }}>{status}</span>
);

const glassCard = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    overflow: "hidden",
};

const inputStyle = {
    background: "rgba(34,24,16,0.85)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#d6d3d1",
    padding: "10px 14px",
    fontSize: 13,
    outline: "none",
    width: "100%",
};

const selectStyle = {
    background: "rgba(34,24,16,0.85)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#d6d3d1",
    padding: "10px 14px",
    fontSize: 13,
    outline: "none",
    colorScheme: "dark",
    cursor: "pointer",
    fontWeight: 500,
    width: "100%",
};

const Modal = ({ title, onClose, children }) => (
    <div style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
        <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            onClick={e => e.stopPropagation()}
            style={{
                background: "#141414", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20, padding: 32, width: "100%", maxWidth: 480, color: "#fff",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h2>
                <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={18} /></button>
            </div>
            {children}
        </motion.div>
    </div>
);

const AdminReservations = () => {
    const { token } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    const load = () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (statusFilter) params.set("status", statusFilter);
        if (dateFilter) params.set("date", dateFilter);
        fetch(`${API}/admin/reservations?${params}`, { headers })
            .then(r => r.json()).then(d => { setReservations(d.data || []); setLoading(false); });
    };

    useEffect(() => { load(); }, [search, statusFilter, dateFilter]);

    const updateStatus = async (id, status) => {
        await fetch(`${API}/admin/reservations/${id}`, { method: "PUT", headers, body: JSON.stringify({ status }) });
        load();
    };

    const deleteRes = (id) => {
        setConfirmDeleteId(id);
    };

    const executeDelete = async () => {
        if (!confirmDeleteId) return;
        await fetch(`${API}/admin/reservations/${confirmDeleteId}`, { method: "DELETE", headers });
        setConfirmDeleteId(null);
        load();
    };

    const saveEdit = async () => {
        await fetch(`${API}/admin/reservations/${editTarget._id}`, { method: "PUT", headers, body: JSON.stringify(editForm) });
        setEditTarget(null);
        load();
    };

    return (
        <div>
            {/* Filters */}
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
                <AdminSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="All Statuses"
                    options={[
                        { value: "", label: "All Statuses" },
                        { value: "Pending", label: "Pending" },
                        { value: "Confirmed", label: "Confirmed" },
                        { value: "Completed", label: "Completed" },
                        { value: "Cancelled", label: "Cancelled" },
                    ]}
                    style={{}}
                />
                <AdminDatePicker
                    value={dateFilter}
                    onChange={setDateFilter}
                    placeholder="DD-MM-YYYY"
                    style={{}}
                />
            </div>

            {/* Table */}
            <div style={glassCard}>
                <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <colgroup>
                        <col style={{ width: "160px" }} /> {/* Booking ID */}
                        <col style={{ width: "140px" }} /> {/* Customer */}
                        <col style={{ width: "70px" }} />  {/* Guests */}
                        <col style={{ width: "90px" }} />  {/* Table */}
                        <col style={{ width: "110px" }} /> {/* Date */}
                        <col style={{ width: "80px" }} />  {/* Time */}
                        <col style={{ width: "110px" }} /> {/* Status */}
                        <col style={{ width: "120px" }} /> {/* Actions */}
                    </colgroup>
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                            {["Booking ID", "Customer", "Guests", "Table", "Date", "Time", "Status", "Actions"].map(h => (
                                <th key={h} style={{ padding: "14px 12px", textAlign: "left", color: "#555", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#555" }}>Loading…</td></tr>
                        ) : reservations.length === 0 ? (
                            <tr><td colSpan={8}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, minHeight: 280 }}>
                                    <CalendarX size={40} color="#555" />
                                    <span style={{ color: "#ee7c2b", fontSize: 16, fontWeight: 500, opacity: 0.7 }}>No reservations found</span>
                                </div>
                            </td></tr>
                        ) : reservations.map(r => {
                            // Format date YYYY-MM-DD → DD-MM-YYYY
                            const fmtDate = r.date ? r.date.split("-").reverse().join("-") : "—";
                            return (
                                <tr key={r._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                    {/* Booking ID — truncated */}
                                    <td style={{ padding: "14px 12px", overflow: "hidden" }}>
                                        <span style={{ display: "block", color: "#ee7c2b", fontSize: 11, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.bookingId}>
                                            {r.bookingId}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 12px", color: "#e0e0e0", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.userName}</td>
                                    <td style={{ padding: "14px 12px", color: "#888", fontSize: 13 }}>{r.guests}</td>
                                    <td style={{ padding: "14px 12px", color: "#888", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.table || "—"}</td>
                                    <td style={{ padding: "14px 12px", color: "#888", fontSize: 13, whiteSpace: "nowrap" }}>{fmtDate}</td>
                                    <td style={{ padding: "14px 12px", color: "#888", fontSize: 13, whiteSpace: "nowrap" }}>{r.time}</td>
                                    <td style={{ padding: "14px 12px" }}><StatusBadge status={r.status} /></td>
                                    {/* Actions cell — buttons always start from left */}
                                    <td style={{ padding: "14px 12px" }}>
                                        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                                            {r.status === "Pending" && (
                                                <button onClick={() => updateStatus(r._id, "Confirmed")} title="Confirm"
                                                    style={{ width: 28, height: 28, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <Check size={12} />
                                                </button>
                                            )}
                                            {r.status !== "Cancelled" && (
                                                <button onClick={() => updateStatus(r._id, "Cancelled")} title="Cancel"
                                                    style={{ width: 28, height: 28, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <X size={12} />
                                                </button>
                                            )}
                                            <button onClick={() => { setEditTarget(r); setEditForm({ userName: r.userName, guests: r.guests, table: r.table, date: r.date, time: r.time }); }} title="Edit"
                                                style={{ width: 28, height: 28, background: "rgba(238,124,43,0.12)", border: "1px solid rgba(238,124,43,0.2)", color: "#ee7c2b", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <Pencil size={12} />
                                            </button>
                                            <button onClick={() => deleteRes(r._id)} title="Delete"
                                                style={{ width: 28, height: 28, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editTarget && (
                    <Modal title="Edit Reservation" onClose={() => setEditTarget(null)}>
                        {[["Name", "userName", "text"], ["Guests", "guests", "number"], ["Table", "table", "text"]].map(([label, key, type]) => (
                            <div key={key} style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 6 }}>{label}</label>
                                <input type={type} value={editForm[key] || ""} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                                    style={{ ...inputStyle, colorScheme: "dark" }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 6 }}>Date</label>
                            <AdminDatePicker value={editForm.date || ""} onChange={v => setEditForm(f => ({ ...f, date: v }))} placeholder="Select date" style={{ width: "100%" }} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 6 }}>Time</label>
                            <input type="time" value={editForm.time || ""} onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))}
                                style={{ ...inputStyle, colorScheme: "dark" }} />
                        </div>
                        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                            <button onClick={() => setEditTarget(null)} style={{ padding: "10px 20px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#888", cursor: "pointer" }}>Cancel</button>
                            <button onClick={saveEdit} style={{ padding: "10px 20px", borderRadius: 8, background: "linear-gradient(135deg,#ee7c2b,#d46a1f)", border: "none", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Save</button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                open={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={executeDelete}
                title="Delete Reservation"
                message="Are you sure you want to delete this reservation? This action is permanent and cannot be undone."
                confirmLabel="Delete Reservation"
            />
        </div>
    );
};

export default AdminReservations;

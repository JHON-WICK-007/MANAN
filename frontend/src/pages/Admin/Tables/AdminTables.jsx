import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, LayoutGrid, Users, Search } from "lucide-react";
import AdminSelect from "../../../components/AdminSelect";
import ConfirmModal from "../../../components/ConfirmModal";

const API = "http://localhost:5000/api";

const STATUS_COLORS = {
    Available: "#10b981", Occupied: "#ef4444", Reserved: "#f59e0b", Disabled: "#ef4444",
};

const STATUS_BG = {
    Available: "linear-gradient(160deg, #0f1f18, #0a1410)",
    Occupied: "linear-gradient(160deg, #1f0f0f, #140a0a)",
    Reserved: "linear-gradient(160deg, #1f1a0a, #14110a)",
    Disabled: "linear-gradient(160deg, #1f0f0f, #140a0a)",
};

const TYPES = ["Window", "Private", "Terrace", "Kitchen", "Center", "Outdoor"];
const STATUSES = ["Available", "Occupied", "Reserved", "Disabled"];

const inputStyle = {
    background: "#000000",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    color: "#d6d3d1",
    padding: "11px 14px",
    fontSize: 14,
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
};

const Modal = ({ title, onClose, children }) => (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            onClick={e => e.stopPropagation()}
            style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 460, color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, fontFamily: "'Playfair Display', serif", textTransform: "uppercase", color: "#ee7c2b", letterSpacing: "0.05em" }}>{title}</h2>
                <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={18} /></button>
            </div>
            {children}
        </motion.div>
    </div>
);

const emptyForm = { tableId: "", capacity: 2, type: "Center", status: "Available" };

const AdminTables = () => {
    const { token } = useAuth();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | 'add' | 'edit'
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [capacityFilter, setCapacityFilter] = useState("");

    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    const load = () => {
        fetch(`${API}/admin/tables`, { headers })
            .then(r => r.json()).then(d => { setTables(d.data || []); setLoading(false); });
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(emptyForm); setModal("add"); };
    const openEdit = (t) => { setForm({ tableId: t.tableId, capacity: t.capacity, type: t.type, status: t.status }); setEditId(t._id); setModal("edit"); };

    const save = async () => {
        if (modal === "add") {
            await fetch(`${API}/admin/tables`, { method: "POST", headers, body: JSON.stringify(form) });
        } else {
            await fetch(`${API}/admin/tables/${editId}`, { method: "PUT", headers, body: JSON.stringify(form) });
        }
        setModal(null); load();
    };

    const del = (id) => {
        setConfirmDeleteId(id);
    };

    const executeDelete = async () => {
        if (!confirmDeleteId) return;
        await fetch(`${API}/admin/tables/${confirmDeleteId}`, { method: "DELETE", headers });
        setConfirmDeleteId(null);
        load();
    };

    const toggleStatus = async (t) => {
        const next = t.status === "Disabled" ? "Available" : "Disabled";
        await fetch(`${API}/admin/tables/${t._id}`, { method: "PUT", headers, body: JSON.stringify({ status: next }) });
        load();
    };

    const filtered = tables.filter(t => {
        const q = search.toLowerCase();
        const matchSearch = !q || t.tableId?.toLowerCase().includes(q);
        const matchStatus = !statusFilter || t.status === statusFilter;
        const matchType = !typeFilter || t.type === typeFilter;
        const matchCapacity = !capacityFilter || (
            capacityFilter === "10" ? t.capacity >= 10 : String(t.capacity) === capacityFilter
        );
        return matchSearch && matchStatus && matchType && matchCapacity;
    });

    return (
        <div>
            {/* Top Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                {/* Left: Search + Filters */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div className="admin-search-container" style={{ width: 400, maxWidth: "100%", flex: "none" }}>
                        <input
                            className="admin-search-input"
                            placeholder="Search by table ID or name…"
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
                            { value: "Available", label: "Available" },
                            { value: "Occupied", label: "Occupied" },
                            { value: "Reserved", label: "Reserved" },
                            { value: "Disabled", label: "Disabled" },
                        ]}
                        bg="rgba(255,255,255,0.05)"
                        panelBg="rgba(15,15,15,0.98)"
                    />
                    <AdminSelect
                        value={typeFilter}
                        onChange={setTypeFilter}
                        placeholder="All Types"
                        options={[
                            { value: "", label: "All Types" },
                            ...TYPES.map(t => ({ value: t, label: t }))
                        ]}
                        bg="rgba(255,255,255,0.05)"
                        panelBg="rgba(15,15,15,0.98)"
                    />
                    <AdminSelect
                        value={capacityFilter}
                        onChange={setCapacityFilter}
                        placeholder="Any Guests"
                        options={[
                            { value: "", label: "Any Guests" },
                            { value: "2", label: "2 Guests" },
                            { value: "4", label: "4 Guests" },
                            { value: "6", label: "6 Guests" },
                            { value: "8", label: "8 Guests" },
                            { value: "10", label: "10+ Guests" },
                        ]}
                        bg="rgba(255,255,255,0.05)"
                        panelBg="rgba(15,15,15,0.98)"
                    />
                </div>
                {/* Right: Add Table */}
                <button onClick={openAdd} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", width: 120, height: 40,
                    background: "#ee7c2b", border: "none",
                    borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(238,124,43,0.35)", flexShrink: 0, transition: "all 0.2s",
                }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(238,124,43,0.45)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(238,124,43,0.35)"; }}
                >
                    Add Table
                </button>
            </div>
            {loading ? (
                <div style={{ textAlign: "center", padding: 60, color: "#555" }}>Loading…</div>
            ) : filtered.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, height: "calc(100vh - 320px)" }}>
                    <LayoutGrid size={60} color="#444" />
                    <span style={{ color: "#ee7c2b", fontSize: 16, fontWeight: 500, opacity: 0.7 }}>{tables.length === 0 ? "No tables yet. Add one!" : "No tables match your filters."}</span>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
                    {filtered.map((t, i) => (
                            <motion.div key={t._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                style={{
                                    background: STATUS_BG[t.status] || "linear-gradient(160deg, #1a1a1a, #111)",
                                    border: `1px solid ${STATUS_COLORS[t.status]}30`,
                                    borderRadius: 18, overflow: "hidden", position: "relative",
                                    opacity: t.status === "Disabled" ? 0.5 : 1,
                                    boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${STATUS_COLORS[t.status]}10`,
                                }}>
                                {/* Top accent bar */}
                                <div style={{ height: 4, background: `linear-gradient(90deg, ${STATUS_COLORS[t.status]}, ${STATUS_COLORS[t.status]}55)` }} />
                                <div style={{ padding: "20px 20px 18px" }}>
                                    {/* Header */}
                                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                                        <div>
                                            <div style={{ color: "#ee7c2b", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>{t.tableId}</div>
                                            <div style={{ color: "#555", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{t.type} Table</div>
                                        </div>
                                        <div style={{ padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${STATUS_COLORS[t.status]}18`, color: STATUS_COLORS[t.status], border: `1px solid ${STATUS_COLORS[t.status]}35`, letterSpacing: "0.05em", textTransform: "uppercase", boxShadow: `0 0 10px ${STATUS_COLORS[t.status]}20` }}>{t.status}</div>
                                    </div>
                                    {/* Capacity */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                                        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${STATUS_COLORS[t.status]}18`, border: `1px solid ${STATUS_COLORS[t.status]}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Users size={14} color={STATUS_COLORS[t.status]} />
                                        </div>
                                        <span style={{ color: "#bbb", fontSize: 13, fontWeight: 600 }}>{t.capacity} Guests</span>
                                    </div>
                                    <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 14 }} />
                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button onClick={() => openEdit(t)}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(238,124,43,0.2)"; e.currentTarget.style.borderColor = "rgba(238,124,43,0.4)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(238,124,43,0.1)"; e.currentTarget.style.borderColor = "rgba(238,124,43,0.2)"; }}
                                            style={{ flex: 1, padding: "8px 0", borderRadius: 10, background: "rgba(238,124,43,0.1)", border: "1px solid rgba(238,124,43,0.2)", color: "#ee7c2b", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.2s" }}>
                                            <Pencil size={12} /> Edit
                                        </button>
                                        <button onClick={() => toggleStatus(t)}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#aaa"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#666"; }}
                                            style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#666", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {t.status === "Disabled" ? <ToggleLeft size={15} /> : <ToggleRight size={15} />}
                                        </button>
                                        <button onClick={() => del(t._id)}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.07)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.12)"; }}
                                            style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.12)", color: "#ef4444", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                    ))}
                </div>
            )}


            <AnimatePresence>
                {modal && (
                    <Modal title={modal === "add" ? "Add Table" : "Edit Table"} onClose={() => setModal(null)}>
                        {/* Table ID */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>Table ID <span style={{ color: "#888" }}>*</span></label>
                            <input type="text" value={form.tableId} onChange={e => setForm(f => ({ ...f, tableId: e.target.value }))} placeholder="e.g. T-01" style={inputStyle}
                                onFocus={e => e.target.style.borderColor = "rgba(238,124,43,0.5)"}
                                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
                        </div>

                        {/* Capacity */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>Capacity (Guests) <span style={{ color: "#888" }}>*</span></label>
                            <input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="e.g. 4" style={inputStyle}
                                onFocus={e => e.target.style.borderColor = "rgba(238,124,43,0.5)"}
                                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
                        </div>

                        {/* Type */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>Type</label>
                            <AdminSelect
                                value={form.type}
                                onChange={val => setForm(f => ({ ...f, type: val }))}
                                options={TYPES}
                                bg="#000000"
                                panelBg="#000000"
                            />
                        </div>

                        {/* Status */}
                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>Status</label>
                            <AdminSelect
                                value={form.status}
                                onChange={val => setForm(f => ({ ...f, status: val }))}
                                options={STATUSES}
                                bg="#000000"
                                panelBg="#000000"
                            />
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                            <button onClick={() => setModal(null)} style={{ padding: "10px 22px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#888", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                            <button onClick={save} style={{ padding: "10px 22px", borderRadius: 10, background: "linear-gradient(135deg,#ee7c2b,#d46a1f)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(238,124,43,0.35)" }}>Save</button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                open={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={executeDelete}
                title="Delete Table"
                message="Are you sure you want to delete this table? This action is permanent and cannot be undone."
                confirmLabel="Delete Table"
            />
        </div>
    );
};

export default AdminTables;

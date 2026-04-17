import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, LayoutGrid } from "lucide-react";
import AdminSelect from "../../../components/AdminSelect";
import ConfirmModal from "../../../components/ConfirmModal";

const API = "http://localhost:5000/api";

const STATUS_COLORS = {
    Available: "#10b981", Occupied: "#ef4444", Reserved: "#f59e0b", Disabled: "#555",
};

const TYPES = ["Window", "Private", "Terrace", "Kitchen", "Center", "Outdoor"];
const STATUSES = ["Available", "Occupied", "Reserved", "Disabled"];

const inputStyle = {
    background: "rgba(34,24,16,0.85)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#d6d3d1", padding: "9px 13px", fontSize: 13, outline: "none", width: "100%",
};

const selectStyle = {
    background: "rgba(34,24,16,0.85)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#d6d3d1", padding: "9px 13px", fontSize: 13, outline: "none",
    width: "100%", colorScheme: "dark", cursor: "pointer", fontWeight: 500,
};

const Modal = ({ title, onClose, children }) => (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.93 }}
            onClick={e => e.stopPropagation()}
            style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 460, color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, textTransform: "uppercase", color: "#ee7c2b", letterSpacing: "0.05em" }}>{title}</h2>
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

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
                <button onClick={openAdd} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", width: 120, height: 40,
                    background: "#ee7c2b", border: "none",
                    borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(238,124,43,0.35)", flexShrink: 0,
                    transition: "all 0.2s",
                }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(238,124,43,0.45)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(238,124,43,0.35)"; }}
                >
                    Add Table
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: 60, color: "#555" }}>Loading…</div>
            ) : tables.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, height: "calc(100vh - 220px)" }}>
                    <LayoutGrid size={60} color="#444" />
                    <span style={{ color: "#ee7c2b", fontSize: 16, fontWeight: 500, opacity: 0.7 }}>No tables yet. Add one!</span>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
                    {tables.map((t, i) => (
                        <motion.div key={t._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                                border: `1px solid ${STATUS_COLORS[t.status]}25`,
                                borderRadius: 16, padding: 22, position: "relative",
                                opacity: t.status === "Disabled" ? 0.5 : 1,
                            }}>
                            {/* Status dot */}
                            <div style={{ position: "absolute", top: 16, right: 16, width: 9, height: 9, borderRadius: "50%", background: STATUS_COLORS[t.status] || "#888", boxShadow: `0 0 8px ${STATUS_COLORS[t.status]}80` }} />

                            <div style={{ color: "#ee7c2b", fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 4 }}>{t.tableId}</div>
                            <div style={{ color: "#888", fontSize: 13, marginBottom: 2 }}>{t.capacity} Guests · {t.type}</div>
                            <div style={{ display: "inline-block", marginTop: 8, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${STATUS_COLORS[t.status]}18`, color: STATUS_COLORS[t.status], border: `1px solid ${STATUS_COLORS[t.status]}30` }}>{t.status}</div>

                            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                                <button onClick={() => openEdit(t)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, background: "rgba(238,124,43,0.1)", border: "1px solid rgba(238,124,43,0.2)", color: "#ee7c2b", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                    <Pencil size={12} /> Edit
                                </button>
                                <button onClick={() => toggleStatus(t)} style={{ padding: "7px 10px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#888", cursor: "pointer" }}>
                                    {t.status === "Disabled" ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                                </button>
                                <button onClick={() => del(t._id)} style={{ padding: "7px 10px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", cursor: "pointer" }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}


            <AnimatePresence>
                {modal && (
                    <Modal title={modal === "add" ? "Add Table" : "Edit Table"} onClose={() => setModal(null)}>
                        {[["Table ID", "tableId", "text"], ["Capacity (guests)", "capacity", "number"]].map(([label, key, type]) => (
                            <div key={key} style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 6 }}>{label}</label>
                                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 6 }}>Type</label>
                            <AdminSelect
                                value={form.type}
                                onChange={val => setForm(f => ({ ...f, type: val }))}
                                options={TYPES}
                            />
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 6 }}>Status</label>
                            <AdminSelect
                                value={form.status}
                                onChange={val => setForm(f => ({ ...f, status: val }))}
                                options={STATUSES}
                            />
                        </div>
                        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                            <button onClick={() => setModal(null)} style={{ padding: "10px 20px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#888", cursor: "pointer" }}>Cancel</button>
                            <button onClick={save} style={{ padding: "10px 20px", borderRadius: 8, background: "linear-gradient(135deg,#ee7c2b,#d46a1f)", border: "none", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Save</button>
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

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { MailOpen, Trash2, MailCheck, X, MailX } from "lucide-react";
import ConfirmModal from "../../../components/ConfirmModal";

const Modal = ({ title, onClose, children }) => (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.93 }}
            onClick={e => e.stopPropagation()}
            style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 460, color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h2>
                <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={18} /></button>
            </div>
            {children}
        </motion.div>
    </div>
);

const API = "http://localhost:5000/api";

const AdminMessages = () => {
    const { token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    const load = () => {
        fetch(`${API}/admin/messages`, { headers })
            .then(r => r.json()).then(d => { setMessages(d.data || []); setLoading(false); });
    };

    useEffect(() => { load(); }, []);

    const toggleRead = async (msg) => {
        const next = msg.status === "Unread" ? "Read" : "Unread";
        await fetch(`${API}/admin/messages/${msg._id}`, { method: "PUT", headers, body: JSON.stringify({ status: next }) });
        load();
    };

    const del = (id) => {
        setConfirmDeleteId(id);
    };

    const executeDelete = async () => {
        if (!confirmDeleteId) return;
        await fetch(`${API}/admin/messages/${confirmDeleteId}`, { method: "DELETE", headers });
        setConfirmDeleteId(null);
        load();
    };

    const unreadCount = messages.filter(m => m.status === "Unread").length;

    return (
        <div>
            {unreadCount > 0 && (
                <div style={{ marginBottom: 20, padding: "10px 18px", background: "rgba(238,124,43,0.08)", border: "1px solid rgba(238,124,43,0.2)", borderRadius: 10, color: "#ee7c2b", fontSize: 13 }}>
                    📬 You have <strong>{unreadCount}</strong> unread message{unreadCount !== 1 ? "s" : ""}
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: 60, color: "#555" }}>Loading…</div>
                ) : messages.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, height: "calc(100vh - 220px)" }}>
                        <MailX size={60} color="#444" />
                        <span style={{ color: "#ee7c2b", fontSize: 16, fontWeight: 500, opacity: 0.7 }}>No messages yet.</span>
                    </div>
                ) : messages.map((msg, i) => (
                    <motion.div key={msg._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        style={{
                            background: msg.status === "Unread" ? "rgba(238,124,43,0.04)" : "rgba(255,255,255,0.02)",
                            border: msg.status === "Unread" ? "1px solid rgba(238,124,43,0.18)" : "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 14, padding: "20px 24px",
                            display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16,
                        }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{msg.name}</span>
                                <span style={{ color: "#555", fontSize: 12 }}>·</span>
                                <span style={{ color: "#888", fontSize: 12 }}>{msg.email}</span>
                                {msg.status === "Unread" && (
                                    <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "rgba(238,124,43,0.15)", color: "#ee7c2b", border: "1px solid rgba(238,124,43,0.25)" }}>NEW</span>
                                )}
                            </div>
                            <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.55, margin: "0 0 8px" }}>{msg.message}</p>
                            <span style={{ color: "#444", fontSize: 11 }}>{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                            <button onClick={() => toggleRead(msg)} title={msg.status === "Unread" ? "Mark as read" : "Mark as unread"}
                                style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#888", cursor: "pointer", transition: "all 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#ee7c2b"}
                                onMouseLeave={e => e.currentTarget.style.color = "#888"}>
                                {msg.status === "Unread" ? <MailCheck size={15} /> : <MailOpen size={15} />}
                            </button>
                            <button onClick={() => del(msg._id)} title="Delete"
                                style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", cursor: "pointer" }}>
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                open={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={executeDelete}
                title="Delete Message"
                message="Are you sure you want to delete this message? This action is permanent and cannot be undone."
                confirmLabel="Delete Message"
            />
        </div>
    );
};

export default AdminMessages;

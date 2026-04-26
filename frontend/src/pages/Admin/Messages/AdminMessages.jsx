import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { MailOpen, Trash2, MailCheck, X, MailX, Bell } from "lucide-react";
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
            .then(r => r.json()).then(d => {
                const data = d.data || [];
                setMessages(data);
                setLoading(false);
            }).catch(() => { setMessages([]); setLoading(false); });
    };

    useEffect(() => { load(); }, []);

    const markAsRead = async (msg) => {
        if (msg.status === "Read") return;
        await fetch(`${API}/admin/messages/${msg._id}`, { method: "PUT", headers, body: JSON.stringify({ status: "Read" }) });
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
            <div style={{ 
                marginBottom: 24, padding: "14px 20px", 
                background: unreadCount > 0 ? "linear-gradient(90deg, rgba(238,124,43,0.12) 0%, rgba(238,124,43,0.02) 100%)" : "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)", 
                border: unreadCount > 0 ? "1px solid rgba(238,124,43,0.25)" : "1px solid rgba(255,255,255,0.08)", 
                borderLeft: unreadCount > 0 ? "4px solid #ee7c2b" : "4px solid rgba(255,255,255,0.2)",
                borderRadius: 12, color: unreadCount > 0 ? "#ee7c2b" : "#888", fontSize: 14.5,
                display: "flex", alignItems: "center", gap: 12,
                boxShadow: unreadCount > 0 ? "0 4px 20px rgba(238,124,43,0.1)" : "none",
                transition: "all 0.3s ease"
            }}>
                <Bell size={18} style={{ color: unreadCount > 0 ? "#ee7c2b" : "#888", fill: unreadCount > 0 ? "rgba(238,124,43,0.2)" : "transparent", transition: "all 0.3s ease" }} />
                <span style={{ letterSpacing: "0.02em", transition: "color 0.3s ease" }}>
                    You have <strong style={{ fontWeight: 800, color: unreadCount > 0 ? "#fff" : "#ccc", fontSize: 15.5 }}>{unreadCount}</strong> unread message{unreadCount !== 1 ? "s" : ""}
                </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: 60, color: "#555" }}>Loading…</div>
                ) : messages.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, height: "calc(100vh - 220px)" }}>
                        <MailX size={60} color="#444" />
                        <span style={{ color: "#ee7c2b", fontSize: 16, fontWeight: 500, opacity: 0.7 }}>No messages yet.</span>
                    </div>
                ) : messages.map((msg, i) => {
                    const initials = msg.name ? msg.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "U";
                    return (
                        <motion.div key={msg._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            style={{
                                background: msg.status === "Unread" ? "linear-gradient(180deg, rgba(40,25,15,0.4) 0%, rgba(20,15,10,0.6) 100%)" : "rgba(255,255,255,0.02)",
                                border: msg.status === "Unread" ? "1px solid rgba(238,124,43,0.2)" : "1px solid rgba(255,255,255,0.06)",
                                borderRadius: 16, padding: "24px",
                                display: "flex", alignItems: "flex-start", gap: 20,
                            }}>

                            {/* Avatar */}
                            <div style={{
                                width: 56, height: 56, borderRadius: "50%", background: "#ee7c2b", flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "0.05em",
                                boxShadow: "0 4px 14px rgba(238,124,43,0.3)", overflow: "hidden"
                            }}>
                                {msg.profileImage ? (
                                    <img
                                        src={msg.profileImage}
                                        alt={msg.name}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement.innerHTML = initials;
                                        }}
                                    />
                                ) : (
                                    initials
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <h4 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: 0, letterSpacing: "0.02em" }}>{msg.name}</h4>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "4px 0 0 0" }}>{msg.email}</p>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: 8 }}>
                                        {msg.status === "Unread" && (
                                            <button onClick={() => markAsRead(msg)} title="Mark as read"
                                                style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#888", cursor: "pointer", transition: "all 0.2s" }}
                                                onMouseEnter={e => e.currentTarget.style.color = "#ee7c2b"}
                                                onMouseLeave={e => e.currentTarget.style.color = "#888"}>
                                                <MailCheck size={16} />
                                            </button>
                                        )}
                                        <button onClick={() => del(msg._id)} title="Delete"
                                            style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", cursor: "pointer", transition: "all 0.2s" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Star Rating (if provided) */}
                                {msg.rating > 0 && (
                                    <div style={{ color: "#ee7c2b", fontSize: 16, margin: "12px 0 4px", letterSpacing: "2px" }}>
                                        {"★".repeat(msg.rating)}{"☆".repeat(5 - msg.rating)}
                                    </div>
                                )}

                                {/* Message Body */}
                                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14.5, lineHeight: 1.6, margin: "16px 0", fontWeight: 300 }}>
                                    {msg.message}
                                </p>

                                {/* Bottom Badges */}
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
                                    <span style={{
                                        padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)",
                                        fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                                        display: "flex", alignItems: "center", gap: 6
                                    }}>
                                        <span className="material-icons" style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>event</span>
                                        RECEIVED: {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>

                                    {msg.status === "Unread" && (
                                        <span style={{
                                            padding: "6px 12px", borderRadius: 8, background: "rgba(238,124,43,0.12)",
                                            border: "1px solid rgba(238,124,43,0.25)", color: "#ee7c2b",
                                            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                                            display: "flex", alignItems: "center", gap: 6
                                        }}>
                                            <span className="material-icons" style={{ fontSize: 13 }}>mark_email_unread</span>
                                            NEW MESSAGE
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
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

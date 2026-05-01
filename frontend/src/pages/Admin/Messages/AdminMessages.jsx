import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, MailX, Bell, Star, ChevronDown, Mail, MailCheck } from "lucide-react";
import ConfirmModal from "../../../components/ConfirmModal";

const API = "http://localhost:5000/api";

const StarRating = ({ rating }) => (
    <div style={{ display: "flex", gap: 3, margin: "10px 0 4px" }}>
        {[1, 2, 3, 4, 5].map(s => (
            <Star
                key={s}
                size={16}
                style={{
                    color: s <= rating ? "#ee7c2b" : "rgba(255,255,255,0.12)",
                    fill: s <= rating ? "#ee7c2b" : "transparent",
                    transition: "all 0.2s"
                }}
            />
        ))}
    </div>
);

const ExpandableMessage = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = text && text.length > 200;

    return (
        <div>
            <p style={{
                color: "rgba(255,255,255,0.85)", fontSize: 14.5, lineHeight: 1.75,
                margin: 0, fontWeight: 300,
                display: "-webkit-box",
                WebkitLineClamp: expanded ? "unset" : 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                whiteSpace: "pre-wrap"
            }}>
                {text}
            </p>
            {isLong && (
                <button 
                    onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                    style={{ 
                        background: "none", border: "none", color: "#ee7c2b", 
                        padding: 0, marginTop: 6, cursor: "pointer", fontSize: 13, fontWeight: 700,
                        letterSpacing: "0.02em"
                    }}
                >
                    {expanded ? "Show less" : "Read more"}
                </button>
            )}
        </div>
    );
};


const AdminMessages = () => {
    const { token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [openId, setOpenId] = useState(null); // which card is expanded

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

    const toggleOpen = (msg) => {
        const isOpening = openId !== msg._id;
        setOpenId(isOpening ? msg._id : null);

        // Auto mark-as-read when opening an unread message
        if (isOpening && msg.status === "Unread") {
            setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, status: "Read" } : m));
            fetch(`${API}/admin/messages/${msg._id}`, {
                method: "PUT", headers, body: JSON.stringify({ status: "Read" })
            }).catch(() => load());
        }
    };

    const del = (id, e) => {
        e.stopPropagation();
        setConfirmDeleteId(id);
    };

    const executeDelete = () => {
        if (!confirmDeleteId) return;
        setMessages(prev => prev.filter(m => m._id !== confirmDeleteId));
        if (openId === confirmDeleteId) setOpenId(null);
        setConfirmDeleteId(null);
        fetch(`${API}/admin/messages/${confirmDeleteId}`, { method: "DELETE", headers })
            .catch(() => load());
    };

    const unreadCount = messages.filter(m => m.status === "Unread").length;

    return (
        <div>
            {/* Unread Banner */}
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

            {/* Message List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: 60, color: "#555" }}>Loading…</div>
                ) : messages.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, height: "calc(100vh - 220px)" }}>
                        <MailX size={60} color="#444" />
                        <span style={{ color: "#ee7c2b", fontSize: 16, fontWeight: 500, opacity: 0.7 }}>No messages yet.</span>
                    </div>
                ) : messages.map((msg, i) => {
                    const initials = msg.name ? msg.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "U";
                    const isOpen = openId === msg._id;
                    const isUnread = msg.status === "Unread";

                    return (
                        <motion.div
                            key={msg._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            style={{
                                background: isUnread ? "linear-gradient(180deg, rgba(40,25,15,0.4) 0%, rgba(20,15,10,0.6) 100%)" : "rgba(255,255,255,0.02)",
                                border: isUnread ? "1px solid rgba(238,124,43,0.2)" : "1px solid rgba(255,255,255,0.06)",
                                borderRadius: 16,
                                overflow: "hidden",
                                transition: "background 0.2s, border 0.2s",
                            }}
                        >
                            {/* Header row — always visible, click to toggle */}
                            <div
                                onClick={() => toggleOpen(msg)}
                                style={{
                                    padding: "18px 20px",
                                    display: "flex", alignItems: "center", gap: 16,
                                    cursor: "pointer",
                                    userSelect: "none",
                                }}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%", background: "#ee7c2b", flexShrink: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontSize: 17, fontWeight: 700,
                                    boxShadow: "0 4px 12px rgba(238,124,43,0.35)", overflow: "hidden"
                                }}>
                                    {msg.profileImage ? (
                                        <img src={msg.profileImage} alt={msg.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.innerHTML = initials; }}
                                        />
                                    ) : initials}
                                </div>

                                {/* Name + Email ONLY (No message preview here) */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                        <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>{msg.name}</span>
                                        {isUnread && (
                                            <span style={{
                                                padding: "2px 8px", borderRadius: 20,
                                                background: "rgba(238,124,43,0.15)", border: "1px solid rgba(238,124,43,0.3)",
                                                color: "#ee7c2b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em"
                                            }}>New</span>
                                        )}
                                    </div>
                                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 4 }}>{msg.email}</div>
                                </div>

                                {/* Right side: date + actions (always static) */}
                                <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, whiteSpace: "nowrap" }}>
                                        {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </span>

                                    <button
                                        onClick={e => del(msg._id, e)}
                                        title="Delete"
                                        style={{ padding: "7px 9px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", cursor: "pointer", transition: "all 0.2s", flexShrink: 0, display: "flex" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div style={{ color: "rgba(255,255,255,0.3)", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display: "flex" }}>
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded body */}
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        key="body"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        <div style={{ padding: "0 20px 22px 84px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                            {/* Star Rating */}
                                            {msg.rating > 0 && (
                                                <div style={{ paddingTop: 14, paddingBottom: 6 }}>
                                                    <StarRating rating={msg.rating} />
                                                </div>
                                            )}

                                            {/* Message body */}
                                            <div style={{ marginTop: msg.rating > 0 ? 4 : 14 }}>
                                                <ExpandableMessage text={msg.message} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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

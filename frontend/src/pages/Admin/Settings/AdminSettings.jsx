import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import { Save, Check } from "lucide-react";

const API = "http://localhost:5000/api";

const inputStyle = {
    background: "#111",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    color: "#fff",
    padding: "14px 16px",
    fontSize: 14,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.25s ease",
    fontFamily: "inherit",
};

const labelStyle = {
    display: "block",
    color: "#888",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 8,
};

const FIELDS = [
    { key: "name",         label: "Restaurant Name",  type: "text" },
    { key: "address",      label: "Address",           type: "text" },
    { key: "phone",        label: "Phone Number",      type: "text" },
    { key: "email",        label: "Email Address",     type: "email" },
    { key: "openingHours", label: "Opening Hours",     type: "text" },
];

const AdminSettings = () => {
    const { token } = useAuth();
    const [form, setForm] = useState({ name: "", address: "", phone: "", email: "", openingHours: "" });
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    useEffect(() => {
        fetch(`${API}/admin/settings`, { headers })
            .then(r => r.json()).then(d => { setForm(d.data || {}); setLoading(false); });
    }, [token]);

    const save = async () => {
        await fetch(`${API}/admin/settings`, { method: "PUT", headers, body: JSON.stringify(form) });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ maxWidth: 640 }}
        >
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h2 style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 800,
                    fontFamily: "'Playfair Display', serif",
                    textTransform: "uppercase",
                    color: "#ee7c2b",
                    letterSpacing: "0.05em",
                    marginBottom: 6,
                }}>
                    Restaurant Settings
                </h2>
                <p style={{ color: "#555", fontSize: 13, margin: 0 }}>
                    Manage your restaurant's public-facing information.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: 40, color: "#555" }}>Loading…</div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                    {FIELDS.map(({ key, label, type }) => (
                        <div key={key}>
                            <label style={labelStyle}>{label}</label>
                            <input
                                type={type}
                                value={form[key] || ""}
                                placeholder={label}
                                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = "rgba(238,124,43,0.6)"}
                                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                            />
                        </div>
                    ))}

                    <div style={{ marginTop: 16 }}>
                        <button
                            onClick={save}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 10,
                                padding: "14px 36px",
                                background: saved
                                    ? "linear-gradient(135deg, #10b981, #059669)"
                                    : "linear-gradient(135deg, #ee7c2b, #c55e1a)",
                                border: "none",
                                borderRadius: 50,
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 14,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                cursor: "pointer",
                                boxShadow: saved
                                    ? "0 6px 28px rgba(16,185,129,0.4), 0 0 0 1px rgba(16,185,129,0.15)"
                                    : "0 6px 28px rgba(238,124,43,0.4), 0 0 0 1px rgba(238,124,43,0.15)",
                                transition: "all 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
                                fontFamily: "inherit",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = "translateY(-3px)";
                                e.currentTarget.style.boxShadow = saved
                                    ? "0 12px 36px rgba(16,185,129,0.5), 0 0 0 1px rgba(16,185,129,0.2)"
                                    : "0 12px 36px rgba(238,124,43,0.5), 0 0 0 1px rgba(238,124,43,0.2)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = saved
                                    ? "0 6px 28px rgba(16,185,129,0.4), 0 0 0 1px rgba(16,185,129,0.15)"
                                    : "0 6px 28px rgba(238,124,43,0.4), 0 0 0 1px rgba(238,124,43,0.15)";
                            }}
                        >
                            {saved ? <Check size={15} strokeWidth={3} /> : <Save size={15} strokeWidth={2.5} />}
                            {saved ? "Saved!" : "Save Settings"}
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AdminSettings;

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import { Save, Check } from "lucide-react";

const API = "http://localhost:5000/api";

const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#fff",
    padding: "12px 16px",
    fontSize: 14,
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s",
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
        <div style={{ maxWidth: 620 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 20,
                    padding: 36,
                }}
            >
                <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 8px", fontFamily: "'Playfair Display', serif" }}>
                    Restaurant Settings
                </h2>
                <p style={{ color: "#555", fontSize: 13, margin: "0 0 32px" }}>
                    Manage your restaurant's public-facing information.
                </p>

                {loading ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#555" }}>Loading…</div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {FIELDS.map(({ key, label, type }) => (
                            <div key={key}>
                                <label style={{ display: "block", color: "#888", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    value={form[key] || ""}
                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = "rgba(238,124,43,0.5)"}
                                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                                />
                            </div>
                        ))}

                        <div style={{ marginTop: 8 }}>
                            <button
                                onClick={save}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "12px 28px",
                                    background: saved
                                        ? "linear-gradient(135deg,#10b981,#059669)"
                                        : "linear-gradient(135deg,#ee7c2b,#d46a1f)",
                                    border: "none", borderRadius: 12,
                                    color: "#fff", fontWeight: 700, fontSize: 14,
                                    cursor: "pointer",
                                    boxShadow: saved
                                        ? "0 4px 16px rgba(16,185,129,0.3)"
                                        : "0 4px 16px rgba(238,124,43,0.3)",
                                    transition: "all 0.3s",
                                }}
                            >
                                {saved ? <Check size={16} /> : <Save size={16} />}
                                {saved ? "Saved!" : "Save Settings"}
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminSettings;

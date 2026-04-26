import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Search, UtensilsCrossed } from "lucide-react";
import AdminSelect from "../../../components/AdminSelect";
import ConfirmModal from "../../../components/ConfirmModal";

const API = "http://localhost:5000/api";
const CATEGORIES = ["Starters", "Main Course", "Desserts", "Beverages"];

const inputStyle = {
    background: "#000000",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#d6d3d1",
    padding: "11px 14px",
    fontSize: 14,
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s",
};

const selectStyle = {
    background: "#000000",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#d6d3d1",
    padding: "11px 14px",
    fontSize: 14,
    outline: "none",
    width: "100%",
    colorScheme: "dark",
    cursor: "pointer",
    fontWeight: 500,
};

const Modal = ({ title, onClose, children }) => (
    <div style={{ position: "fixed", inset: 0, zIndex: 100 }} className="hide-scrollbar">
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }} onClick={onClose} />
        <div className="hide-scrollbar" style={{ position: "absolute", inset: 0, overflowY: "auto" }}>
            <div style={{ padding: "60px 16px", minHeight: "100%", display: "flex", alignItems: "flex-start", justifyContent: "center" }} onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    onClick={e => e.stopPropagation()}
                    style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 500, color: "#fff", position: "relative" }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, fontFamily: "'Playfair Display', serif", textTransform: "uppercase", color: "#ee7c2b", letterSpacing: "0.05em" }}>{title}</h2>
                        <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <X size={18} />
                        </button>
                    </div>
                    {children}
                </motion.div>
            </div>
        </div>
    </div>
);

const emptyForm = { name: "", description: "", price: "", category: "Starters", image: "", isVeg: false, isAvailable: true };

const AdminMenu = () => {
    const { token } = useAuth();
    const descRef = useRef(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [catFilter, setCatFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [hoveredId, setHoveredId] = useState(null);

    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    const load = () => {
        fetch(`${API}/admin/menu`, { headers })
            .then(r => r.json())
            .then(d => { setItems(d.data || []); setLoading(false); });
    };

    // Auto-resize description textarea whenever value changes
    useEffect(() => {
        if (descRef.current) {
            descRef.current.style.height = "auto";
            descRef.current.style.height = descRef.current.scrollHeight + "px";
        }
    }, [form.description]);

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true); };
    const openEdit = (it) => {
        setForm({ name: it.name, description: it.description, price: it.price, category: it.category, image: it.image || "", isVeg: it.isVeg, isAvailable: it.isAvailable });
        setEditId(it._id);
        setModal(true);
    };

    const save = async () => {
        if (!form.name || !form.price) return alert("Name and price are required.");
        const body = { ...form, price: parseFloat(form.price) };
        if (editId) {
            await fetch(`${API}/admin/menu/${editId}`, { method: "PUT", headers, body: JSON.stringify(body) });
        } else {
            await fetch(`${API}/admin/menu`, { method: "POST", headers, body: JSON.stringify(body) });
        }
        setModal(false);
        load();
    };

    const del = (id) => {
        setConfirmDeleteId(id);
    };

    const executeDelete = async () => {
        if (!confirmDeleteId) return;
        await fetch(`${API}/admin/menu/${confirmDeleteId}`, { method: "DELETE", headers });
        setConfirmDeleteId(null);
        load();
    };

    const filtered = items.filter(i => {
        const matchesCat = catFilter === "All" || i.category === catFilter;
        const matchesSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <div>
            {/* Top bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["All", ...CATEGORIES].map(c => (
                        <button key={c} onClick={() => setCatFilter(c)} style={{
                            padding: "8px 18px", borderRadius: 40, fontSize: 13, fontWeight: 600, cursor: "pointer",
                            background: catFilter === c ? "linear-gradient(135deg,#ee7c2b,#d46a1f)" : "rgba(255,255,255,0.05)",
                            border: catFilter === c ? "2px solid transparent" : "2px solid transparent",
                            outline: catFilter === c ? "none" : "none",
                            color: catFilter === c ? "#fff" : "#888",
                            transition: "all 0.2s",
                        }}>
                            {c === "All" ? "All Items" : c}
                        </button>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="admin-search-container" style={{ minWidth: 180, maxWidth: 260 }}>
                        <input
                            className="admin-search-input"
                            placeholder="Search dishes…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <Search size={15} className="admin-search-icon" />
                    </div>
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
                        Add Dish
                    </button>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                    <div style={{ width: 36, height: 36, border: "3px solid rgba(238,124,43,0.2)", borderTopColor: "#ee7c2b", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={catFilter}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 28 }}
                    >
                        {filtered.map((it, i) => (
                            <motion.div
                                key={it._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: i * 0.05 }}
                                onMouseEnter={() => setHoveredId(it._id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    borderRadius: 16, overflow: "hidden",
                                    display: "flex", flexDirection: "column",
                                    opacity: it.isAvailable ? 1 : 0.5,
                                    transition: "all 0.3s",
                                }}
                            >
                                {/* Image area — aspect 4:3 */}
                                <div style={{ aspectRatio: "4/3", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                                    {it.image ? (
                                        <img
                                            src={it.image}
                                            alt={it.name}
                                            style={{
                                                width: "100%", height: "100%", objectFit: "cover",
                                                transform: hoveredId === it._id ? "scale(1.1)" : "scale(1)",
                                                transition: "transform 0.5s ease",
                                            }}
                                        />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: 13 }}>
                                            No Image
                                        </div>
                                    )}

                                    {/* Veg / Non-Veg corner indicator */}
                                    <div style={{
                                        position: "absolute", top: 0, left: 0,
                                        width: 20, height: 20,
                                        background: it.isVeg ? "#16a34a" : "#dc2626",
                                        borderBottomRightRadius: 8,
                                    }} />

                                    {/* Price badge — top right, matches public menu */}
                                    <div style={{
                                        position: "absolute", top: 16, right: 16,
                                        background: "rgba(255,255,255,0.03)",
                                        backdropFilter: "blur(8px)",
                                        padding: "6px 14px",
                                        borderRadius: 12,
                                        color: "#ee7c2b",
                                        fontWeight: 700,
                                        fontSize: 15,
                                    }}>
                                        ₹{Number(it.price).toFixed(2)}
                                    </div>

                                    {/* Unavailable badge */}
                                    {!it.isAvailable && (
                                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(0,0,0,0.6)", padding: "6px 14px", borderRadius: 20 }}>Unavailable</span>
                                        </div>
                                    )}
                                </div>

                                {/* Card body — matches p-6 of public menu */}
                                <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                                    <h3 style={{
                                        fontSize: 18, fontWeight: 700, margin: "0 0 8px",
                                        color: hoveredId === it._id ? "#ee7c2b" : "#fff",
                                        transition: "color 0.2s",
                                    }}>{it.name}</h3>
                                    <p style={{
                                        color: "#888", fontSize: 13, lineHeight: 1.6,
                                        margin: "0 0 16px", minHeight: 60,
                                        display: "-webkit-box", WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical", overflow: "hidden",
                                    }}>{it.description}</p>

                                    <div style={{ flexGrow: 1 }} />

                                    {/* Admin actions — same width as "Add to Cart" in public menu */}
                                    <div style={{ display: "flex", gap: 10 }}>
                                        <button
                                            onClick={() => openEdit(it)}
                                            style={{
                                                flex: 1, padding: "10px 0",
                                                border: "1px solid rgba(255,255,255,0.2)",
                                                borderRadius: 8, background: "transparent",
                                                color: "#fff", fontWeight: 600, fontSize: 13,
                                                cursor: "pointer", transition: "all 0.2s",
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(238,124,43,0.15)"; e.currentTarget.style.borderColor = "#ee7c2b"; e.currentTarget.style.color = "#ee7c2b"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
                                        >
                                            <Pencil size={13} /> Edit
                                        </button>
                                        <button
                                            onClick={() => del(it._id)}
                                            style={{
                                                padding: "10px 14px",
                                                border: "1px solid rgba(239,68,68,0.25)",
                                                borderRadius: 8, background: "rgba(239,68,68,0.06)",
                                                color: "#ef4444", cursor: "pointer", transition: "all 0.2s",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {filtered.length === 0 && (
                            <div style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, height: "calc(100vh - 220px)" }}>
                                <UtensilsCrossed size={60} color="#444" />
                                <span style={{ color: "#ee7c2b", fontSize: 16, fontWeight: 500, opacity: 0.7 }}>No dishes in this category.</span>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Add / Edit Modal */}
            <AnimatePresence>
                {modal && (
                    <Modal title={editId ? "Edit Dish" : "Add Dish"} onClose={() => setModal(false)}>

                        {/* Name */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>Dish Name *</label>
                            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Truffle Bruschetta" style={inputStyle}
                                onFocus={e => e.target.style.borderColor = "rgba(238,124,43,0.5)"}
                                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
                        </div>

                        {/* Price — prominent */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>Price (₹) *</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#ee7c2b", fontWeight: 700, fontSize: 16 }}>₹</span>
                                <input
                                    type="number" min="0" step="0.01"
                                    value={form.price}
                                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                    placeholder="0.00"
                                    style={{ ...inputStyle, paddingLeft: 30, color: "#ee7c2b", fontWeight: 700, fontSize: 16 }}
                                    onFocus={e => e.target.style.borderColor = "rgba(238,124,43,0.5)"}
                                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>Category</label>
                            <AdminSelect
                                value={form.category}
                                onChange={val => setForm(f => ({ ...f, category: val }))}
                                options={CATEGORIES}
                                bg="#000000"
                                panelBg="#000000"
                            />
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>Description</label>
                            <textarea ref={descRef} className="hide-scrollbar" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Describe the dish…"
                                rows={1}
                                style={{ ...inputStyle, resize: "none", overflow: "hidden", minHeight: 42 }}
                                onFocus={e => e.target.style.borderColor = "rgba(238,124,43,0.5)"}
                                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
                        </div>

                        {/* Image URL */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: "block", color: "#888", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>Image URL</label>
                            <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://…" style={inputStyle}
                                onFocus={e => e.target.style.borderColor = "rgba(238,124,43,0.5)"}
                                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
                            {form.image && (
                                <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", height: 160, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img src={form.image} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
                                </div>
                            )}
                        </div>

                        {/* Toggles */}
                        <div style={{ display: "flex", gap: 32, marginBottom: 28 }}>
                            {/* Veg Toggle */}
                            <div
                                style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}
                                onClick={() => setForm(f => ({ ...f, isVeg: !f.isVeg }))}
                            >
                                <div style={{
                                    width: 44, height: 24, borderRadius: 24,
                                    background: form.isVeg ? "#10b981" : "#ef4444",
                                    position: "relative",
                                    transition: "all 0.3s ease"
                                }}>
                                    <div style={{
                                        position: "absolute", top: 2, left: form.isVeg ? 22 : 2,
                                        width: 20, height: 20, borderRadius: "50%",
                                        background: "#fff",
                                        transition: "all 0.3s ease",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                    }} />
                                </div>
                                <span style={{ color: form.isVeg ? "#10b981" : "#ef4444", fontSize: 13, fontWeight: 600, transition: "color 0.3s ease" }}>
                                    {form.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                                </span>
                            </div>

                            {/* Available Toggle */}
                            <div
                                style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}
                                onClick={() => setForm(f => ({ ...f, isAvailable: !f.isAvailable }))}
                            >
                                <div style={{
                                    width: 44, height: 24, borderRadius: 24,
                                    background: form.isAvailable ? "#10b981" : "#ef4444",
                                    position: "relative",
                                    transition: "all 0.3s ease"
                                }}>
                                    <div style={{
                                        position: "absolute", top: 2, left: form.isAvailable ? 22 : 2,
                                        width: 20, height: 20, borderRadius: "50%",
                                        background: "#fff",
                                        transition: "all 0.3s ease",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                    }} />
                                </div>
                                <span style={{ color: form.isAvailable ? "#10b981" : "#ef4444", fontSize: 13, fontWeight: 600, transition: "color 0.3s ease" }}>
                                    {form.isAvailable ? "Available" : "Unavailable"}
                                </span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                            <button onClick={() => setModal(false)} style={{ padding: "11px 22px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#888", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                            <button onClick={save} style={{ padding: "11px 28px", borderRadius: 10, background: "linear-gradient(135deg,#ee7c2b,#d46a1f)", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(238,124,43,0.3)", fontSize: 14 }}>
                                {editId ? "Save Changes" : "Add Dish"}
                            </button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                open={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={executeDelete}
                title="Delete Dish"
                message="Are you sure you want to delete this dish? This action is permanent and cannot be undone."
                confirmLabel="Delete Dish"
            />
        </div>
    );
};

export default AdminMenu;

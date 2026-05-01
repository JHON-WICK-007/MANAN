import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";

const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure? This action cannot be undone.",
    confirmLabel = "Confirm",
    danger = true,
    icon: Icon = Trash2,
}) => {
    useEffect(() => {
        if (open) {
            const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarW}px`;
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [open]);

    const accentColor = danger ? "#ef4444" : "#f97316";
    const accentDim   = danger ? "rgba(239,68,68,0.12)" : "rgba(249,115,22,0.12)";
    const accentBorder= danger ? "rgba(239,68,68,0.25)" : "rgba(249,115,22,0.25)";
    const glowColor   = danger ? "rgba(239,68,68,0.18)" : "rgba(249,115,22,0.18)";

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    onClick={onClose}
                    style={{
                        position: "fixed", inset: 0, zIndex: 10000,
                        background: "rgba(0,0,0,0.8)",
                        backdropFilter: "blur(10px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 24,
                    }}
                >
                    <motion.div
                        key="card"
                        initial={{ opacity: 0, scale: 0.88, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: 24 }}
                        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: "100%", maxWidth: 400,
                            background: "linear-gradient(160deg, #1a1a1a 0%, #0f0f0f 100%)",
                            borderRadius: 24,
                            overflow: "hidden",
                            boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 40px 80px rgba(0,0,0,0.7), 0 0 60px ${glowColor}`,
                            position: "relative",
                        }}
                    >
                        {/* Glowing top border */}
                        <div style={{
                            height: 2,
                            background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
                        }} />

                        {/* Radial glow behind icon */}
                        <div style={{
                            position: "absolute",
                            top: 0, left: "50%",
                            transform: "translateX(-50%)",
                            width: 220, height: 140,
                            background: `radial-gradient(ellipse at top, ${glowColor} 0%, transparent 70%)`,
                            pointerEvents: "none",
                        }} />

                        <div style={{ padding: "32px 28px 28px", position: "relative" }}>
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                style={{
                                    position: "absolute", top: 20, right: 20,
                                    width: 28, height: 28, borderRadius: 8,
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    color: "#555", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.15s",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#aaa"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#555"; }}
                            >
                                <X size={13} />
                            </button>

                            {/* Icon */}
                            <div style={{
                                width: 56, height: 56, borderRadius: 16,
                                background: accentDim,
                                border: `1px solid ${accentBorder}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: 20,
                                boxShadow: `0 0 24px ${glowColor}`,
                            }}>
                                <Icon size={22} color={accentColor} />
                            </div>

                            {/* Title */}
                            <h2 style={{
                                margin: "0 0 10px",
                                fontSize: 18, fontWeight: 800,
                                color: "#f0f0f0",
                                letterSpacing: "-0.02em",
                                fontFamily: "'Playfair Display', serif",
                            }}>{title}</h2>

                            {/* Message */}
                            <p style={{
                                margin: "0 0 28px",
                                fontSize: 13.5, color: "#666",
                                lineHeight: 1.7,
                            }}>{message}</p>

                            {/* Divider */}
                            <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 20 }} />

                            {/* Buttons */}
                            <div style={{ display: "flex", gap: 10 }}>
                                <button
                                    onClick={onClose}
                                    style={{
                                        flex: 1, padding: "12px 0",
                                        borderRadius: 12, fontSize: 13.5, fontWeight: 600,
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        color: "#777", cursor: "pointer",
                                        transition: "all 0.15s",
                                        letterSpacing: "0.01em",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#bbb"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#777"; }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { onConfirm(); onClose(); }}
                                    style={{
                                        flex: 1, padding: "12px 0",
                                        borderRadius: 12, fontSize: 13.5, fontWeight: 700,
                                        background: danger
                                            ? "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)"
                                            : "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
                                        border: "none",
                                        color: "#fff", cursor: "pointer",
                                        boxShadow: `0 4px 20px ${glowColor}`,
                                        transition: "all 0.15s",
                                        letterSpacing: "0.01em",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${glowColor}`; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${glowColor}`; }}
                                >
                                    {confirmLabel}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ConfirmModal;

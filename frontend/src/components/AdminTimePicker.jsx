import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Clock } from "lucide-react";

// Auto-insert colon as user types
const applyMask = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    let out = "";
    for (let i = 0; i < digits.length; i++) {
        if (i === 2) out += ":";
        out += digits[i];
    }
    return out;
};

const parseTyped = (str) => {
    const match = str.match(/^(\d{2}):(\d{2})$/);
    if (!match) return null;
    const [, h, m] = match.map(Number);
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return str; // valid HH:MM
};

export default function AdminTimePicker({ value, onChange, placeholder = "HH:MM", style = {}, bg = "rgba(255,255,255,0.05)", panelBg = "linear-gradient(160deg,#141414 0%,#0a0a0a 100%)" }) {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const [inputText, setInputText] = useState(value || "");
    const [inputValid, setInputValid] = useState(true);

    const wrapRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { setInputText(value || ""); }, [value]);

    const handleType = (e) => {
        const masked = applyMask(e.target.value);
        setInputText(masked);
        if (masked.length === 5) {
            const parsed = parseTyped(masked);
            if (parsed) {
                setInputValid(true);
                onChange(parsed);
            } else {
                setInputValid(false);
            }
        } else if (masked.length === 0) {
            setInputValid(true);
            onChange("");
        } else {
            setInputValid(true);
        }
    };

    const openPicker = () => {
        if (wrapRef.current) {
            const rect = wrapRef.current.getBoundingClientRect();
            const panelH = 260; // estimated panel height
            const spaceBelow = window.innerHeight - rect.bottom;
            const top = spaceBelow < panelH + 8 ? rect.top - panelH - 6 : rect.bottom + 6;
            setCoords({ top, left: rect.left });
        }
        setOpen(o => !o);
    };

    useEffect(() => {
        const handleClick = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target) && !e.target.closest(".admin-time-panel")) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = ["00", "15", "30", "45"];

    const currentH = (value || "").split(":")[0] || "18";
    const currentM = (value || "").split(":")[1] || "00";

    const setTime = (h, m) => {
        const newVal = `${h}:${m}`;
        setInputText(newVal);
        onChange(newVal);
    };

    return (
        <div ref={wrapRef} style={{ position: "relative", ...style }}>
            <div style={{
                display: "flex", alignItems: "center", padding: "0 12px", gap: 6, height: 42,
                boxSizing: "border-box", background: bg,
                border: `1px solid ${inputValid ? "rgba(255,255,255,0.1)" : "rgba(239,68,68,0.5)"}`,
                borderRadius: 12, boxShadow: open ? "0 0 0 3px rgba(238,124,43,0.12)" : "none",
                transition: "border-color 0.2s, box-shadow 0.2s", cursor: "text"
            }} onClick={() => inputRef.current?.focus()}>
                <input ref={inputRef} type="text" inputMode="numeric" value={inputText} onChange={handleType} placeholder={placeholder} maxLength={5}
                    style={{ width: 60, flexShrink: 0, height: "100%", background: "transparent", border: "none", outline: "none", color: inputText ? "#d6d3d1" : "#9ca3af", fontSize: 13, fontWeight: 500, padding: 0, letterSpacing: "0.06em", fontFamily: "inherit" }}
                />
                <div style={{ flex: 1 }} />
                <button type="button" onClick={(e) => { e.stopPropagation(); openPicker(); }} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Clock size={15} color={open ? "#ee7c2b" : "#555"} style={{ transition: "color 0.2s" }} />
                </button>
            </div>

            {open && createPortal(
                <div className="admin-time-panel" style={{
                    position: "fixed", top: coords.top, left: coords.left, width: 232,
                    background: "linear-gradient(160deg,#141414 0%,#0a0a0a 100%)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14,
                    padding: 16, zIndex: 99999, boxShadow: "0 16px 40px rgba(0,0,0,0.85)",
                    display: "flex", flexDirection: "column", gap: 14,
                    overflowY: "auto", maxHeight: "90vh",
                    scrollbarWidth: "none", msOverflowStyle: "none"
                }}>
                    {/* Hours Grid */}
                    <div>
                        <div style={{ color: "#888", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, textAlign: "center" }}>Hour</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4 }}>
                            {hours.map(h => (
                                <div key={h} onClick={() => setTime(h, currentM)}
                                    style={{
                                        padding: "6px 0", textAlign: "center", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: h === currentH ? 700 : 500,
                                        color: h === currentH ? "#fff" : "#888",
                                        background: h === currentH ? "rgba(238,124,43,0.8)" : "rgba(255,255,255,0.03)",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={e => { if (h !== currentH) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                                    onMouseLeave={e => { if (h !== currentH) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                                >{h}</div>
                            ))}
                        </div>
                    </div>

                    <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

                    {/* Minutes Grid */}
                    <div>
                        <div style={{ color: "#888", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, textAlign: "center" }}>Minute</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                            {minutes.map(m => (
                                <div key={m} onClick={() => { setTime(currentH, m); setOpen(false); }}
                                    style={{
                                        padding: "6px 0", textAlign: "center", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: m === currentM ? 700 : 500,
                                        color: m === currentM ? "#fff" : "#888",
                                        background: m === currentM ? "rgba(238,124,43,0.8)" : "rgba(255,255,255,0.03)",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={e => { if (m !== currentM) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                                    onMouseLeave={e => { if (m !== currentM) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                                >{m}</div>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

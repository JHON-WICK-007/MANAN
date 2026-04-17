import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

// Internal YYYY-MM-DD ↔ display DD-MM-YYYY
const parseValue = (val) => {
    if (!val) return null;
    const [y, m, d] = val.split("-").map(Number);
    return new Date(y, m - 1, d);
};
const toValue = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};
const toDisplay = (val) => {
    if (!val) return "";
    const [y, m, d] = val.split("-");
    return `${d}-${m}-${y}`;
};
// Parse typed DD-MM-YYYY → YYYY-MM-DD if valid
const parseTyped = (str) => {
    const match = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) return null;
    const [, d, m, y] = match.map(Number);
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;
    const date = new Date(y, m - 1, d);
    if (date.getMonth() !== m - 1) return null; // invalid day for month
    return toValue(date);
};
// Auto-insert dashes as user types
const applyMask = (raw) => {
    // Strip all non-digits
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    let out = "";
    for (let i = 0; i < digits.length; i++) {
        if (i === 2 || i === 4) out += "-";
        out += digits[i];
    }
    return out;
};

const AdminDatePicker = ({ value, onChange, placeholder = "DD-MM-YYYY", style = {}, bg = "rgba(255,255,255,0.05)", panelBg = "linear-gradient(160deg,#141414 0%,#0a0a0a 100%)" }) => {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const [inputText, setInputText] = useState(toDisplay(value));
    const [inputValid, setInputValid] = useState(true);

    const selected = parseValue(value);
    const today = new Date();

    const [viewYear, setViewYear] = useState((selected || today).getFullYear());
    const [viewMonth, setViewMonth] = useState((selected || today).getMonth());

    const wrapRef = useRef(null);
    const inputRef = useRef(null);

    // Sync input text when external value changes
    useEffect(() => { setInputText(toDisplay(value)); }, [value]);

    // ── Typing handler ────────────────────────────────────────────────────────
    const handleType = (e) => {
        const masked = applyMask(e.target.value);
        setInputText(masked);
        if (masked.length === 10) {
            const parsed = parseTyped(masked);
            if (parsed) {
                setInputValid(true);
                onChange(parsed);
                const d = parseValue(parsed);
                setViewYear(d.getFullYear());
                setViewMonth(d.getMonth());
            } else {
                setInputValid(false);
            }
        } else if (masked.length === 0) {
            setInputValid(true);
            onChange("");
        } else {
            setInputValid(true); // still typing
        }
    };

    // ── Calendar open ────────────────────────────────────────────────────────
    const openCalendar = () => {
        if (wrapRef.current) {
            const rect = wrapRef.current.getBoundingClientRect();
            setCoords({ top: rect.bottom + 6, left: rect.left, width: Math.max(rect.width, 248) });
        }
        if (selected) { setViewYear(selected.getFullYear()); setViewMonth(selected.getMonth()); }
        setOpen(o => !o);
    };

    // ── Outside click ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                const panel = document.getElementById("admin-date-panel");
                if (panel && panel.contains(e.target)) return;
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // ── Calendar grid ────────────────────────────────────────────────────────
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevDays = new Date(viewYear, viewMonth, 0).getDate();
    const cells = [];
    for (let i = firstDay - 1; i >= 0; i--) cells.push({ d: prevDays - i, cur: false });
    for (let i = 1; i <= daysInMonth; i++)  cells.push({ d: i, cur: true });
    while (cells.length % 7 !== 0) cells.push({ d: cells.length - firstDay - daysInMonth + 1, cur: false });

    const isToday = (d, cur) => cur && d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
    const isSelected = (d, cur) => cur && selected && d === selected.getDate() && viewMonth === selected.getMonth() && viewYear === selected.getFullYear();

    const selectDay = (d, cur) => {
        if (!cur) return;
        const v = toValue(new Date(viewYear, viewMonth, d));
        onChange(v);
        setInputText(toDisplay(v));
        setInputValid(true);
        setOpen(false);
    };

    return (
        <div ref={wrapRef} style={{ position: "relative", ...style }}>
            {/* Input row */}
            <div style={{
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                gap: 6,
                height: 42,
                boxSizing: "border-box",
                background: bg,
                border: `1px solid ${inputValid ? "rgba(255,255,255,0.1)" : "rgba(239,68,68,0.5)"}`,
                borderRadius: 12,
                boxShadow: open ? "0 0 0 3px rgba(238,124,43,0.12)" : "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
            }}>
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={inputText}
                    onChange={handleType}
                    placeholder={placeholder}
                    maxLength={10}
                    style={{
                        width: 108,
                        flexShrink: 0,
                        height: "100%",
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: inputText ? "#d6d3d1" : "#9ca3af",
                        fontSize: 13,
                        fontWeight: 500,
                        padding: 0,
                        letterSpacing: "0.06em",
                        fontFamily: "inherit",
                    }}
                />
                <button
                    type="button"
                    onClick={openCalendar}
                    style={{
                        flexShrink: 0,
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: open ? "#ee7c2b" : "#555",
                        transition: "color 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#ee7c2b"}
                    onMouseLeave={e => { e.currentTarget.style.color = open ? "#ee7c2b" : "#555"; }}
                >
                    <CalendarDays size={14} />
                </button>
            </div>

            {/* Calendar panel */}
            {open && createPortal(
                <div
                    id="admin-date-panel"
                    style={{
                        position: "fixed", zIndex: 9999,
                        top: coords.top, left: coords.left, width: coords.width,
                        background: panelBg,
                        border: "1px solid rgba(238,124,43,0.12)",
                        borderRadius: 16,
                        boxShadow: "0 24px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
                        padding: "14px 12px 12px",
                        userSelect: "none",
                    }}
                >
                    {/* Month/Year nav */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "0 2px" }}>
                        <button type="button" onClick={() => { const d = new Date(viewYear, viewMonth - 1); setViewMonth(d.getMonth()); setViewYear(d.getFullYear()); }}
                            style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ChevronLeft size={13} />
                        </button>
                        <span style={{ color: "#f0f0f0", fontSize: 13, fontWeight: 700, letterSpacing: "0.01em" }}>
                            {MONTHS[viewMonth]} {viewYear}
                        </span>
                        <button type="button" onClick={() => { const d = new Date(viewYear, viewMonth + 1); setViewMonth(d.getMonth()); setViewYear(d.getFullYear()); }}
                            style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ChevronRight size={13} />
                        </button>
                    </div>

                    {/* Day headers */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
                        {DAYS.map(d => (
                            <div key={d} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 700, color: "#555", padding: "4px 0", letterSpacing: "0.05em" }}>{d}</div>
                        ))}
                    </div>

                    {/* Day grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px 0" }}>
                        {cells.map((cell, i) => {
                            const sel = isSelected(cell.d, cell.cur);
                            const tod = isToday(cell.d, cell.cur);
                            return (
                                <button
                                    key={i} type="button"
                                    onClick={() => selectDay(cell.d, cell.cur)}
                                    style={{
                                        height: 30, width: "100%", borderRadius: 7,
                                        border: tod && !sel ? "1px solid rgba(238,124,43,0.4)" : "1px solid transparent",
                                        background: sel ? "linear-gradient(135deg,#ee7c2b,#d46a1f)" : "transparent",
                                        color: sel ? "#fff" : cell.cur ? (tod ? "#ee7c2b" : "#ccc") : "#333",
                                        fontSize: 12.5, fontWeight: sel ? 700 : 400,
                                        cursor: cell.cur ? "pointer" : "default",
                                        transition: "background 0.12s, color 0.12s",
                                        boxShadow: sel ? "0 2px 10px rgba(238,124,43,0.35)" : "none",
                                    }}
                                    onMouseEnter={e => { if (cell.cur && !sel) e.currentTarget.style.background = "rgba(238,124,43,0.1)"; }}
                                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "transparent"; }}
                                >
                                    {cell.d}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <button type="button" onClick={() => { onChange(""); setInputText(""); setInputValid(true); setOpen(false); }}
                            style={{ fontSize: 12, color: "#666", background: "none", border: "none", cursor: "pointer", padding: "2px 4px", transition: "color 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
                            onMouseLeave={e => e.currentTarget.style.color = "#666"}
                        >Clear</button>
                        <button type="button" onClick={() => { const v = toValue(today); onChange(v); setInputText(toDisplay(v)); setInputValid(true); setOpen(false); }}
                            style={{ fontSize: 12, color: "#ee7c2b", background: "none", border: "none", cursor: "pointer", padding: "2px 4px", fontWeight: 600 }}>Today</button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminDatePicker;

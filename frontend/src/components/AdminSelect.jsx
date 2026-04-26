import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

/**
 * AdminSelect — custom dropdown rendered via Portal so it escapes
 * any parent overflow:hidden (tables, cards, etc.)
 */
const AdminSelect = ({ value, onChange, options = [], placeholder = "Select…", style = {}, bg = "rgba(255,255,255,0.05)", panelBg = "rgba(15,15,15,0.98)" }) => {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const triggerRef = useRef(null);
    const panelRef = useRef(null);

    // Normalize options to { value, label }
    const normalized = options.map(o =>
        typeof o === "string" ? { value: o, label: o } : o
    );
    const selected = normalized.find(o => o.value === value);

    // Calculate panel position from trigger's screen coords
    const openDropdown = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 6,
                left: rect.left,
                width: rect.width,
            });
        }
        setOpen(o => !o);
    };

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (
                triggerRef.current && !triggerRef.current.contains(e.target) &&
                panelRef.current && !panelRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // Reposition if window scrolls while open
    useEffect(() => {
        if (!open) return;
        const reposition = () => {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setCoords({ top: rect.bottom + 6, left: rect.left, width: rect.width });
            }
        };
        window.addEventListener("scroll", reposition, true);
        return () => window.removeEventListener("scroll", reposition, true);
    }, [open]);

    return (
        <div ref={triggerRef} style={{ position: "relative", ...style }}>
            {/* Trigger button */}
            <button
                type="button"
                onClick={openDropdown}
                style={{
                    width: "fit-content",
                    height: 42,
                    boxSizing: "border-box",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 6,
                    padding: "0 12px",
                    background: bg,
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: selected ? "#d6d3d1" : "#9ca3af",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxShadow: open ? "0 0 0 3px rgba(238,124,43,0.12)" : "none",
                    whiteSpace: "nowrap",
                }}
            >
                {/* Ghost span locks width to placeholder, visible span shows actual value */}
                <span style={{ display: "grid", overflow: "hidden", flex: 1 }}>
                    <span style={{ gridArea: "1/1", visibility: "hidden", whiteSpace: "nowrap", fontSize: 13 }}>
                        {placeholder}
                    </span>
                    <span style={{ gridArea: "1/1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selected ? selected.label : placeholder}
                    </span>
                </span>
                <ChevronDown
                    size={15}
                    style={{
                        flexShrink: 0,
                        color: open ? "#ee7c2b" : "#555",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease, color 0.2s ease",
                    }}
                />
            </button>

            {/* Panel — rendered via Portal to escape overflow:hidden */}
            {open && createPortal(
                <div
                    ref={panelRef}
                    style={{
                        position: "fixed",
                        zIndex: 9999,
                        top: coords.top,
                        left: coords.left,
                        width: coords.width,
                        background: panelBg,
                        border: "1px solid rgba(238,124,43,0.1)",
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 16px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(238,124,43,0.06)",
                        backdropFilter: "blur(16px)",
                    }}
                >
                    <div style={{ maxHeight: 220, overflowY: "auto", scrollbarWidth: "none" }}>
                        {normalized.map((opt) => {
                            const isSelected = opt.value === value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "11px 16px",
                                        background: isSelected ? "rgba(238,124,43,0.12)" : "transparent",
                                        border: "none",
                                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                                        color: isSelected ? "#ee7c2b" : "#d6d3d1",
                                        fontSize: 13,
                                        fontWeight: isSelected ? 600 : 400,
                                        cursor: "pointer",
                                        textAlign: "left",
                                        transition: "background 0.15s",
                                    }}
                                    onMouseEnter={e => {
                                        if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                    }}
                                    onMouseLeave={e => {
                                        if (!isSelected) e.currentTarget.style.background = "transparent";
                                    }}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminSelect;

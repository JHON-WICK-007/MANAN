import { NavLink } from "react-router-dom";
import {
    LayoutDashboard, CalendarCheck, UtensilsCrossed, BookOpen,
    ShoppingBag, Users, MessageSquare, BarChart3, Settings, ChevronLeft, ChevronRight
} from "lucide-react";

const navItems = [
    { label: "Dashboard",    icon: LayoutDashboard,  path: "/admin/dashboard" },
    { label: "Reservations", icon: CalendarCheck,     path: "/admin/reservations" },
    { label: "Tables",       icon: UtensilsCrossed,   path: "/admin/tables" },
    { label: "Menu",         icon: BookOpen,          path: "/admin/menu" },
    { label: "Orders",       icon: ShoppingBag,       path: "/admin/orders" },
    { label: "Customers",    icon: Users,             path: "/admin/customers" },
    { label: "Messages",     icon: MessageSquare,     path: "/admin/messages" },
    { label: "Analytics",    icon: BarChart3,         path: "/admin/analytics" },
    { label: "Settings",     icon: Settings,          path: "/admin/settings" },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
    return (
        <aside
            style={{
                /* In flex flow — NO position:fixed so it never overlays content */
                flexShrink: 0,
                width: collapsed ? 72 : 260,
                /* Sticky so it stays visible while content scrolls */
                position: "sticky",
                top: 0,
                height: "100vh",
                background: "linear-gradient(180deg, #111111 0%, #0d0d0d 100%)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                zIndex: 50,
                /* Single CSS transition — sidebar width and content flex happen together */
                transition: "width 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
        >
            {/* Logo */}
            <div style={{
                height: 72,
                padding: "0 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                flexShrink: 0,
                overflow: "hidden",
            }}>
                <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #ee7c2b, #d46a1f)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontWeight: 800, color: "#fff", fontSize: 14,
                }}>L</div>

                <span style={{
                    color: "#fff", fontWeight: 700, fontSize: 16,
                    letterSpacing: "0.02em", whiteSpace: "nowrap",
                    fontFamily: "'Playfair Display', serif",
                    opacity: collapsed ? 0 : 1,
                    transform: collapsed ? "translateX(-6px)" : "translateX(0)",
                    transition: collapsed
                        ? "opacity 0.08s ease, transform 0.08s ease"
                        : "opacity 0.18s ease 0.14s, transform 0.18s ease 0.14s",
                    pointerEvents: "none",
                }}>
                    Lumière Admin
                </span>
            </div>

            {/* Nav Items */}
            <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "12px 0", scrollbarWidth: "none" }}>
                {navItems.map(({ label, icon: Icon, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        title={collapsed ? label : undefined}
                        style={{ display: "block", textDecoration: "none" }}
                    >
                        {({ isActive }) => (
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "11px 14px",
                                margin: "2px 8px",
                                borderRadius: 10,
                                cursor: "pointer",
                                background: "transparent",
                                border: "1px solid transparent",
                                transition: "background 0.15s ease",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                            }}
                                className="admin-nav-item"
                            >
                                <Icon
                                    size={19}
                                    style={{
                                        color: isActive ? "#ee7c2b" : "#888",
                                        flexShrink: 0,
                                        transition: "color 0.15s",
                                        minWidth: 19,
                                    }}
                                />
                                <span style={{
                                    color: isActive ? "#fff" : "#888",
                                    fontSize: 13.5,
                                    fontWeight: isActive ? 600 : 500,
                                    whiteSpace: "nowrap",
                                    letterSpacing: "0.01em",
                                    opacity: collapsed ? 0 : 1,
                                    transform: collapsed ? "translateX(-6px)" : "translateX(0)",
                                    transition: collapsed
                                        ? "opacity 0.08s ease, transform 0.08s ease, color 0.15s"
                                        : "opacity 0.18s ease 0.14s, transform 0.18s ease 0.14s, color 0.15s",
                                    pointerEvents: "none",
                                }}>
                                    {label}
                                </span>
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse Toggle */}
            <div style={{
                padding: "14px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                justifyContent: "flex-end",
                flexShrink: 0,
            }}>
                <button
                    onClick={() => setCollapsed(c => !c)}
                    style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#888", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.15s, color 0.15s",
                        flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(238,124,43,0.12)"; e.currentTarget.style.color = "#ee7c2b"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#888"; }}
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

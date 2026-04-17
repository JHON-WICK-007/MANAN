import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import Dashboard from "../Dashboard/Dashboard";
import AdminReservations from "../Reservations/AdminReservations";
import AdminTables from "../Tables/AdminTables";
import AdminMenu from "../Menu/AdminMenu";
import AdminOrders from "../Orders/AdminOrders";
import AdminCustomers from "../Customers/AdminCustomers";
import AdminMessages from "../Messages/AdminMessages";
import AdminAnalytics from "../Analytics/AdminAnalytics";
import AdminSettings from "../Settings/AdminSettings";

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(() => {
        try { return localStorage.getItem("admin_sidebar_collapsed") === "true"; } catch { return false; }
    });

    const toggleCollapsed = (val) => {
        setCollapsed(val);
        try { localStorage.setItem("admin_sidebar_collapsed", String(val)); } catch {}
    };

    return (
        /* Full viewport height, no outer scroll — only content area scrolls */
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>
            <Sidebar collapsed={collapsed} setCollapsed={toggleCollapsed} />

            {/* Content column — fills remaining width, scrolls independently */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
                <TopHeader />
                <main className="hide-scrollbar" style={{ padding: "32px 32px", flex: 1, overflowY: "auto" }}>
                    <Routes>
                        <Route path="dashboard"    element={<Dashboard />} />
                        <Route path="reservations" element={<AdminReservations />} />
                        <Route path="tables"       element={<AdminTables />} />
                        <Route path="menu"         element={<AdminMenu />} />
                        <Route path="orders"       element={<AdminOrders />} />
                        <Route path="customers"    element={<AdminCustomers />} />
                        <Route path="messages"     element={<AdminMessages />} />
                        <Route path="analytics"    element={<AdminAnalytics />} />
                        <Route path="settings"     element={<AdminSettings />} />
                        <Route path="*"            element={<Dashboard />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

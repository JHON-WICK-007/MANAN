import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const DUMMY_USER = {
    _id: "u1",
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43210",
    address: "123 Main Street, Bandra West, Mumbai - 400050",
    role: "customer"
};

const DUMMY_ORDERS = [
    {
        id: "LM-88219",
        title: "The Autumn Degustation Menu",
        items: "Portobello Truffle Tart, Roasted Root Velouté, Saffron Risotto",
        date: "Oct 24, 2024",
        price: "₹8,450.00",
        status: "Delivered",
        statusColor: "green"
    },
    {
        id: "LM-88104",
        title: "Signature Seafood Platter",
        items: "Grilled Lobster, Scallops in Garlic Butter, Tiger Prawns",
        date: "Oct 18, 2024",
        price: "₹12,200.00",
        status: "Delivered",
        statusColor: "green"
    },
    {
        id: "LM-87955",
        title: "Wagyu Steak & Red Wine Pair",
        items: "A5 Wagyu Ribeye, Truffle Mash, Vintage Cabernet",
        date: "Oct 12, 2024",
        price: "₹15,400.00",
        status: "Cancelled",
        statusColor: "red"
    }
];

const DUMMY_RESERVATIONS = [
    {
        id: "RES-9934",
        title: "Chef's Table Experience",
        details: "2 Guests • CT-01 (Kitchen View)",
        time: "08:00 PM",
        date: "Nov 02, 2024",
        status: "Pending",
        statusColor: "yellow"
    },
    {
        id: "RES-9912",
        title: "Dinner for Four",
        details: "4 Guests • T-12 (Corner View)",
        time: "07:30 PM",
        date: "Oct 26, 2024",
        status: "Confirmed",
        statusColor: "green"
    },
    {
        id: "RES-9821",
        title: "Business Lunch",
        details: "6 Guests • Private Dining Room",
        time: "01:00 PM",
        date: "Oct 15, 2024",
        status: "Cancelled",
        statusColor: "red"
    }
];

const Profile = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("Profile");
    const [isEditing, setIsEditing] = useState(false);
    const [hoveredTab, setHoveredTab] = useState(null);
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        userEmailText: "",
        phone: "",
        address: ""
    });
    const [hoveredDetail, setHoveredDetail] = useState(false);
    const [hoveredReorder, setHoveredReorder] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedUser = { ...user, profileImage: reader.result };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            setUser(DUMMY_USER);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleEditClick = () => {
        const first = user.name.split(" ")[0];
        const last = user.name.split(" ").slice(1).join(" ");
        setEditForm({
            firstName: first || "",
            lastName: last || "",
            email: user.email || "",
            phone: user.phone || "+91 98765 43210",
            address: user.address || "123 Main Street, Bandra West, Mumbai - 400050"
        });
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        const updatedUser = {
            ...user,
            name: `${editForm.firstName} ${editForm.lastName}`.trim(),
            email: editForm.email,
            phone: editForm.phone,
            address: editForm.address
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    if (!user) return null;

    // Helper for initials
    const getInitials = (name) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    const EmptyOrdersState = () => (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
            <span className="material-icons text-6xl text-stone-700 mb-6 drop-shadow-md">history</span>
            <h2 className="text-2xl text-white font-bold mb-2">No Past Orders Found</h2>
            <p className="text-stone-400 max-w-sm leading-relaxed">You haven't placed any orders yet. Visit our menu to discover your next favorite dish.</p>
        </div>
    );

    const EmptyReservationsState = () => (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <span className="material-icons text-6xl text-stone-700 mb-6 drop-shadow-md">event_note</span>
            <h2 className="text-2xl text-white font-bold mb-2">No Reservations Found</h2>
            <p className="text-stone-400 max-w-sm leading-relaxed">You haven't made any bookings yet. Secure your table at Lumière for an unforgettable culinary journey.</p>
        </div>
    );

    return (
        <main className="min-h-screen pt-28 px-4 max-w-[1100px] mx-auto space-y-12 mb-20 font-display">
            {/* SECTION 1: PROFILE HEADER CARD */}
            <section className="glass rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_15px_rgba(238,124,43,0.15)] relative">
                <div className="absolute top-6 right-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                        style={{ color: '#ef4444', transition: 'color 0.2s ease' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                        onMouseLeave={e => e.currentTarget.style.color = '#ef4444'}
                    >
                        <span className="material-icons text-lg">logout</span>
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>

                <div className="relative flex-shrink-0">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold shadow-[inset_0_-5px_15px_rgba(0,0,0,0.15)] ring-4 ring-primary/20 overflow-hidden">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            getInitials(user.name)
                        )}
                    </div>
                    <button
                        onClick={handlePhotoClick}
                        className="absolute bottom-0 right-0 w-10 h-10 flex items-center justify-center bg-[#1c110c] rounded-full border border-white/20 hover:border-primary transition-all duration-300 group shadow-lg overflow-hidden"
                    >
                        <span className="material-icons text-[18px] text-stone-400 group-hover:text-primary relative z-10">edit</span>
                    </button>
                </div>
                <div className="text-center md:text-left flex-1 mt-4 md:mt-0">
                    <h1 className="text-4xl text-white mb-2 font-bold">{user.name}</h1>
                    <p className="text-stone-400 mb-4">{user.email}</p>
                    <div className="inline-flex items-center px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                        <span className="material-icons text-xs mr-2 text-primary">verified</span>
                        <span className="uppercase tracking-widest text-[10px] text-stone-400 font-bold">Member since: January 2024</span>
                    </div>
                </div>
                <div className="hidden lg:block absolute bottom-8 right-8">
                    <div className="text-right">
                        <p className="uppercase tracking-[0.2em] text-[10px] text-stone-400 mb-1 font-bold">Tier Status</p>
                        <p className="text-3xl text-primary italic font-black tracking-tight" style={{ textShadow: '0 2px 10px rgba(238,124,43,0.3)' }}>Lumière Gold</p>
                    </div>
                </div>
            </section>

            {/* SECTION 2: TAB NAVIGATION */}
            <section className="flex p-1.5 glass rounded-3xl w-full" style={{ gap: '4px' }}>
                {[
                    { name: "Profile", icon: "person" },
                    { name: "Order History", icon: "receipt_long" },
                    { name: "Settings", icon: "settings" },
                ].map(tab => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        onMouseEnter={() => setHoveredTab(tab.name)}
                        onMouseLeave={() => setHoveredTab(null)}
                        style={{
                            flex: 1,
                            height: '44px',
                            padding: '0 16px',
                            borderRadius: '14px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            fontWeight: 600,
                            transition: 'all 0.25s ease',
                            background: activeTab === tab.name
                                ? '#ee7c2b'
                                : hoveredTab === tab.name
                                    ? 'rgba(255,255,255,0.06)'
                                    : 'transparent',
                            color: activeTab === tab.name ? '#1c110c' : hoveredTab === tab.name ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                            boxShadow: activeTab === tab.name ? '0 0 20px rgba(238,124,43,0.35)' : 'none',
                        }}
                    >
                        <span style={{ fontSize: '18px' }} className="material-icons">{tab.icon}</span>
                        {tab.name}
                    </button>
                ))}
            </section>

            {/* PROFILE TAB CONTENT */}
            {activeTab === "Profile" && (
                <section className="space-y-12 animate-fade-in">
                    {/* SECTION 3: PERSONAL INFO */}
                    <div className="glass rounded-3xl p-6 sm:p-10 border border-white/5 hover:border-primary/40 hover:shadow-[0_0_15px_-3px_rgba(238,124,43,0.4)] focus-within:border-primary/40 focus-within:shadow-[0_0_15px_-3px_rgba(238,124,43,0.4)] transition-all duration-300">
                        {/* Fixed-height header row — NEVER changes size */}
                        <div style={{ height: '56px' }} className="flex items-center justify-between mb-10">
                            <h2 style={{ fontSize: '24px', lineHeight: '32px' }} className="text-primary font-bold">Personal Information</h2>

                            {/* Actions container — fixed width so swap never shifts layout */}
                            <div style={{ minWidth: '220px' }} className="flex justify-end items-center gap-3 relative h-[40px]">
                                {/* Edit button — always in DOM */}
                                <button
                                    onClick={handleEditClick}
                                    style={{ height: '40px', padding: '0 18px' }}
                                    className={`inline-flex items-center gap-2 text-sm font-medium text-stone-400 border border-white/10 rounded-3xl transition-all duration-300 absolute right-0
                                        hover:text-primary hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_12px_rgba(238,124,43,0.25)]
                                        ${isEditing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                                >
                                    <span className="material-icons text-sm">edit</span>
                                    Edit
                                </button>

                                {/* Save + Cancel — always in DOM */}
                                <div
                                    style={{ gap: '12px' }}
                                    className={`inline-flex items-center absolute right-0 transition-all ${!isEditing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                                >
                                    <button
                                        onClick={handleCancelEdit}
                                        style={{ height: '40px', padding: '0 18px' }}
                                        className="inline-flex items-center text-sm font-medium text-stone-300 border border-white/10 rounded-3xl hover:text-white hover:border-white/30 hover:bg-white/15 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={(e) => { handleSaveEdit(); e.currentTarget.blur(); }}
                                        style={{ height: '40px', padding: '0 20px' }}
                                        className="inline-flex items-center text-sm font-bold bg-primary text-white rounded-3xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 w-full">
                            {[
                                { label: 'First Name', value: user.name.split(' ')[0], key: 'firstName', type: 'text' },
                                { label: 'Last Name', value: user.name.split(' ').slice(1).join(' ') || '-', key: 'lastName', type: 'text' },
                                { label: 'Email Address', value: user.email, key: 'email', type: 'text' },
                                { label: 'Phone Number', value: user.phone || '+91 98765 43210', key: 'phone', type: 'tel' },
                                { label: 'Address', value: user.address || '123 Main Street, Bandra West, Mumbai - 400050', key: 'address', type: 'text', className: 'md:col-span-2' },
                            ].map(({ label, value, key, type, className }) => (
                                <div key={key} className={`flex flex-col ${className || ''}`} style={{ gap: '8px' }}>
                                    <label style={{ fontSize: '10px', lineHeight: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, color: 'white' }}>
                                        {label}
                                    </label>
                                    <div style={{ position: 'relative', width: '100%', height: '52px' }}>
                                        {/* View text — identical geometry to input */}
                                        <p style={{
                                            position: 'absolute', top: 0, left: 0,
                                            width: '100%', height: '52px',
                                            display: 'flex', alignItems: 'center',
                                            fontSize: '16px', lineHeight: '24px',
                                            padding: '0 16px',
                                            fontFamily: 'inherit', fontWeight: 400,
                                            color: 'rgb(161,161,170)', background: 'transparent',
                                            transition: 'opacity 0.25s',
                                            opacity: isEditing ? 0 : 1,
                                            pointerEvents: isEditing ? 'none' : 'auto',
                                        }}>
                                            {value}
                                        </p>
                                        {/* Edit input — identical geometry to view text */}
                                        <input
                                            type={type}
                                            value={editForm[key] || ''}
                                            autoComplete="new-password"
                                            name={key}
                                            onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                                            style={{
                                                position: 'absolute', top: 0, left: 0,
                                                width: '100%', height: '52px',
                                                fontSize: '16px', lineHeight: '24px',
                                                padding: '0 16px',
                                                fontFamily: 'inherit', fontWeight: 400,
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxSizing: 'border-box',
                                                transition: 'opacity 0.2s ease',
                                                opacity: isEditing ? 1 : 0,
                                                pointerEvents: isEditing ? 'auto' : 'none',
                                            }}
                                            className="field-input"
                                        />
                                    </div>
                                </div>
                            ))}


                        </div>
                    </div>

                    {/* SECTION 4: DINING PREFERENCES */}
                    <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5 transition-all duration-300">
                        <h2 className="text-xl text-primary font-bold mb-6">Dining Preferences</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Dietary Card */}
                            <div className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/40 hover:shadow-[0_0_15px_-3px_rgba(238,124,43,0.4)] transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-4">
                                    <span className="material-icons text-primary group-hover:scale-125 transition-transform duration-300">eco</span>
                                </div>
                                <h3 className="text-[10px] uppercase tracking-widest text-stone-400 mb-1 font-bold">Dietary</h3>
                                <p className="text-xl text-white font-bold group-hover:text-primary transition-colors duration-300">Vegetarian</p>
                            </div>
                            {/* Spice Card */}
                            <div className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/40 hover:shadow-[0_0_15px_-3px_rgba(238,124,43,0.4)] transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-4">
                                    <span className="material-icons text-primary group-hover:scale-125 transition-transform duration-300">local_fire_department</span>
                                </div>
                                <h3 className="text-[10px] uppercase tracking-widest text-stone-400 mb-1 font-bold">Spice Level</h3>
                                <p className="text-xl text-white font-bold group-hover:text-primary transition-colors duration-300">Medium</p>
                            </div>
                            {/* Table Card */}
                            <div className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/40 hover:shadow-[0_0_15px_-3px_rgba(238,124,43,0.4)] transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-4">
                                    <span className="material-icons text-primary group-hover:scale-125 transition-transform duration-300">table_restaurant</span>
                                </div>
                                <h3 className="text-[10px] uppercase tracking-widest text-stone-400 mb-1 font-bold">Favorite Table</h3>
                                <p className="text-xl text-white font-bold group-hover:text-primary transition-colors duration-300">T-12 (Corner View)</p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: RECENT RESERVATIONS */}
                    <div className="space-y-6">
                        <h2 className="text-2xl text-primary px-2 font-bold">Recent Reservations</h2>
                        {DUMMY_RESERVATIONS.length > 0 ? (
                            <div className="space-y-4">
                                {DUMMY_RESERVATIONS.slice(0, 4).map((res) => (
                                    <div key={res.id} className="glass rounded-3xl overflow-hidden border-l-[3px] border-l-primary/90 border-t border-r border-b border-t-white/5 border-r-white/5 border-b-white/5 hover:border-t-primary/40 hover:border-r-primary/40 hover:border-b-primary/40 hover:shadow-[0_0_15px_-3px_rgba(238,124,43,0.4)] transition-all duration-300 group">
                                        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Booking #{res.id}</span>
                                                    <span className={`px-2.5 py-0.5 ${res.statusColor === 'green' ? 'bg-green-500/10 text-green-400 border-green-500/20' : res.statusColor === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' : res.statusColor === 'yellow' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'} text-[9px] uppercase font-bold tracking-widest rounded-full border`}>
                                                        {res.status}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl text-white mb-1 font-bold group-hover:text-primary transition-colors duration-300">{res.title}</h4>
                                                    <p className="text-stone-400 text-sm">{res.details}</p>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-6 text-stone-400">
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-icons text-base">calendar_month</span>
                                                        <span className="text-xs font-semibold pr-1">{res.date}</span>
                                                        <span className="material-icons text-base ml-1">schedule</span>
                                                        <span className="text-xs font-semibold">{res.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center items-start md:items-end gap-6 border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                                                <div className="flex gap-4">
                                                    <button
                                                        onMouseEnter={() => setHoveredReorder(res.id)}
                                                        onMouseLeave={() => setHoveredReorder(null)}
                                                        style={{
                                                            height: '40px',
                                                            padding: '0 24px',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '12px',
                                                            fontSize: '11px',
                                                            fontWeight: (res.status === 'Pending' || res.status === 'Confirmed') ? 700 : 800,
                                                            letterSpacing: '0.1em',
                                                            textTransform: 'uppercase',
                                                            transition: 'all 0.25s ease',
                                                            backgroundColor: (res.status === 'Pending' || res.status === 'Confirmed')
                                                                ? (hoveredReorder === res.id ? 'rgba(238, 124, 43, 0.12)' : 'rgba(255, 255, 255, 0.04)')
                                                                : (hoveredReorder === res.id ? '#d96e1f' : '#ee7c2b'),
                                                            border: (res.status === 'Pending' || res.status === 'Confirmed')
                                                                ? `2px solid ${hoveredReorder === res.id ? 'rgba(238, 124, 43, 0.8)' : 'rgba(238, 124, 43, 0.5)'}`
                                                                : '2px solid transparent',
                                                            color: '#ffffff',
                                                            boxShadow: (res.status === 'Pending' || res.status === 'Confirmed')
                                                                ? (hoveredReorder === res.id ? '0 0 20px rgba(238, 124, 43, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0,0,0,0.25)')
                                                                : (hoveredReorder === res.id ? '0 0 30px rgba(238, 124, 43, 0.45), 0 6px 16px rgba(0, 0, 0, 0.4)' : '0 2px 10px rgba(238, 124, 43, 0.2)'),
                                                            transform: hoveredReorder === res.id ? 'translateY(-2px)' : 'translateY(0)',
                                                            backfaceVisibility: 'hidden',
                                                            WebkitBackfaceVisibility: 'hidden',
                                                            transformStyle: 'preserve-3d',
                                                            WebkitFontSmoothing: 'antialiased',
                                                            MozOsxFontSmoothing: 'grayscale',
                                                            willChange: 'transform, box-shadow, background-color',
                                                            backdropFilter: (res.status === 'Pending' || res.status === 'Confirmed') ? 'blur(8px)' : 'none',
                                                            WebkitBackdropFilter: (res.status === 'Pending' || res.status === 'Confirmed') ? 'blur(8px)' : 'none',
                                                        }}
                                                    >
                                                        {(res.status === 'Pending' || res.status === 'Confirmed') ? 'Cancel' : 'Rebook'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass rounded-3xl border border-white/5 border-dashed py-10">
                                <EmptyReservationsState />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "Settings" && (
                <section className="space-y-12 animate-fade-in">
                    {/* SECTION 6: SETTINGS */}
                    <div className="glass rounded-3xl p-6 sm:p-10">
                        <h2 className="text-2xl text-primary mb-10 font-bold">Notification Settings</h2>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between py-2 border-b border-white/5 pb-6">
                                <div className="space-y-1 pr-4">
                                    <p className="text-white font-bold">Email Notifications</p>
                                    <p className="text-xs text-stone-400">Receive reservation confirmations and order updates via email.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner shadow-black/30"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-white/5 pb-6">
                                <div className="space-y-1 pr-4">
                                    <p className="text-white font-bold">SMS Notifications</p>
                                    <p className="text-xs text-stone-400">Get real-time updates on your table status and limited offers.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner shadow-black/30"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-1 pr-4">
                                    <p className="text-white font-bold">Marketing Communications</p>
                                    <p className="text-xs text-stone-400">Receive invitations to seasonal tasting events and private dining offers.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner shadow-black/30"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 7: DANGER ZONE */}
                    <div className="glass rounded-3xl p-10 border-l-4 border-l-red-500/80 border-t border-r border-b border-white/5 bg-gradient-to-br from-red-500/[0.04] to-transparent relative overflow-hidden group/danger">
                        <div className="flex flex-col md:flex-row gap-10 md:items-center justify-between relative z-10">
                            <div className="space-y-4">
                                <h2 className="text-3xl text-red-500 font-black italic uppercase tracking-tighter flex items-center gap-4 drop-shadow-[0_2px_12px_rgba(239,68,68,0.25)]">
                                    <span className="material-icons text-4xl group-hover/danger:rotate-12 transition-transform duration-500">report_problem</span>
                                    Danger Zone
                                </h2>
                                <div className="space-y-2">
                                    <h3 className="text-xl text-white font-bold tracking-tight">Security & Privacy</h3>
                                    <p className="text-sm text-stone-400 max-w-md leading-relaxed">Changing your password will log you out from all other devices. This action is final.</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-5 shrink-0">
                                <button
                                    className="px-8 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border border-white/20 text-white/90 hover:bg-white/10 hover:border-white/40 hover:text-white active:scale-95 backdrop-blur-sm [backface-visibility:hidden] [transform:translateZ(0)] antialiased will-change-[transform,box-shadow,background-color]"
                                >
                                    Change Password
                                </button>
                                <button
                                    className="px-8 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 bg-red-600 border border-transparent hover:bg-red-500 text-white shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_4px_30px_rgba(239,68,68,0.45)] hover:-translate-y-0.5 active:scale-95 [backface-visibility:hidden] [transform:translateZ(0)] antialiased will-change-[transform,box-shadow,background-color]"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ORDER HISTORY TAB */}
            {activeTab === "Order History" && (
                <section className="animate-fade-in space-y-6">
                    {DUMMY_ORDERS.length > 0 ? (
                        <div className="space-y-4">
                            {DUMMY_ORDERS.map((order) => (
                                <div key={order.id} className="glass rounded-3xl overflow-hidden border-l-[3px] border-l-primary/90 border-t border-r border-b border-t-white/5 border-r-white/5 border-b-white/5 hover:border-t-primary/40 hover:border-r-primary/40 hover:border-b-primary/40 hover:shadow-[0_0_15px_-3px_rgba(238,124,43,0.4)] transition-all duration-300 group">
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex flex-wrap items-center gap-4">
                                                <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Order #{order.id}</span>
                                                <span className={`px-2.5 py-0.5 ${order.statusColor === 'green' ? 'bg-green-500/10 text-green-400 border-green-500/20' : order.statusColor === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'} text-[9px] uppercase font-bold tracking-widest rounded-full border`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-xl text-white mb-1 font-bold group-hover:text-primary transition-colors duration-300">{order.title}</h4>
                                                <p className="text-stone-400 text-sm">{order.items}</p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6 text-stone-400">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-icons text-base">calendar_month</span>
                                                    <span className="text-xs font-semibold">{order.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center items-start md:items-end gap-4 border-t md:border-t-0 border-white/10 pt-4 md:pt-0 text-right">
                                            <span className="text-4xl text-primary font-black tracking-tight">{order.price}</span>
                                            <div className="flex gap-4">
                                                <button
                                                    onMouseEnter={() => setHoveredReorder(`tab-${order.id}`)}
                                                    onMouseLeave={() => setHoveredReorder(null)}
                                                    style={{
                                                        height: '40px',
                                                        padding: '0 24px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: '12px',
                                                        fontSize: '11px',
                                                        fontWeight: 800,
                                                        letterSpacing: '0.1em',
                                                        textTransform: 'uppercase',
                                                        backgroundColor: hoveredReorder === `tab-${order.id}` ? '#d96e1f' : '#ee7c2b',
                                                        border: '2px solid transparent',
                                                        color: '#ffffff',
                                                        boxShadow: hoveredReorder === `tab-${order.id}`
                                                            ? '0 0 30px rgba(238,124,43,0.45), 0 6px 16px rgba(0,0,0,0.4)'
                                                            : '0 2px 10px rgba(238,124,43,0.2)',
                                                        transform: hoveredReorder === `tab-${order.id}` ? 'translateY(-2px)' : 'translateY(0)',
                                                        transition: 'all 0.25s ease',
                                                        backfaceVisibility: 'hidden',
                                                        WebkitBackfaceVisibility: 'hidden',
                                                        WebkitFontSmoothing: 'antialiased',
                                                        MozOsxFontSmoothing: 'grayscale',
                                                        willChange: 'transform, box-shadow, background-color',
                                                    }}
                                                >
                                                    Reorder
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass rounded-3xl min-h-[450px] flex items-center justify-center border-dashed border-2 border-white/10">
                            <EmptyOrdersState />
                        </div>
                    )}
                </section>
            )}
        </main>
    );
};

export default Profile;



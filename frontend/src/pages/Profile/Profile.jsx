import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ScrollReveal from "../../components/ScrollReveal";

const DUMMY_USER = {
    _id: "u1",
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43210",
    address: "123 Main Street, Bandra West, Mumbai - 400050",
    role: "customer"
};


const Profile = () => {
    const { user: authUser, token, updateUser, logout } = useAuth();
    const user = authUser || DUMMY_USER;
    const [activeTab, setActiveTab] = useState("Profile");
    const [isEditing, setIsEditing] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
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

    const [reservations, setReservations] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            setIsLoading(true);
            try {
                // Fetch reservations
                const resResponse = await fetch("/api/reservations/my", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (resResponse.ok) {
                    const resData = await resResponse.json();
                    
                    const formattedReservations = resData.data.map(r => ({
                        id: r.bookingId || r._id,
                        dbId: r._id,
                        title: "Restaurant Reservation",
                        details: `${r.guests} Guests • ${r.specialRequests || 'Standard'}`,
                        time: r.time,
                        date: r.date,
                        status: r.status,
                        statusColor: r.status === 'Confirmed' ? 'green' : (r.status === 'Cancelled' ? 'red' : 'yellow')
                    }));

                    setReservations(formattedReservations);
                }

                // Fetch extended profile data (phone, address, image)
                const profResponse = await fetch("/api/profile", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (profResponse.ok) {
                    const profData = await profResponse.json();
                    if (profData.success) {
                        updateUser(profData.data);
                    }
                }

                // Fetch orders
                const ordResponse = await fetch("/api/orders/my", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (ordResponse.ok) {
                    const ordData = await ordResponse.json();
                    
                    const formattedOrders = ordData.data.map(o => {
                        const itemsStr = o.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
                        const options = { year: 'numeric', month: 'short', day: 'numeric' };
                        const formattedDate = new Date(o.createdAt).toLocaleDateString('en-US', options);

                        return {
                            id: o.orderId || o._id,
                            dbId: o._id,
                            title: o.items.length > 0 ? o.items[0].name + (o.items.length > 1 ? ` & ${o.items.length - 1} more` : '') : "Order",
                            items: itemsStr,
                            date: formattedDate,
                            price: `₹${o.totalAmount.toFixed(2)}`,
                            status: o.status,
                            statusColor: o.status === 'Delivered' ? 'green' : (o.status === 'Cancelled' ? 'red' : 'yellow')
                        };
                    });

                    setOrders(formattedOrders);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setReservations([]);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate]);

    const handleCancelReservation = async (id) => {
        // Try to cancel via API if it's a real reservation
        const realRes = reservations.find(r => r.id === id);
        
        if (realRes && realRes.dbId) {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/reservations/${realRes.dbId}/cancel`, {
                    method: "PATCH",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "Cancelled", statusColor: "red" } : r));
                    return;
                }
            } catch (error) {
                console.error("Failed to cancel API reservation", error);
            }
        }
        
        // Fallback for local/dummy reservations
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "Cancelled", statusColor: "red" } : r));
        try {
            const stored = JSON.parse(localStorage.getItem("reservations") || "[]");
            const updated = stored.map(r => r.id === id ? { ...r, status: "Cancelled", statusColor: "red" } : r);
            localStorage.setItem("reservations", JSON.stringify(updated));
        } catch { /* noop */ }
    };

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const localPreview = URL.createObjectURL(file);
            updateUser({ profileImage: localPreview });
            setIsUploadingImage(true);

            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result;
                try {
                    const res = await fetch("/api/profile", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                        body: JSON.stringify({ profileImage: base64Image }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        updateUser(data.user);
                    }
                } catch (err) {
                    console.error("Failed to update profile image", err);
                } finally {
                    setIsUploadingImage(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        logout();
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

    const handleSaveEdit = async () => {
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    name: `${editForm.firstName} ${editForm.lastName}`.trim(),
                    phone: editForm.phone,
                    address: editForm.address
                })
            });
            const data = await res.json();
            if (data.success) {
                updateUser(data.user);
            }
        } catch (err) {
            console.error("Failed to update profile", err);
        }
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
            <ScrollReveal as="section" className="glass rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_15px_rgba(238,124,43,0.15)] relative">
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
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold shadow-[inset_0_-5px_15px_rgba(0,0,0,0.15)] ring-4 ring-primary/20 overflow-hidden relative">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            getInitials(user.name)
                        )}
                        
                        {isUploadingImage && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
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
            </ScrollReveal>

            {/* SECTION 2: TAB NAVIGATION */}
            <ScrollReveal delay={1} as="section" className="flex p-1.5 glass rounded-3xl w-full" style={{ gap: '4px' }}>
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
            </ScrollReveal>

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
                    <div className="space-y-5">
                        <h2 className="text-2xl text-primary px-1 font-bold">Recent Reservations</h2>
                        {reservations.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reservations.map((res) => {
                                    const isActive = res.status === 'Pending' || res.status === 'Confirmed';
                                    const ss = {
                                        green: { dot: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', text: '#4ade80' },
                                        red: { dot: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#f87171' },
                                        yellow: { dot: '#ee7c2b', bg: 'rgba(238,124,43,0.08)', border: 'rgba(238,124,43,0.2)', text: '#ee7c2b' },
                                        blue: { dot: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', text: '#60a5fa' },
                                    }[res.statusColor] || { dot: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', text: '#60a5fa' };

                                    const detailParts = (res.details || '').split('•').map(s => s.trim());
                                    const guestsBadge = detailParts[0] || '';
                                    const tableBadge = detailParts[1] || '';

                                    return (
                                        <div
                                            key={res.id}
                                            className="group relative flex flex-col rounded-2xl overflow-hidden cursor-default"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(30,18,8,0.95) 0%, rgba(20,12,4,0.98) 100%)',
                                                border: 'none',
                                                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                                                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(238,124,43,0.12), 0 0 32px -8px rgba(238,124,43,0.25)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'; }}
                                        >
                                            {/* Orange top accent line */}
                                            <div style={{ height: '2px', background: 'linear-gradient(90deg, #ee7c2b 0%, rgba(238,124,43,0.3) 60%, transparent 100%)' }} />

                                            <div className="flex flex-col flex-1 p-6">
                                                {/* TOP SECTION */}
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        {/* Booking ref + status */}
                                                        <div className="flex items-center gap-2.5 mb-2">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-primary/90">#{res.id}</span>
                                                            <span
                                                                className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                                                                style={{ background: ss.bg, border: `1px solid ${ss.border}`, color: ss.text }}
                                                            >
                                                                {res.status}
                                                            </span>
                                                        </div>
                                                        {/* Title */}
                                                        <h4 className="text-[18px] font-extrabold text-white leading-tight group-hover:text-primary transition-colors duration-200 truncate">
                                                            {res.title}
                                                        </h4>
                                                    </div>

                                                    {/* Action button — top right */}
                                                    <button
                                                        onClick={() => isActive ? handleCancelReservation(res.id) : navigate('/table')}
                                                        className={`shrink-0 h-[36px] px-[18px] inline-flex items-center gap-1.5 rounded-[10px] text-[10px] font-bold tracking-[0.12em] uppercase transition-all duration-300 ${
                                                            isActive
                                                                ? 'bg-white/5 hover:bg-red-500/10 border border-transparent hover:border-red-500/50 text-stone-400 hover:text-red-400'
                                                                : 'bg-primary hover:bg-[#d96e1f] border border-transparent text-white shadow-[0_4px_16px_rgba(238,124,43,0.3)] hover:shadow-[0_4px_24px_rgba(238,124,43,0.5)]'
                                                        }`}
                                                    >
                                                        {isActive ? 'Cancel' : (
                                                            <>
                                                                Rebook
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                                </svg>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* DETAILS SECTION (Chips) */}
                                                <div className="flex flex-col gap-3 mt-4">
                                                    {/* Guest & Table row */}
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        {guestsBadge && (
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                                                <span className="material-icons text-primary/50" style={{ fontSize: '13px' }}>group</span>
                                                                <span className="text-[11px] font-semibold text-stone-400">{guestsBadge}</span>
                                                            </div>
                                                        )}
                                                        {tableBadge && (
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                                                <span className="material-icons text-primary/50" style={{ fontSize: '13px' }}>table_restaurant</span>
                                                                <span className="text-[11px] font-semibold text-stone-400">{tableBadge}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Date & Time row */}
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                                            <span className="material-icons text-primary/50" style={{ fontSize: '13px' }}>calendar_today</span>
                                                            <span className="text-[11px] font-semibold text-stone-400">{res.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                                            <span className="material-icons text-primary/50" style={{ fontSize: '13px' }}>schedule</span>
                                                            <span className="text-[11px] font-semibold text-stone-400">{res.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
                                    className="px-8 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 bg-red-600 border border-transparent hover:bg-red-500 text-white shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_4px_30px_rgba(239,68,68,0.45)] active:scale-95 [backface-visibility:hidden] [transform:translateZ(0)] antialiased will-change-[transform,box-shadow,background-color]"
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
                <section className="animate-fade-in space-y-5">
                    {orders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {orders.map((order) => {
                                const ss = ({
                                    green: { dot: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', text: '#4ade80' },
                                    red: { dot: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#f87171' },
                                    blue: { dot: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', text: '#60a5fa' },
                                })[order.statusColor] || { dot: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', text: '#60a5fa' };

                                return (
                                    <div
                                        key={order.id}
                                        className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-default"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(30,18,8,0.95) 0%, rgba(20,12,4,0.98) 100%)',
                                            border: 'none',
                                            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                                            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(238,124,43,0.12), 0 0 32px -8px rgba(238,124,43,0.25)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
                                        }}
                                    >
                                        {/* Orange top accent line */}
                                        <div style={{ height: '2px', flexShrink: 0, background: 'linear-gradient(90deg, #ee7c2b 0%, rgba(238,124,43,0.3) 60%, transparent 100%)' }} />

                                        {/* Card body */}
                                        <div className="flex flex-col flex-1 p-6 gap-4">

                                            {/* ── HEADER: order ID + status + price ── */}
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-primary/90">
                                                        #{order.id}
                                                    </span>
                                                    <span
                                                        className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0"
                                                        style={{ background: ss.bg, border: `1px solid ${ss.border}`, color: ss.text }}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </div>
                                                {/* Price */}
                                                <span className="text-lg font-black text-primary tracking-tight shrink-0">{order.price}</span>
                                            </div>

                                            {/* ── TITLE ── */}
                                            <div>
                                                <h4 className="text-[17px] font-extrabold text-white leading-snug group-hover:text-primary transition-colors duration-200">
                                                    {order.title}
                                                </h4>
                                            </div>

                                            {/* ── ITEMS badge ── */}
                                            <div>
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-stone-400"
                                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                                    <span className="material-icons text-primary/70" style={{ fontSize: '11px' }}>restaurant_menu</span>
                                                    {order.items}
                                                </span>
                                            </div>

                                            {/* ── DIVIDER ── */}
                                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

                                            {/* ── FOOTER: date pill + reorder button ── */}
                                            <div className="flex items-center justify-between gap-3 mt-auto">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-stone-400"
                                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                    <span className="material-icons text-primary/40" style={{ fontSize: '12px' }}>calendar_today</span>
                                                    {order.date}
                                                </span>

                                                <button
                                                    className="shrink-0 h-[30px] px-[14px] inline-flex items-center gap-1.5 rounded-lg text-[9px] font-bold tracking-[0.12em] uppercase transition-all duration-300 bg-primary hover:bg-[#d96e1f] border border-transparent text-white shadow-[0_2px_12px_rgba(238,124,43,0.3)] hover:shadow-[0_4px_20px_rgba(238,124,43,0.5)]"
                                                >
                                                    Reorder
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="glass rounded-3xl min-h-[450px] flex items-center justify-center border-dashed border-2 border-white/10">
                            <EmptyOrdersState />
                        </div>
                    )}
                </section>
            )}

            {/* Back to Home Link */}
            <ScrollReveal delay={0.4} className="mt-20 mb-4 flex justify-center w-full">
                <Link to="/" className="flex items-center gap-2 text-stone-400 hover:text-primary transition-colors duration-300 font-medium text-[15px]">
                    <span className="material-icons text-[20px]">arrow_back</span>
                    Back to Home
                </Link>
            </ScrollReveal>
        </main>
    );
};

export default Profile;
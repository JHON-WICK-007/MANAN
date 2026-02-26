import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DUMMY_USER = { _id: "u1", name: "Manan Vasani", email: "manan@lumiere.com", role: "customer" };

const DUMMY_RESERVATIONS = [
    { _id: "r1", date: "2026-02-20", time: "19:00", guests: 4, status: "Confirmed", specialRequests: "Window table" },
    { _id: "r2", date: "2026-03-05", time: "20:30", guests: 2, status: "Pending", specialRequests: "" },
    { _id: "r3", date: "2026-01-10", time: "18:00", guests: 6, status: "Cancelled", specialRequests: "Birthday celebration" },
];

const Profile = () => {
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            setUser(DUMMY_USER);
        }

        const token = localStorage.getItem("token");
        if (token) {
            fetch("/api/reservations/my", { headers: { Authorization: `Bearer ${token}` } })
                .then((r) => r.json())
                .then((data) => { if (data.success && data.data.length) setReservations(data.data); else setReservations(DUMMY_RESERVATIONS); })
                .catch(() => setReservations(DUMMY_RESERVATIONS));
        } else {
            setReservations(DUMMY_RESERVATIONS);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) return null;

    return (
        <main className="min-h-screen">
            <div className="max-w-5xl mx-auto px-6 md:px-8 py-12">
                {/* Profile Card */}
                <div className="glass rounded-2xl p-8 mb-10">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-icons text-5xl">person</span>
                        </div>
                        <div className="text-center sm:text-left flex-grow">
                            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                            <p className="text-stone-400">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                                {user.role}
                            </span>
                        </div>
                        <button onClick={handleLogout} className="px-6 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-all text-sm font-medium">
                            <span className="material-icons text-sm mr-1 align-middle">logout</span>Sign Out
                        </button>
                    </div>
                </div>

                {/* Reservations */}
                <h2 className="text-2xl font-bold text-white mb-6">Your Reservations</h2>
                <div className="space-y-4">
                    {reservations.map((r) => (
                        <div key={r._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-xl bg-white/[0.03] border border-white/5">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-icons text-primary">event</span>
                                    <span className="text-white font-semibold">{new Date(r.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-stone-400">
                                    <span className="flex items-center gap-1"><span className="material-icons text-sm">schedule</span>{r.time}</span>
                                    <span className="flex items-center gap-1"><span className="material-icons text-sm">group</span>{r.guests} Guests</span>
                                </div>
                            </div>
                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${r.status === "Confirmed" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                r.status === "Cancelled" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                    "bg-primary/10 text-primary border border-primary/20"
                                }`}>
                                {r.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Profile;

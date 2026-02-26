import { useState } from "react";

const timeSlots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Table = () => {
    const [guests, setGuests] = useState(4);
    const [selectedTime, setSelectedTime] = useState("19:00");
    const [selectedDate, setSelectedDate] = useState(null);
    const [specialReq, setSpecialReq] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [bookingRef, setBookingRef] = useState("");

    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(year - 1); }
        else setMonth(month - 1);
    };
    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(year + 1); }
        else setMonth(month + 1);
    };

    const handleReserve = async () => {
        if (!selectedDate) return;
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ date: dateStr, time: selectedTime, guests, specialRequests: specialReq }),
            });
            const data = await res.json();
            if (data.success) {
                setBookingRef(data.data._id?.slice(-8)?.toUpperCase() || "XXXX");
                setShowModal(true);
            }
        } catch { }
    };

    return (
        <main className="min-h-screen relative overflow-x-hidden">
            {/* Decorative Glows */}
            <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(238,124,43,0.15)_0%,rgba(238,124,43,0)_70%)] -z-10"></div>
            <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(238,124,43,0.15)_0%,rgba(238,124,43,0)_70%)] -z-10"></div>

            <div className="max-w-5xl mx-auto px-6 md:px-8 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Book Your Table</h1>
                    <p className="text-stone-400 max-w-lg mx-auto">Experience culinary excellence. Secure your evening with us in just a few simple steps.</p>
                </div>

                <div className="glass w-full rounded-2xl p-8 shadow-2xl">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-12 space-x-4 md:space-x-12">
                        {[{ icon: "event", label: "Date", active: true }, { icon: "schedule", label: "Time", active: !!selectedDate }, { icon: "group", label: "Guests", active: !!selectedTime }].map((step, i, arr) => (
                            <div key={step.label} className="flex items-center gap-4 md:gap-12">
                                <div className={`flex flex-col items-center ${step.active ? "" : "opacity-60"}`}>
                                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${step.active ? "border-primary bg-primary text-white shadow-[0_0_15px_rgba(238,124,43,0.3)]" : "border-white/20"}`}>
                                        <span className="material-icons text-sm">{step.icon}</span>
                                    </div>
                                    <span className={`text-xs uppercase tracking-tighter font-semibold ${step.active ? "text-primary" : ""}`}>{step.label}</span>
                                </div>
                                {i < arr.length - 1 && <div className={`h-[2px] w-12 md:w-20 ${step.active ? "bg-primary/30" : "bg-white/10"}`}></div>}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Calendar */}
                        <div className="lg:col-span-7">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">{monthName} {year}</h3>
                                <div className="flex space-x-2">
                                    <button onClick={prevMonth} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                        <span className="material-icons text-sm">chevron_left</span>
                                    </button>
                                    <button onClick={nextMonth} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                        <span className="material-icons text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-stone-500 mb-4">
                                {daysOfWeek.map((d) => <div key={d}>{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="aspect-square"></div>)}
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                    const isPast = year === today.getFullYear() && month === today.getMonth() && day < today.getDate();
                                    return (
                                        <button key={day} disabled={isPast} onClick={() => setSelectedDate(day)}
                                            className={`aspect-square flex items-center justify-center rounded-xl transition-colors text-sm ${isPast ? "text-stone-600 cursor-not-allowed" :
                                                selectedDate === day ? "bg-primary/20 border border-primary/50 text-white font-bold" :
                                                    "hover:bg-white/5 cursor-pointer"
                                                }`}>
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Time + Guests */}
                        <div className="lg:col-span-5 flex flex-col space-y-8">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-500 mb-4">Number of Guests</h3>
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => setGuests(Math.max(1, guests - 1))}
                                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <span className="material-icons">remove</span>
                                    </button>
                                    <div className="flex-1 text-center py-2 text-2xl font-bold text-white border-b-2 border-primary/30">
                                        {String(guests).padStart(2, "0")}
                                    </div>
                                    <button onClick={() => setGuests(guests + 1)}
                                        className="w-12 h-12 rounded-lg bg-primary border border-primary flex items-center justify-center hover:bg-primary/80 transition-colors">
                                        <span className="material-icons text-white">add</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-500 mb-4">Select Time</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {timeSlots.map((t) => (
                                        <button key={t} onClick={() => setSelectedTime(t)}
                                            className={`py-2 text-sm rounded border transition-all ${selectedTime === t ? "border-primary bg-primary/20 text-white" : "border-white/10 bg-white/5 hover:border-primary"
                                                }`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-500 mb-4">Special Requests</h3>
                                <textarea value={specialReq} onChange={(e) => setSpecialReq(e.target.value)} rows={3} placeholder="Any dietary needs or preferences..."
                                    className="input-dark resize-none text-sm" />
                            </div>

                            <button onClick={handleReserve}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 transition-colors">
                                <span>RESERVE NOW</span>
                                <span className="material-icons">arrow_forward</span>
                            </button>
                            <p className="text-[10px] text-center text-stone-500 uppercase tracking-[0.2em]">Free cancellation up to 24h before</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-dark/80 backdrop-blur-md">
                    <div className="glass max-w-md w-full rounded-2xl p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-primary/20">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                            <div className="absolute inset-0 border-2 border-primary rounded-full animate-ping opacity-20"></div>
                            <span className="material-icons text-5xl text-primary">check_circle</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Reservation Confirmed!</h2>
                        <p className="text-stone-400 mb-8">We've sent the confirmation details to your registered email.</p>
                        <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
                            <span className="text-xs text-stone-500 uppercase tracking-widest block mb-1">Booking Reference ID</span>
                            <span className="text-2xl font-mono text-primary font-bold">#{bookingRef}</span>
                        </div>
                        <button onClick={() => setShowModal(false)} className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-colors">
                            Back to Homepage
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Table;

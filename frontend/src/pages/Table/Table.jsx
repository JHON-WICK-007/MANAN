import { useState, useRef, useEffect } from "react";

const timeSlots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Table = () => {
    const [guests, setGuests] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookingStep, setBookingStep] = useState(0); // 0 = nothing, 1 = date, 2 = time, 3 = guests
    const [specialReq, setSpecialReq] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);
    const [bookingRef, setBookingRef] = useState("");
    const [isEditingGuests, setIsEditingGuests] = useState(false);
    const [guestInput, setGuestInput] = useState("");

    // Auto-focus refs
    const timeSection = useRef(null);
    const guestSection = useRef(null);
    const guestInputRef = useRef(null);

    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());

    // Helper function to check if a date is in the past (uses local timezone)
    const isDateInPast = (checkYear, checkMonth, checkDay) => {
        const checkDate = new Date(checkYear, checkMonth, checkDay);
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return checkDate < todayDateOnly;
    };

    // Helper function to check if a time is in the past for today
    const isTimeInPastForToday = (timeStr) => {
        if (selectedDate !== today.getDate() || year !== today.getFullYear() || month !== today.getMonth()) {
            return false; // Not today, so time is not in the past
        }
        const [hours, minutes] = timeStr.split(":").map(Number);
        const currentHours = today.getHours();
        const currentMinutes = today.getMinutes();
        return hours < currentHours || (hours === currentHours && minutes <= currentMinutes);
    };

    // Format selected date for display
    const formatSelectedDate = () => {
        if (!selectedDate) return "";
        const dateObj = new Date(year, month, selectedDate);
        const monthNameStr = dateObj.toLocaleString("default", { month: "short" });
        return `${monthNameStr} ${selectedDate}, ${year}`;
    };

    // Auto-focus next section when selections are made
    useEffect(() => {
        if (selectedDate && !selectedTime && timeSection.current) {
            timeSection.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [selectedDate]);

    useEffect(() => {
        if (selectedTime && !guests && guestSection.current) {
            guestSection.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [selectedTime]);

    // Update booking step based on actual selections (independent fields)
    useEffect(() => {
        let step = 0;
        if (selectedDate) step = Math.max(step, 1);
        if (selectedTime) step = Math.max(step, 2);
        if (guests !== null && guests > 0) step = Math.max(step, 3);
        setBookingStep(step);
    }, [selectedDate, selectedTime, guests]);

    // Focus input when entering edit mode
    useEffect(() => {
        if (isEditingGuests && guestInputRef.current) {
            guestInputRef.current.focus();
            guestInputRef.current.select();
        }
    }, [isEditingGuests]);

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
        if (!selectedDate || !selectedTime || !guests) return;
        
        // Validate that selected date is not in the past
        if (isDateInPast(year, month, selectedDate)) return;
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
        <main className="min-h-screen pt-20 relative overflow-hidden">
            {/* Decorative Glows */}
            <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(238,124,43,0.15)_0%,rgba(238,124,43,0)_70%)] -z-10"></div>
            <div className="absolute bottom-[-100px] right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(238,124,43,0.15)_0%,rgba(238,124,43,0)_70%)] -z-10"></div>

            <div className="max-w-5xl mx-auto px-6 md:px-8 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Book Your <span className="text-primary">Table</span></h1>
                    <p className="text-stone-400 max-w-lg mx-auto">Experience culinary excellence. Secure your evening with us in just a few simple steps.</p>
                </div>

                <div className="glass w-full rounded-2xl p-8 shadow-2xl">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-12 space-x-4 md:space-x-12">
                        {[{ icon: "event", label: "Date", active: bookingStep >= 1 }, { icon: "schedule", label: "Time", active: bookingStep >= 2 }, { icon: "group", label: "Guests", active: bookingStep >= 3 }].map((step, i, arr) => (
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
                                    <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                        <span className="material-icons text-sm">chevron_left</span>
                                    </button>
                                    <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
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
                                    const dayIsPast = isDateInPast(year, month, day);
                                    return (
                                        <button 
                                            key={day} 
                                            disabled={dayIsPast} 
                                            onClick={() => {
                                                if (!dayIsPast) {
                                                    setSelectedDate(day);
                                                    setSelectedTime(null);
                                                    setGuests(null);
                                                    setIsEditingGuests(false);
                                                }
                                            }}
                                            className={`aspect-square flex items-center justify-center rounded-xl transition-colors text-sm ${dayIsPast ? "text-stone-600 cursor-not-allowed" :
                                                selectedDate === day ? "bg-primary/20 border border-primary/50 text-white font-bold" :
                                                    "hover:bg-white/5 cursor-pointer"
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Time + Guests */}
                        <div className="lg:col-span-5 flex flex-col space-y-8">
                            {/* STEP 3: Guest Selection - Disabled until time selected */}
                            <div ref={guestSection}>
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-500 mb-4">Number of Guests</h3>
                                <div className="flex items-center space-x-4">
                                    <button 
                                        disabled={!selectedTime || !guests} 
                                        onClick={() => {
                                            // Decrement: if guests is 1, reset to null (show "Select")
                                            // Otherwise decrease by 1
                                            if (guests === 1) {
                                                setGuests(null);
                                            } else if (guests > 1) {
                                                setGuests(guests - 1);
                                            }
                                            setIsEditingGuests(false);
                                        }}
                                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/5"
                                    >
                                        <span className="material-icons">remove</span>
                                    </button>
                                    
                                    {isEditingGuests ? (
                                        <input 
                                            ref={guestInputRef}
                                            type="number" 
                                            min="1" 
                                            max="100" 
                                            value={guestInput} 
                                            onChange={(e) => setGuestInput(e.target.value)}
                                            onBlur={() => {
                                                const num = parseInt(guestInput, 10);
                                                if (guestInput && !isNaN(num)) {
                                                    if (num > 100) {
                                                        setGuests(100);
                                                        setShowGuestLimitModal(true);
                                                    } else if (num >= 1) {
                                                        setGuests(num);
                                                    }
                                                }
                                                setIsEditingGuests(false);
                                                setGuestInput("");
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    const num = parseInt(guestInput, 10);
                                                    if (guestInput && !isNaN(num)) {
                                                        if (num > 100) {
                                                            setGuests(100);
                                                            setShowGuestLimitModal(true);
                                                        } else if (num >= 1) {
                                                            setGuests(num);
                                                        }
                                                    }
                                                    setIsEditingGuests(false);
                                                    setGuestInput("");
                                                } else if (e.key === "Escape") {
                                                    setIsEditingGuests(false);
                                                    setGuestInput("");
                                                }
                                            }}
                                            className="flex-1 text-center py-2 text-2xl font-bold text-white bg-transparent border-b-2 border-primary focus:outline-none"
                                            placeholder="Enter guests"
                                        />
                                    ) : (
                                        <div 
                                            onClick={() => {
                                                if (!selectedTime) return;
                                                setIsEditingGuests(true);
                                                setGuestInput(guests ? String(guests) : "");
                                            }}
                                            className={`flex-1 text-center py-2 text-2xl font-bold border-b-2 transition-colors ${
                                                selectedTime 
                                                    ? 'text-white border-primary/30 cursor-pointer hover:border-primary/60' 
                                                    : 'text-stone-500 border-stone-800 cursor-not-allowed opacity-50'
                                            }`}
                                        >
                                            {guests ? String(guests) : (!selectedTime ? "Select" : "Select")}
                                        </div>
                                    )}
                                    
                                    <button 
                                        disabled={!selectedTime} 
                                        onClick={() => {
                                            if (guests === null) {
                                                setGuests(1);
                                            } else if (guests >= 100) {
                                                setShowGuestLimitModal(true);
                                            } else {
                                                setGuests(guests + 1);
                                            }
                                            setIsEditingGuests(false);
                                        }}
                                        className="w-12 h-12 rounded-lg bg-primary border border-primary flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                                    >
                                        <span className="material-icons text-white">add</span>
                                    </button>
                                </div>
                            </div>

                            {/* STEP 2: Time Selection - Disabled until date selected */}
                            <div ref={timeSection}>
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-500 mb-4">Select Time</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {timeSlots.map((t) => {
                                        const isTimePast = isTimeInPastForToday(t);
                                        return (
                                            <button 
                                                key={t} 
                                                disabled={!selectedDate || isTimePast}
                                                onClick={() => {
                                                    setSelectedTime(t);
                                                    setGuests(null);
                                                    setIsEditingGuests(false);
                                                }}
                                                className={`py-2 text-sm rounded border transition-all ${
                                                    selectedTime === t ? "border-primary bg-primary/20 text-white" : "border-white/10 bg-white/5 hover:border-primary"
                                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-white/5`}
                                                title={isTimePast && bookingStep >= 1 ? "Time already passed" : ""}
                                            >
                                                {t}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-500 mb-4">Special Requests</h3>
                                <textarea 
                                    value={specialReq} 
                                    onChange={(e) => setSpecialReq(e.target.value)} 
                                    rows={3} 
                                    placeholder="Any dietary needs or preferences..."
                                    className="input-dark resize-none text-sm" 
                                />
                            </div>

                            {/* Reservation Summary */}
                            {selectedDate && selectedTime && guests && (
                                <div className="flex items-center justify-center px-4 py-3 rounded-lg bg-stone-900/40 border border-primary/25 gap-1.5 whitespace-nowrap overflow-hidden">
                                    <div className="flex items-center gap-1">
                                        <span className="material-icons text-primary text-lg">event</span>
                                        <span className="text-white text-sm">{formatSelectedDate()}</span>
                                    </div>
                                    <span className="text-primary/60">•</span>
                                    <div className="flex items-center gap-1">
                                        <span className="material-icons text-primary text-lg">schedule</span>
                                        <span className="text-white text-sm">{selectedTime}</span>
                                    </div>
                                    <span className="text-primary/60">•</span>
                                    <div className="flex items-center gap-1">
                                        <span className="material-icons text-primary text-lg">group</span>
                                        <span className="text-white text-sm">{guests} Guests</span>
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={handleReserve} 
                                disabled={!selectedDate || !selectedTime || !guests || guests === 0}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                            >
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
            {/* Guest Limit Error Modal */}
            {showGuestLimitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div
                        className="relative w-full max-w-sm rounded-[24px] p-8 text-center"
                        style={{
                            background: '#1A1412',
                            border: '1px solid rgba(238, 124, 43, 0.15)',
                            boxShadow: '0 0 80px rgba(238, 124, 43, 0.08), inset 0 1px 0 rgba(255,255,255,0.03)',
                            fontFamily: '"Outfit", "Plus Jakarta Sans", "Inter", -apple-system, sans-serif'
                        }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-[40px] pointer-events-none"></div>

                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10" style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
                            <span className="material-icons text-3xl" style={{ color: '#ef4444' }}>error_outline</span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Limit Exceeded</h2>

                        <p className="text-stone-400 text-[15px] mb-8 leading-relaxed max-w-[280px] mx-auto">
                            We can only accommodate a maximum of <strong className="text-white font-semibold">100 guests</strong> per online booking.
                        </p>

                        <span
                            onClick={() => setShowGuestLimitModal(false)}
                            className="cursor-pointer text-lg font-bold mt-4 inline-block"
                            style={{ color: '#ef4444', transition: 'color 0.2s ease' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                            onMouseLeave={e => e.currentTarget.style.color = '#ef4444'}
                        >
                            Got it!
                        </span>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Table;
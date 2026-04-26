import { useState, useRef, useEffect } from "react";

const timeSlots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];



const Table = () => {
    const [guests, setGuests] = useState(null);
    const [selectedTable, setSelectedTable] = useState("");
    const [tableDropdownOpen, setTableDropdownOpen] = useState(false);
    const [tablesList, setTablesList] = useState([]);
    
    useEffect(() => {
        fetch("http://localhost:5000/api/tables")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    const mapped = data.data.map(t => ({
                        id: t.tableId,
                        view: t.type === "Center" ? "Center Hall" : t.type + " View",
                        capacity: t.capacity
                    }));
                    setTablesList(mapped);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const filteredTables = guests ? tablesList.filter(t => t.capacity === guests) : [];
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

    // When guests change: if exact-match tables exist let user pick, else assign Random Table
    useEffect(() => {
        if (!guests) {
            setSelectedTable("");
            return;
        }
        const exactMatch = tablesList.filter(t => t.capacity === guests);
        if (exactMatch.length === 0) {
            // No exact-capacity table → assign Random Table automatically
            setSelectedTable("RANDOM");
        } else {
            // Exact tables exist — clear if currently RANDOM or invalid
            const isCurrentValid = exactMatch.some(t => t.id === selectedTable);
            if (!isCurrentValid) setSelectedTable("");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guests]);

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
        if (!selectedDate || !selectedTime || !guests || !selectedTable) return;

        // Validate that selected date is not in the past
        if (isDateInPast(year, month, selectedDate)) return;
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
        const token = localStorage.getItem("token");

        // Helper: format date for display (e.g. "Nov 02, 2024")
        const formatForDisplay = (ds) => {
            const d = new Date(ds + 'T00:00:00');
            return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        };

        // Helper: format time to 12-hr (e.g. "18:30" → "06:30 PM")
        const to12hr = (t) => {
            const [h, m] = t.split(':').map(Number);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const hr = h % 12 || 12;
            return `${String(hr).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
        };

        // Build the local reservation entry
        const isRandom = selectedTable === "RANDOM";
        const tableInfo = isRandom ? null : tablesList.find(t => t.id === selectedTable);
        const tableLabel = isRandom ? "Random Table" : `${selectedTable} (${tableInfo?.view || ''})`;
        const refId = 'RES-' + Math.floor(1000 + Math.random() * 9000);
        const localEntry = {
            id: refId,
            title: isRandom ? 'Random Table Assignment' : `${tableInfo?.view} Table`,
            details: `${guests} Guest${guests > 1 ? 's' : ''} • ${tableLabel}`,
            date: formatForDisplay(dateStr),
            time: to12hr(selectedTime),
            status: 'Pending',
            statusColor: 'yellow',
            createdAt: Date.now(),
        };

        try {
            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ date: dateStr, time: selectedTime, guests, table: selectedTable, specialRequests: specialReq }),
            });
            const data = await res.json();
            if (data.success) {
                const apiRef = data.data._id?.slice(-6)?.toUpperCase() || refId;
                localEntry.id = 'RES-' + apiRef;
                setBookingRef(localEntry.id);
            } else {
                setBookingRef(refId);
            }
        } catch {
            setBookingRef(refId);
        }

        // Save to localStorage regardless of API success
        const existing = JSON.parse(localStorage.getItem('reservations') || '[]');
        existing.unshift(localEntry);
        localStorage.setItem('reservations', JSON.stringify(existing.slice(0, 20)));
        setShowModal(true);
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
                    <div className="flex items-start justify-center mb-12 space-x-4 md:space-x-12">
                        {[{ icon: "event", label: "Date", active: bookingStep >= 1 }, { icon: "schedule", label: "Time", active: bookingStep >= 2 }, { icon: "group", label: "Guests", active: bookingStep >= 3 }].map((step, i, arr) => (
                            <div key={step.label} className="flex items-start gap-4 md:gap-12">
                                <div className={`flex flex-col items-center ${step.active ? "" : "opacity-60"}`}>
                                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${step.active ? "border-primary bg-primary text-white shadow-[0_0_15px_rgba(238,124,43,0.3)]" : "border-white/20"}`}>
                                        <span className="material-icons text-sm">{step.icon}</span>
                                    </div>
                                    <span className={`text-xs uppercase tracking-tighter font-semibold ${step.active ? "text-primary" : ""}`}>{step.label}</span>
                                </div>
                                {i < arr.length - 1 && <div className={`h-[2px] w-20 md:w-36 mt-[19px] ${step.active ? "bg-primary/30" : "bg-white/10"}`}></div>}
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
                                                    setSelectedTable("");
                                                    setTableDropdownOpen(false);
                                                    setIsEditingGuests(false);
                                                }
                                            }}
                                            className={`aspect-square flex items-center justify-center rounded-xl transition-[background-color,color,box-shadow] duration-300 text-sm outline-none focus:outline-none focus-visible:outline-none focus:ring-0 ${dayIsPast ? "text-stone-600 cursor-not-allowed" :
                                                selectedDate === day ? "bg-transparent border border-primary/50 text-primary shadow-[0_0_15px_-3px_rgba(238,124,43,0.4)]" :
                                                    "hover:bg-white/5 cursor-pointer border border-transparent"
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
                                            max="20"
                                            value={guestInput}
                                            onChange={(e) => setGuestInput(e.target.value)}
                                            onBlur={() => {
                                                const num = parseInt(guestInput, 10);
                                                if (guestInput && !isNaN(num)) {
                                                    if (num > 20) {
                                                        setGuests(20);
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
                                                        if (num > 20) {
                                                            setGuests(20);
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
                                            className={`flex-1 text-center py-2 text-2xl font-bold border-b-2 transition-colors ${selectedTime
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
                                            } else if (guests >= 20) {
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

                            {/* Table Dropdown - Custom glassmorphism */}
                            <div className="relative">
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-500 mb-4">Select Table</h3>

                                {/* Trigger button */}
                                <button
                                    type="button"
                                    disabled={!guests}
                                    onClick={() => guests && setTableDropdownOpen(o => !o)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 outline-none focus:outline-none ${!guests
                                        ? 'border-white/10 text-white/40 cursor-not-allowed'
                                        : selectedTable
                                            ? 'border-primary/60 text-primary shadow-[0_0_18px_-4px_rgba(238,124,43,0.4)]'
                                            : 'border-white/10 text-stone-300 hover:border-primary/30 hover:text-white'
                                        }`}
                                    style={{ background: 'rgba(34,24,16,0.8)' }}
                                >
                                <span className="flex items-center gap-2.5">
                                        <span className={`material-icons text-[18px] ${selectedTable ? 'text-primary' : 'text-white/60'}`}>
                                            {selectedTable === 'RANDOM' ? 'casino' : 'table_restaurant'}
                                        </span>
                                        {selectedTable === 'RANDOM'
                                            ? 'Random Table'
                                            : selectedTable
                                                ? (() => { const t = tablesList.find(x => x.id === selectedTable); return t ? `${t.id} — ${t.view}` : selectedTable; })()
                                                : (!guests ? 'Select guests first' : `${filteredTables.length} tables available`)
                                        }
                                    </span>
                                    <span className={`material-icons text-lg transition-transform duration-200 ${tableDropdownOpen ? 'rotate-180 text-primary' : selectedTable ? 'text-primary' : 'text-white/50'
                                        }`}>expand_more</span>
                                </button>

                                {/* Dropdown panel */}
                                {tableDropdownOpen && guests && (
                                    <>
                                        {/* backdrop to close on outside click */}
                                        <div className="fixed inset-0 z-10" onClick={() => setTableDropdownOpen(false)} />
                                        <div
                                            className="absolute z-20 top-[calc(100%+6px)] left-0 right-0 rounded-xl overflow-hidden"
                                            style={{
                                                background: 'rgba(18,11,5,0.97)',
                                                boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(238,124,43,0.06)',
                                                backdropFilter: 'blur(16px)',
                                            }}
                                        >
                                            {/* Header */}
                                            <div className="px-3 py-2 border-b border-white/5">
                                                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold">
                                                    {filteredTables.length} tables for {guests} guests
                                                </span>
                                            </div>
                                            {/* Options */}
                                            <div className="max-h-52 overflow-y-auto hide-scrollbar">
                                                {filteredTables.map((table) => {
                                                    const isSelected = selectedTable === table.id;
                                                    return (
                                                        <button
                                                            key={table.id}
                                                            type="button"
                                                            onClick={() => { setSelectedTable(table.id); setTableDropdownOpen(false); }}
                                                            className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-150 ${isSelected
                                                                ? 'bg-primary/15 text-primary'
                                                                : 'text-stone-300 hover:bg-white/5 hover:text-white'
                                                                }`}
                                                        >
                                                            <span className="flex items-center gap-3">
                                                                <span className={`material-icons text-base ${isSelected ? 'text-primary' : 'text-stone-600'}`}>chair</span>
                                                                <span>
                                                                    <span className={`font-bold mr-2 ${isSelected ? 'text-primary' : 'text-white'}`}>{table.id}</span>
                                                                    <span className="text-stone-500">{table.view}</span>
                                                                </span>
                                                            </span>
                                                            <span className="flex items-center gap-2">
                                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${isSelected ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 text-stone-500'
                                                                    }`}>{table.capacity} guests</span>
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}
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
                                                    setSelectedTable("");
                                                    setTableDropdownOpen(false);
                                                    setIsEditingGuests(false);
                                                }}
                                                className={`py-2 text-sm rounded-xl border transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 ${selectedTime === t ? "border-primary/50 bg-transparent text-primary shadow-[0_0_15px_-3px_rgba(238,124,43,0.4)]" : "border-white/10 bg-transparent text-stone-300 hover:text-white hover:border-primary"
                                                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-stone-300`}
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
                                <div className="flex flex-wrap items-center justify-center px-4 py-3 rounded-lg bg-stone-900/40 border border-primary/25 gap-x-2 gap-y-1">
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
                                disabled={!selectedDate || !selectedTime || !guests}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-xl">
                    <div
                        className="relative w-full max-w-md rounded-[28px] overflow-hidden text-center"
                        style={{
                            background: 'linear-gradient(160deg, #1e1208 0%, #150d04 60%, #0f0802 100%)',
                            border: '1px solid rgba(238,124,43,0.25)',
                            boxShadow: '0 0 0 1px rgba(238,124,43,0.08), 0 32px 80px rgba(0,0,0,0.7), 0 0 120px rgba(238,124,43,0.08)',
                        }}
                    >
                        {/* Top glow bar */}
                        <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #ee7c2b, #f5a623, #ee7c2b, transparent)' }} />

                        <div className="p-8 pt-10">
                            {/* Animated icon */}
                            <div className="relative mx-auto mb-7 w-24 h-24">
                                {/* outer ping ring */}
                                <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" style={{ animationDuration: '2s' }} />
                                {/* middle glow ring */}
                                <div className="absolute inset-2 rounded-full" style={{ background: 'rgba(238,124,43,0.08)', boxShadow: '0 0 30px 6px rgba(238,124,43,0.2)' }} />
                                {/* icon circle */}
                                <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(238,124,43,0.18) 0%, rgba(238,124,43,0.06) 70%)' }}>
                                    <span className="material-icons text-primary" style={{ fontSize: '42px' }}>check_circle</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h2
                                className="font-bold mb-2"
                                style={{
                                    fontSize: '28px',
                                    letterSpacing: '-0.02em',
                                    background: 'linear-gradient(135deg, #ffffff 30%, #ee7c2b 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Reservation Confirmed!
                            </h2>
                            <p className="text-stone-400 text-sm mb-8 leading-relaxed">
                                Your table has been reserved. A confirmation<br />has been sent to your registered email.
                            </p>

                            {/* Booking details card */}
                            <div
                                className="rounded-2xl mb-6 text-left overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                                <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Booking Reference</span>
                                    <span className="text-primary font-mono font-bold text-sm">#{bookingRef}</span>
                                </div>
                                <div className="px-5 py-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="material-icons text-primary/70 text-base">calendar_today</span>
                                        <span className="text-stone-300 text-sm">{selectedDate && new Date(year, month, selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="material-icons text-primary/70 text-base">schedule</span>
                                        <span className="text-stone-300 text-sm">{selectedTime}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="material-icons text-primary/70 text-base">group</span>
                                        <span className="text-stone-300 text-sm">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="material-icons text-primary/70 text-base">{selectedTable === 'RANDOM' ? 'casino' : 'table_restaurant'}</span>
                                        <span className="text-stone-300 text-sm">
                                            {selectedTable === 'RANDOM' ? 'Random Table Assignment' : (() => { const t = tablesList.find(x => x.id === selectedTable); return t ? `${t.id} — ${t.view}` : selectedTable; })()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowModal(false); window.location.href = '/profile'; }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = '#ee7c2b';
                                        e.currentTarget.style.borderColor = '#ee7c2b';
                                        e.currentTarget.style.boxShadow = '0 6px 24px rgba(238,124,43,0.45)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(238,124,43,0.08)';
                                        e.currentTarget.style.borderColor = 'rgba(238,124,43,0.5)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    className="flex-1 py-3 rounded-xl font-semibold text-sm"
                                    style={{ background: 'rgba(238,124,43,0.08)', border: '1px solid rgba(238,124,43,0.5)', color: '#ffffff', transition: 'all 0.2s ease' }}
                                >
                                    View Reservation
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                    }}
                                    className="flex-1 py-3 rounded-xl font-semibold text-sm text-stone-300"
                                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s ease' }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
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
                            We can only accommodate a maximum of <strong className="text-white font-semibold">20 guests</strong> per online booking.
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
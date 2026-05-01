import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Animation helpers ────────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

const Section = ({ children, className = "" }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.section
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className={className}
        >
            {children}
        </motion.section>
    );
};

const M = motion.div; // shorthand

/* ─── Data ─────────────────────────────────────────────────────── */
const teamMembers = [
    {
        name: "Julian Voss",
        role: "Executive Chef",
        image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80",
        bio: "Michelin-starred visionary with 25 years of culinary mastery.",
    },
    {
        name: "Aria Chen",
        role: "Sous Chef",
        image: "https://images.unsplash.com/photo-1583394293214-28ez1c9biWz?w=400&q=80",
        bio: "Creative force behind our seasonal tasting menus.",
        fallback: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80",
    },
    {
        name: "Marco Bellini",
        role: "Pastry Chef",
        image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&q=80",
        bio: "Award-winning artisan of desserts and fine patisserie.",
    },
];

const contactCards = [
    { icon: "location_on", title: "Visit Us", lines: ["123 Gourmet Street", "Food City, FC 10001"] },
    { icon: "phone", title: "Call Us", lines: ["+1 (555) 123-4567", "+1 (555) 765-4321"] },
    { icon: "email", title: "Email Us", lines: ["reservations@lumiere.com", "info@lumiere.com"] },
    { icon: "schedule", title: "Opening Hours", lines: ["Mon — Fri: 5 PM – 11 PM", "Sat — Sun: 12 PM – 11 PM"] },
];

/* ─── Component ────────────────────────────────────────────────── */
const AboutContact = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", rating: 0 });
    const [status, setStatus] = useState("idle"); // idle | sending | success | error
    const [hoveredStar, setHoveredStar] = useState(0);
    const msgRef = useRef(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");
        try {
            const res = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                setStatus("success");
                setForm({ name: "", email: "", phone: "", message: "", rating: 0 });
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setStatus("error");
                setTimeout(() => setStatus("idle"), 3000);
            }
        } catch {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <div className="overflow-hidden">
            {/* ══════════════════════════ 1. HERO ══════════════════════════ */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="w-full h-full scale-105 opacity-40"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/60 to-dark z-[1]" />
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative z-10 text-center px-4 max-w-4xl"
                >
                    <div className="inline-block px-4 py-1 mb-6 rounded-full glass-light border border-primary/30 text-primary text-xs font-bold tracking-[0.3em] uppercase">
                        About & Contact
                    </div>
                    <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-6 tracking-tight leading-none">
                        Our Story &<br />
                        <span className="text-primary">Connect With Us</span>
                    </h1>
                    <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Four decades of passion, artistry, and the warmth of shared tables — discover the heart of Lumière.
                    </p>

                    {/* Accent divider */}
                    <div className="mt-10 mx-auto w-24 h-[2px] rounded-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />
                </motion.div>
            </section>

            {/* ══════════════════ 2. RESTAURANT STORY ══════════════════ */}
            <Section className="py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 md:items-stretch items-center">
                    {/* Image */}
                    <M variants={fadeUp} className="relative order-2 md:order-1 h-[400px] md:h-auto">
                        <div className="relative z-10 rounded-2xl overflow-hidden h-full">
                            <img
                                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                                alt="Chef preparing dish"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-primary/40 rounded-tl-2xl" />
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-primary/40 rounded-br-2xl" />
                    </M>

                    {/* Text */}
                    <div className="order-1 md:order-2 flex flex-col justify-center">
                        <M variants={fadeUp}>
                            <h2 className="section-label">Our Heritage</h2>
                        </M>
                        <M variants={fadeUp} custom={1}>
                            <h3 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-8">
                                Defining Excellence<br />Since <span className="text-primary">1984</span>
                            </h3>
                        </M>
                        <M variants={fadeUp} custom={2}>
                            <p className="text-lg text-stone-400 font-light leading-relaxed mb-6">
                                Forged from an uncompromising pursuit of culinary perfection, Lumière has set the gold standard 
                                in fine dining for four decades. Every plate is an evocative masterpiece, woven together with 
                                exquisite textures, intoxicating aromas, and visionary artistry.
                            </p>
                        </M>
                        <M variants={fadeUp} custom={3}>
                            <p className="text-lg text-stone-400 font-light leading-relaxed mb-10">
                                We partner exclusively with local artisans and sustainable purveyors who share our rigorous 
                                standards. This ensures every creation we serve is a profound celebration of our rich terroir 
                                and enduring legacy.
                            </p>
                        </M>
                        <M variants={fadeUp} custom={4}>
                            <div className="grid grid-cols-3 gap-6">
                                {[
                                    ["40+", "Years"],
                                    ["12k+", "Happy Diners"],
                                    ["3", "Michelin Stars"],
                                ].map(([val, label]) => (
                                    <div key={label}>
                                        <p className="text-3xl font-bold text-primary mb-1">{val}</p>
                                        <p className="text-stone-500 uppercase text-xs tracking-widest font-bold">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </M>
                    </div>
                </div>
            </Section>

            {/* ══════════════ 3. VISION & MISSION ══════════════════════ */}
            <Section className="relative py-24 px-4 md:px-8 overflow-hidden">


                <div className="relative z-10 max-w-5xl mx-auto">
                    <M variants={fadeUp} className="text-center mb-20">
                        <h2 className="section-label">What Drives Us</h2>
                        <h3 className="section-title">
                            Our <span className="text-primary">Vision</span> & Mission
                        </h3>
                    </M>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {[
                            {
                                icon: "visibility",
                                titleStart: "Our",
                                titleHighlight: "Vision",
                                text: "To be a global beacon of culinary excellence — a place where every visit transcends dining and becomes an unforgettable sensory journey that celebrates heritage, innovation, and the art of gathering.",
                            },
                            {
                                icon: "flag",
                                titleStart: "Our",
                                titleHighlight: "Mission",
                                text: "We craft world-class dining experiences through ethically sourced ingredients, masterful technique, and heartfelt hospitality — nurturing a community that values quality, creativity, and sustainability.",
                            },
                        ].map((card, i) => (
                            <M key={card.titleHighlight} variants={fadeUp} custom={i}>
                                <motion.div
                                    whileHover={{ y: -8, boxShadow: "0 15px 40px -10px rgba(238,124,43,0.25)" }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="group relative overflow-hidden rounded-[24px] p-10 lg:p-12 h-full transition-colors duration-300"
                                    style={{
                                        background: "linear-gradient(180deg, rgba(30,20,15,0.5) 0%, rgba(20,15,10,0.8) 100%)",
                                        backdropFilter: "blur(20px)",
                                        WebkitBackdropFilter: "blur(20px)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        backfaceVisibility: "hidden"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "linear-gradient(180deg, rgba(40,25,15,0.7) 0%, rgba(25,15,10,0.9) 100%)";
                                        e.currentTarget.style.border = "1px solid rgba(238,124,43,0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "linear-gradient(180deg, rgba(30,20,15,0.5) 0%, rgba(20,15,10,0.8) 100%)";
                                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
                                    }}
                                >
                                    {/* Faint divider line inside card (top accent) */}
                                    <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/10 group-hover:via-primary/50 to-transparent transition-colors duration-500" />

                                    {/* Top: small icon container */}
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(238,124,43,0.25)] transition-all duration-300">
                                        <span className="material-icons text-xl text-stone-400 group-hover:text-primary transition-colors duration-300">{card.icon}</span>
                                    </div>

                                    {/* Middle: title */}
                                    <h4 className="text-[26px] font-bold text-white/90 group-hover:text-white tracking-tight mb-3 transition-colors duration-300">
                                        {card.titleStart} <span className="text-primary opacity-90 group-hover:opacity-100 transition-opacity duration-300">{card.titleHighlight}</span>
                                    </h4>

                                    {/* Bottom: description paragraph */}
                                    <p className="text-stone-400/90 text-[15px] font-light leading-[1.8] group-hover:text-stone-300 transition-colors duration-300">
                                        {card.text}
                                    </p>
                                </motion.div>
                            </M>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ══════════════════ 4. MEET THE TEAM ═════════════════════ */}
            <Section className="relative py-24 px-4 md:px-8 overflow-hidden">


                <div className="relative z-10 max-w-6xl mx-auto">
                    <M variants={fadeUp} className="text-center mb-20">
                        <h2 className="section-label">The Artisans</h2>
                        <h3 className="section-title">
                            Meet Our <span className="text-primary">Team</span>
                        </h3>
                    </M>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {teamMembers.map((member, i) => (
                            <M key={member.name} variants={fadeUp} custom={i} className="h-full">
                                <motion.div
                                    whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(238,124,43,0.25)" }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="group relative overflow-hidden rounded-[24px] p-8 lg:p-10 h-full flex flex-col items-center text-center transition-colors duration-300"
                                    style={{
                                        background: "linear-gradient(180deg, rgba(30,20,15,0.4) 0%, rgba(20,15,10,0.7) 100%)",
                                        backdropFilter: "blur(20px)",
                                        WebkitBackdropFilter: "blur(20px)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        backfaceVisibility: "hidden"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "linear-gradient(180deg, rgba(40,25,15,0.6) 0%, rgba(25,15,10,0.85) 100%)";
                                        e.currentTarget.style.border = "1px solid rgba(238,124,43,0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "linear-gradient(180deg, rgba(30,20,15,0.4) 0%, rgba(20,15,10,0.7) 100%)";
                                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
                                    }}
                                >
                                    {/* Top: Circular profile image (larger size) with soft outer glow ring */}
                                    <div className="relative w-40 h-40 mx-auto mb-8 rounded-full p-[3px] bg-gradient-to-tr from-white/5 to-white/10 group-hover:from-primary/40 group-hover:to-primary/10 transition-all duration-500 shadow-lg group-hover:shadow-[0_0_30px_rgba(238,124,43,0.3)]">
                                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-dark/80 relative bg-dark">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                onError={(e) => {
                                                    if (member.fallback) e.currentTarget.src = member.fallback;
                                                }}
                                            />
                                            {/* Inner image overlay for ambient lighting */}
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-10 mix-blend-overlay transition-opacity duration-500 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Middle: Chef name & Role label */}
                                    <h4 className="text-2xl font-bold text-white/90 group-hover:text-white mb-2 transition-colors duration-300">
                                        {member.name}
                                    </h4>
                                    <p className="text-primary/70 group-hover:text-primary text-[11px] font-bold uppercase tracking-[0.25em] mb-5 transition-colors duration-300">
                                        {member.role}
                                    </p>

                                    {/* Bottom: Description text */}
                                    <p className="text-stone-400/90 text-[15px] font-light leading-[1.8] group-hover:text-stone-300 transition-colors duration-300 max-w-sm mx-auto mt-auto">
                                        {member.bio}
                                    </p>
                                </motion.div>
                            </M>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ═══════════════ 5. CONTACT INFORMATION ══════════════════ */}
            <Section className="relative py-24 px-4 md:px-8 overflow-hidden">


                <div className="relative z-10 max-w-6xl mx-auto">
                    <M variants={fadeUp} className="text-center mb-20">
                        <h2 className="section-label">Reach Out</h2>
                        <h3 className="section-title">
                            Contact <span className="text-primary">Information</span>
                        </h3>
                    </M>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {contactCards.map((card, i) => (
                            <M key={card.title} variants={fadeUp} custom={i} className="h-full">
                                <motion.div
                                    whileHover={{ y: -6, boxShadow: "0 15px 30px -10px rgba(238,124,43,0.2)" }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="group relative overflow-hidden rounded-[24px] p-8 h-full flex flex-col items-center text-center transition-colors duration-300"
                                    style={{
                                        background: "linear-gradient(180deg, rgba(30,20,15,0.4) 0%, rgba(20,15,10,0.7) 100%)",
                                        backdropFilter: "blur(20px)",
                                        WebkitBackdropFilter: "blur(20px)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        backfaceVisibility: "hidden"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "linear-gradient(180deg, rgba(40,25,15,0.5) 0%, rgba(25,15,10,0.8) 100%)";
                                        e.currentTarget.style.border = "1px solid rgba(238,124,43,0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "linear-gradient(180deg, rgba(30,20,15,0.4) 0%, rgba(20,15,10,0.7) 100%)";
                                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
                                    }}
                                >
                                    {/* Top: rounded square icon container */}
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-[14px] group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(238,124,43,0.25)] transition-all duration-300">
                                        <span className="material-icons text-2xl text-primary/80 group-hover:text-primary group-hover:scale-110 transition-all duration-300">{card.icon}</span>
                                    </div>

                                    {/* Middle: Title */}
                                    <h4 className="text-xl font-bold text-white/90 group-hover:text-white mb-[10px] transition-colors duration-300">
                                        {card.title}
                                    </h4>

                                    {/* Bottom: Contact Details */}
                                    <div className="mt-auto w-full">
                                        {card.lines.map((line) => (
                                            <p key={line} className="text-stone-400/90 text-[15px] font-light leading-[1.8] group-hover:text-stone-300 transition-colors duration-300">
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                </motion.div>
                            </M>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ══════════════════ 6. CONTACT FORM ══════════════════════ */}
            <Section className="relative py-24 px-4 md:px-8 overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <M variants={fadeUp} className="text-center mb-20">
                        <h2 className="section-label">Get In Touch</h2>
                        <h3 className="section-title">
                            Send Us A <span className="text-primary">Message</span>
                        </h3>
                    </M>

                    <M variants={fadeUp} custom={1}>
                        <div className="mx-auto w-full max-w-2xl">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Row 1: Name + Email */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    {[
                                        { name: "name", label: "Full Name", type: "text" },
                                        { name: "email", label: "Email Address", type: "email" },
                                    ].map((field) => (
                                        <div key={field.name} className="relative pb-1">
                                            <input
                                                id={`contact-${field.name}`}
                                                type={field.type}
                                                name={field.name}
                                                value={form[field.name]}
                                                onChange={handleChange}
                                                required
                                                placeholder=" "
                                                className="peer w-full bg-transparent border-0 border-b border-white/20 pt-5 pb-2 text-white text-[15px] font-['Inter',sans-serif] outline-none focus:border-primary transition-colors duration-300 [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#0d0908] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]"
                                            />
                                            <label
                                                htmlFor={`contact-${field.name}`}
                                                className="absolute left-0 top-5 text-[13px] text-white/35 pointer-events-none transition-all duration-300 uppercase tracking-[0.1em]
                                                    peer-focus:top-[-2px] peer-focus:text-primary/70
                                                    peer-placeholder-shown:top-5 peer-placeholder-shown:text-white/35
                                                    peer-[&:not(:placeholder-shown)]:top-[-2px] peer-[&:not(:placeholder-shown)]:text-primary/60"
                                            >
                                                {field.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* Row 2: Phone */}
                                <div className="relative pb-1">
                                    <input
                                        id="contact-phone"
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder=" "
                                        className="peer w-full bg-transparent border-0 border-b border-white/20 pt-5 pb-2 text-white text-[15px] font-['Inter',sans-serif] outline-none focus:border-primary transition-colors duration-300 [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#0d0908] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]"
                                    />
                                    <label
                                        htmlFor="contact-phone"
                                        className="absolute left-0 top-5 text-[13px] text-white/35 pointer-events-none transition-all duration-300 uppercase tracking-[0.1em]
                                            peer-focus:top-[-2px] peer-focus:text-primary/70
                                            peer-placeholder-shown:top-5 peer-placeholder-shown:text-white/35
                                            peer-[&:not(:placeholder-shown)]:top-[-2px] peer-[&:not(:placeholder-shown)]:text-primary/60"
                                    >
                                        Phone Number
                                        <span className="ml-1.5 text-[11px] text-white/25 normal-case tracking-normal">Optional</span>
                                    </label>
                                </div>

                                {/* Row 3: Message */}
                                <div className="relative pb-1">
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        ref={msgRef}
                                        value={form.message}
                                        onChange={handleChange}
                                        onInput={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        required
                                        rows={1}
                                        placeholder=" "
                                        className="peer w-full bg-transparent border-0 border-b border-white/20 pt-5 pb-2 text-white text-[15px] font-['Inter',sans-serif] outline-none focus:border-primary transition-colors duration-300 resize-none overflow-hidden"
                                        style={{ minHeight: 40 }}
                                    />
                                    <label
                                        htmlFor="contact-message"
                                        className="absolute left-0 top-5 text-[13px] text-white/35 pointer-events-none transition-all duration-300 uppercase tracking-[0.1em]
                                            peer-focus:top-[-2px] peer-focus:text-primary/70
                                            peer-placeholder-shown:top-5 peer-placeholder-shown:text-white/35
                                            peer-[&:not(:placeholder-shown)]:top-[-2px] peer-[&:not(:placeholder-shown)]:text-primary/60"
                                    >
                                        Your Message
                                    </label>
                                </div>

                                {/* Star Rating */}
                                <div style={{ paddingTop: 8, paddingBottom: 4 }}>
                                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                                        Rate Your Experience
                                    </p>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const filled = star <= (hoveredStar || form.rating);
                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, rating: form.rating === star ? 0 : star })}
                                                    onMouseEnter={() => setHoveredStar(star)}
                                                    onMouseLeave={() => setHoveredStar(0)}
                                                    style={{
                                                        background: "none", border: "none", cursor: "pointer", padding: 0,
                                                        fontSize: 30,
                                                        color: filled ? "#ee7c2b" : "rgba(255,255,255,0.15)",
                                                        textShadow: filled ? "0 0 12px rgba(238,124,43,0.6)" : "none",
                                                        transform: filled ? "scale(1.15)" : "scale(1)",
                                                        transition: "all 0.15s ease",
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    ★
                                                </button>
                                            );
                                        })}
                                        {form.rating > 0 && (
                                            <span style={{ alignSelf: "center", color: "rgba(255,255,255,0.3)", fontSize: 12, marginLeft: 4 }}>
                                                {["Poor", "Fair", "Good", "Great", "Excellent!"][form.rating - 1]}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-4">
                                    <motion.button
                                        type="submit"
                                        disabled={status === "sending"}
                                        whileHover={{ y: -3, boxShadow: "0 20px 50px -10px rgba(238,124,43,0.5)" }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ duration: 0.1 }}
                                        className="relative overflow-hidden group py-4 px-16 disabled:opacity-50 text-white font-['Inter',sans-serif] font-semibold text-[11px] uppercase tracking-[0.25em] rounded-full transition-all duration-100 flex items-center gap-3"
                                        style={{
                                            background: "linear-gradient(135deg, #ee7c2b 0%, #d4601a 100%)",
                                            boxShadow: "0 8px 32px rgba(238,124,43,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                                        }}
                                    >
                                        {status === "sending" ? (
                                            <>
                                                <span className="material-icons animate-spin text-[18px]">autorenew</span>
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                            </>
                                        )}
                                    </motion.button>
                                </div>


                                {status === "error" && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="flex flex-col items-center gap-3 py-6"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                                            <span className="material-icons text-red-400 text-[22px]">close</span>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white/90 text-[15px] font-medium tracking-wide">Connection Failed</p>
                                            <p className="text-white/35 text-[12px] tracking-[0.06em] uppercase mt-0.5">Please try again</p>
                                        </div>
                                    </motion.div>
                                )}
                            </form>
                        </div>
                    </M>
                </div>
            </Section>

            {/* ═══════════════════ 7. GOOGLE MAP ═══════════════════════ */}
            <Section className="py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <M variants={fadeUp} className="text-center mb-16">
                        <h2 className="section-label">Find Us</h2>
                        <h3 className="section-title">
                            Our <span className="text-primary">Location</span>
                        </h3>
                    </M>

                    <M variants={fadeUp} custom={1}>
                        <div className="rounded-3xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/5">
                            <iframe
                                tabIndex="-1"
                                title="Lumière Restaurant Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573291394!2d-73.98784368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
                                width="100%"
                                height="650"
                                style={{
                                    border: 0,
                                    outline: "none",
                                    display: "block",
                                    backgroundColor: "#fff",
                                    filter: "invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)"
                                }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </M>
                </div>
            </Section>

            {/* ── Success Toast ── */}
            {status === "success" && (
                <motion.div
                    initial={{ opacity: 0, x: 120, y: 0 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 120 }}
                    transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
                    style={{
                        position: "fixed",
                        top: 28,
                        right: 28,
                        zIndex: 9999,
                        width: 360,
                        background: "rgba(10, 24, 17, 0.94)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        border: "1px solid rgba(16,185,129,0.28)",
                        borderRadius: 20,
                        overflow: "hidden",
                        boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.08)",
                    }}
                >
                    {/* Top green accent */}
                    <div style={{ height: 2, background: "linear-gradient(90deg, #10b981, #34d399, #10b981)" }} />

                    <div style={{ padding: "20px 20px 16px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                        {/* Check icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                            style={{
                                flexShrink: 0,
                                width: 44, height: 44,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))",
                                border: "1.5px solid rgba(16,185,129,0.5)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 0 20px rgba(16,185,129,0.2)",
                            }}
                        >
                            <motion.svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            >
                                <motion.path
                                    d="M4 10.5l4 4 8-8"
                                    stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                />
                            </motion.svg>
                        </motion.div>

                        {/* Text */}
                        <div style={{ flex: 1, paddingTop: 2 }}>
                            <motion.p
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.35 }}
                                style={{ color: "#f5f0eb", fontSize: 15, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.1px" }}
                            >
                                Message Sent!
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.28, duration: 0.35 }}
                                style={{ color: "rgba(196,180,165,0.7)", fontSize: 13, lineHeight: 1.6, fontWeight: 300 }}
                            >
                                We've received your message and will get back to you shortly.
                            </motion.p>
                        </div>

                        {/* Close X */}
                        <button
                            onClick={() => setStatus("idle")}
                            style={{
                                flexShrink: 0, background: "none", border: "none",
                                color: "rgba(255,255,255,0.25)", cursor: "pointer",
                                fontSize: 18, lineHeight: 1, padding: 4,
                                transition: "color 0.2s",
                            }}
                            onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
                            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.25)"}
                        >✕</button>
                    </div>

                    {/* Progress bar — drains over 5s */}
                    <motion.div
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: 5, ease: "linear" }}
                        style={{
                            height: 2,
                            background: "linear-gradient(90deg, #10b981, #34d399)",
                            transformOrigin: "left",
                            margin: "0 20px 14px",
                            borderRadius: 2,
                            opacity: 0.5,
                        }}
                    />
                </motion.div>
            )}
        </div>
    );
};

export default AboutContact;

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
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [status, setStatus] = useState("idle"); // idle | sending | success | error

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("sending");
        // Simulate network call
        setTimeout(() => {
            setStatus("success");
            setForm({ name: "", email: "", phone: "", message: "" });
            setTimeout(() => setStatus("idle"), 4000);
        }, 1500);
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
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-center">
                    {/* Image */}
                    <M variants={fadeUp} className="relative order-2 md:order-1">
                        <div className="relative z-10 rounded-2xl overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                                alt="Chef preparing dish"
                                className="w-full h-[520px] object-cover"
                            />
                        </div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-primary/40 rounded-tl-2xl" />
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-primary/40 rounded-br-2xl" />
                    </M>

                    {/* Text */}
                    <div className="order-1 md:order-2">
                        <M variants={fadeUp}>
                            <h2 className="section-label">Our Heritage</h2>
                        </M>
                        <M variants={fadeUp} custom={1}>
                            <h3 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-8">
                                Crafting Memories<br />Since <span className="text-primary">1984</span>
                            </h3>
                        </M>
                        <M variants={fadeUp} custom={2}>
                            <p className="text-lg text-stone-400 font-light leading-relaxed mb-6">
                                Born from a passion for authentic flavors and the warmth of shared moments, Lumière has redefined
                                fine dining for four decades. Every plate is a narrative told through textures, aromas, and visual artistry.
                            </p>
                        </M>
                        <M variants={fadeUp} custom={3}>
                            <p className="text-lg text-stone-400 font-light leading-relaxed mb-10">
                                Our ingredients are sourced from local artisans who share our commitment to quality, ensuring
                                that every dish is a testament to the richness of our terroir and tradition.
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
                {/* Subtle radial gradient background behind the cards */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

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
                                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
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
                {/* Subtle radial gradient background behind the cards */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full max-h-[800px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />

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
                                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
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
                {/* Subtle radial gradient background behind the cards */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

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
                                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
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
                {/* Subtle radial glow specifically highlighting the form area */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-[600px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    <M variants={fadeUp} className="text-center mb-20">
                        <h2 className="section-label">Get In Touch</h2>
                        <h3 className="section-title">
                            Send Us A <span className="text-primary">Message</span>
                        </h3>
                    </M>

                    <M variants={fadeUp} custom={1}>
                        <div className="mx-auto w-full max-w-2xl">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Row 1: Name + Email */}
                                <div className="grid md:grid-cols-2 gap-5">
                                    {[
                                        { name: "name", label: "Full Name", type: "text" },
                                        { name: "email", label: "Email Address", type: "email" },
                                    ].map((field) => (
                                        <div key={field.name} className="relative group/input">
                                            <input
                                                id={`contact-${field.name}`}
                                                type={field.type}
                                                name={field.name}
                                                value={form[field.name]}
                                                onChange={handleChange}
                                                required
                                                placeholder=" "
                                                className="peer w-full px-[14px] py-[16px] bg-transparent border border-white/15 rounded-[8px] focus:border-primary focus:shadow-[0_0_10px_rgba(238,124,43,0.1)] transition-colors outline-none text-white text-[15px] [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#0e0906] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                            />
                                            <label htmlFor={`contact-${field.name}`} className="absolute text-[15px] text-white/50 bg-[#0e0906] px-1.5 duration-300 transform top-1/2 -translate-y-1/2 scale-100 z-20 origin-[0] left-[10px] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:scale-[0.8] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-primary pointer-events-none transition-all">
                                                {field.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* Row 2: Phone */}
                                <div className="relative group/input">
                                    <input
                                        id="contact-phone"
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder=" "
                                        className="peer w-full px-[14px] py-[16px] bg-transparent border border-white/15 rounded-[8px] focus:border-primary focus:shadow-[0_0_10px_rgba(238,124,43,0.1)] transition-colors outline-none text-white text-[15px] [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#0e0906] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                    />
                                    <label htmlFor="contact-phone" className="absolute text-[15px] text-white/50 bg-[#0e0906] px-1.5 duration-300 transform top-1/2 -translate-y-1/2 scale-100 z-20 origin-[0] left-[10px] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:scale-[0.8] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-primary pointer-events-none transition-all">
                                        Phone Number (Optional)
                                    </label>
                                </div>

                                {/* Row 3: Message */}
                                <div className="relative group/input">
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder=" "
                                        className="peer w-full px-[14px] py-[16px] bg-transparent border border-white/15 rounded-[8px] focus:border-primary focus:shadow-[0_0_10px_rgba(238,124,43,0.1)] transition-colors outline-none text-white text-[15px] resize-none [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#0e0906] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                    />
                                    <label htmlFor="contact-message" className="absolute text-[15px] text-white/50 bg-[#0e0906] px-1.5 duration-300 transform top-[24px] -translate-y-1/2 scale-100 z-20 origin-[0] left-[10px] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-[24px] peer-placeholder-shown:-translate-y-1/2 peer-focus:scale-[0.8] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-primary pointer-events-none transition-all">
                                        Your Message
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-4">
                                    <motion.button
                                        type="submit"
                                        disabled={status === "sending"}
                                        whileHover={{ y: -2, boxShadow: "0 8px 20px -4px rgba(238,124,43,0.25)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="py-[14px] px-10 bg-gradient-to-r from-primary to-primary-hover disabled:opacity-50 text-white font-medium rounded-[8px] transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        {status === "sending" ? (
                                            <>
                                                <span className="material-icons animate-spin text-lg">autorenew</span>
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-icons text-lg">send</span>
                                                Send Message
                                            </>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Success / Error states */}
                                {status === "success" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2 text-green-400 text-sm font-medium mt-4 bg-green-500/10 py-3 rounded-[8px] border border-green-500/10"
                                    >
                                        <span className="material-icons text-lg">check_circle</span>
                                        Message sent! We'll be in touch shortly.
                                    </motion.div>
                                )}
                                {status === "error" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2 text-red-400 text-sm font-medium mt-4 bg-red-500/10 py-3 rounded-[8px] border border-red-500/10"
                                    >
                                        <span className="material-icons text-lg">error</span>
                                        Connection failed. Please try again.
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
                                title="Lumière Restaurant Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573291394!2d-73.98784368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
                                width="100%"
                                height="650"
                                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)" }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </M>
                </div>
            </Section>
        </div>
    );
};

export default AboutContact;

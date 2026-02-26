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
            <section className="relative h-[70vh] min-h-[520px] flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"
                        alt="Restaurant interior"
                        className="w-full h-full object-cover scale-105 opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/60 to-dark" />
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
            <Section className="py-24 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <M variants={fadeUp} className="text-center mb-16">
                        <h2 className="section-label">What Drives Us</h2>
                        <h3 className="section-title">
                            Our <span className="text-primary">Vision</span> & Mission
                        </h3>
                    </M>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: "visibility",
                                title: "Our Vision",
                                text: "To be a global beacon of culinary excellence — a place where every visit transcends dining and becomes an unforgettable sensory journey that celebrates heritage, innovation, and the art of gathering.",
                            },
                            {
                                icon: "flag",
                                title: "Our Mission",
                                text: "We craft world-class dining experiences through ethically sourced ingredients, masterful technique, and heartfelt hospitality — nurturing a community that values quality, creativity, and sustainability.",
                            },
                        ].map((card, i) => (
                            <M key={card.title} variants={fadeUp} custom={i}>
                                <motion.div
                                    whileHover={{ y: -6, boxShadow: "0 0 40px rgba(238,124,43,0.12)" }}
                                    transition={{ duration: 0.3 }}
                                    className="glass-card rounded-2xl p-10 h-full"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                        <span className="material-icons text-2xl text-primary">{card.icon}</span>
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-4">{card.title}</h4>
                                    <p className="text-stone-400 font-light leading-relaxed">{card.text}</p>
                                </motion.div>
                            </M>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ══════════════════ 4. MEET THE TEAM ═════════════════════ */}
            <Section className="py-24 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <M variants={fadeUp} className="text-center mb-16">
                        <h2 className="section-label">The Artisans</h2>
                        <h3 className="section-title">
                            Meet Our <span className="text-primary">Team</span>
                        </h3>
                    </M>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {teamMembers.map((member, i) => (
                            <M key={member.name} variants={fadeUp} custom={i}>
                                <motion.div
                                    whileHover={{ scale: 1.03, y: -6 }}
                                    transition={{ duration: 0.35 }}
                                    className="glass-card rounded-2xl p-8 text-center"
                                >
                                    <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/10">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                if (member.fallback) e.currentTarget.src = member.fallback;
                                            }}
                                        />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                                    <p className="text-primary text-sm font-bold uppercase tracking-widest mb-3">{member.role}</p>
                                    <p className="text-stone-400 text-sm font-light leading-relaxed">{member.bio}</p>
                                </motion.div>
                            </M>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ═══════════════ 5. CONTACT INFORMATION ══════════════════ */}
            <Section className="py-24 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <M variants={fadeUp} className="text-center mb-16">
                        <h2 className="section-label">Reach Out</h2>
                        <h3 className="section-title">
                            Contact <span className="text-primary">Information</span>
                        </h3>
                    </M>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactCards.map((card, i) => (
                            <M key={card.title} variants={fadeUp} custom={i}>
                                <motion.div
                                    whileHover={{ y: -4, boxShadow: "0 0 30px rgba(238,124,43,0.1)" }}
                                    transition={{ duration: 0.3 }}
                                    className="glass-card rounded-2xl p-8 text-center h-full"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                                        <span className="material-icons text-2xl text-primary">{card.icon}</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-3">{card.title}</h4>
                                    {card.lines.map((line) => (
                                        <p key={line} className="text-stone-400 text-sm font-light leading-relaxed">{line}</p>
                                    ))}
                                </motion.div>
                            </M>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ══════════════════ 6. CONTACT FORM ══════════════════════ */}
            <Section className="py-24 px-4 md:px-8">
                <div className="max-w-3xl mx-auto">
                    <M variants={fadeUp} className="text-center mb-16">
                        <h2 className="section-label">Get In Touch</h2>
                        <h3 className="section-title">
                            Send Us A <span className="text-primary">Message</span>
                        </h3>
                    </M>

                    <M variants={fadeUp} custom={1}>
                        <div className="glass-card rounded-2xl p-8 md:p-12">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Row: Name + Email */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { name: "name", label: "Full Name", type: "text" },
                                        { name: "email", label: "Email Address", type: "email" },
                                    ].map((field) => (
                                        <div key={field.name} className="input-floating-label relative">
                                            <input
                                                id={`contact-${field.name}`}
                                                type={field.type}
                                                name={field.name}
                                                value={form[field.name]}
                                                onChange={handleChange}
                                                required
                                                placeholder=" "
                                                className="peer w-full px-4 pt-6 pb-3 bg-white/5 border border-stone-700 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none text-white"
                                            />
                                            <label
                                                htmlFor={`contact-${field.name}`}
                                                className="absolute left-4 top-4 text-stone-500 text-sm transition-all pointer-events-none peer-focus:text-primary peer-focus:-translate-y-2.5 peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.85]"
                                            >
                                                {field.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* Phone */}
                                <div className="input-floating-label relative">
                                    <input
                                        id="contact-phone"
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder=" "
                                        className="peer w-full px-4 pt-6 pb-3 bg-white/5 border border-stone-700 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none text-white"
                                    />
                                    <label
                                        htmlFor="contact-phone"
                                        className="absolute left-4 top-4 text-stone-500 text-sm transition-all pointer-events-none peer-focus:text-primary peer-focus:-translate-y-2.5 peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.85]"
                                    >
                                        Phone Number (Optional)
                                    </label>
                                </div>

                                {/* Message */}
                                <div className="input-floating-label relative">
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder=" "
                                        className="peer w-full px-4 pt-6 pb-3 bg-white/5 border border-stone-700 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none text-white resize-none"
                                    />
                                    <label
                                        htmlFor="contact-message"
                                        className="absolute left-4 top-4 text-stone-500 text-sm transition-all pointer-events-none peer-focus:text-primary peer-focus:-translate-y-2.5 peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.85]"
                                    >
                                        Your Message
                                    </label>
                                </div>

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    disabled={status === "sending"}
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(238,124,43,0.35)" }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-3 disabled:opacity-50"
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

                                {/* Success / Error states */}
                                {status === "success" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2 text-green-400 font-medium mt-4"
                                    >
                                        <span className="material-icons text-lg">check_circle</span>
                                        Your message has been sent successfully!
                                    </motion.div>
                                )}
                                {status === "error" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2 text-red-400 font-medium mt-4"
                                    >
                                        <span className="material-icons text-lg">error</span>
                                        Something went wrong. Please try again.
                                    </motion.div>
                                )}
                            </form>
                        </div>
                    </M>
                </div>
            </Section>

            {/* ═══════════════════ 7. GOOGLE MAP ═══════════════════════ */}
            <Section className="py-24 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <M variants={fadeUp} className="text-center mb-16">
                        <h2 className="section-label">Find Us</h2>
                        <h3 className="section-title">
                            Our <span className="text-primary">Location</span>
                        </h3>
                    </M>

                    <M variants={fadeUp} custom={1}>
                        <div className="rounded-2xl overflow-hidden border border-primary/20 shadow-lg shadow-primary/5">
                            <iframe
                                title="Lumière Restaurant Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573291394!2d-73.98784368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
                                width="100%"
                                height="450"
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

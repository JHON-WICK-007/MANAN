import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState("");
    const [subscribeStatus, setSubscribeStatus] = useState("");

    const footerSections = [
        {
            title: "Quick Links",
            links: [
                { name: "Home", path: "/" },
                { name: "Menu", path: "/menu" },
                { name: "Book Table", path: "/table" },
                { name: "Cart", path: "/cart" },
            ],
        },
        {
            title: "Support",
            links: [
                { name: "Profile", path: "/profile" },
                { name: "Order Status", path: "/order-status" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
            ],
        },
    ];

    const socialIcons = [
        {
            name: "Facebook",
            type: "svg",
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" className="w-[18px] h-[18px]">
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                </svg>
            ),
            url: "https://facebook.com"
        },
        {
            name: "Instagram",
            type: "svg",
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-[18px] h-[18px]">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
            ),
            url: "https://instagram.com"
        },
        {
            name: "YouTube",
            type: "svg",
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className="w-[18px] h-[18px]">
                    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                </svg>
            ),
            url: "https://youtube.com"
        },
        {
            name: "LinkedIn",
            type: "svg",
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-[18px] h-[18px]">
                    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                </svg>
            ),
            url: "https://linkedin.com"
        },
        {
            name: "X",
            type: "svg",
            svg: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-[18px] h-[18px]">
                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                </svg>
            ),
            url: "https://x.com"
        },
    ];

    const contactInfo = [
        { icon: "phone", text: "+91 99099 88088", link: "tel:+15551234567", label: "Call us" },
        { icon: "email", text: "lumiere@gmail.com", link: "mailto:info@lumiere.com", label: "Email us" },
        { icon: "location_on", text: "123 Gourmet St, Food City", link: "#", label: "Visit us" },
    ];

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribeStatus("loading");
            setTimeout(() => {
                setSubscribeStatus("success");
                setEmail("");
            }, 1200); // Simulate network request
        }
    };

    const closeSubscribeModal = () => {
        setSubscribeStatus("");
    };

    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => setIsAtTop(window.scrollY < 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollBtn = (e) => {
        if (isAtTop) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        e.currentTarget.blur();
    };

    return (
        <footer className="relative bg-dark-deep overflow-hidden border-t border-white/5">
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8 lg:gap-12 xl:gap-16 items-start pb-8 border-b border-white/5 w-full">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="relative w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                                <span className="material-icons text-white text-2xl">restaurant</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">
                                    Lumière<span className="text-primary">.</span>
                                </h3>
                                <p className="text-sm font-medium text-primary">Fine Dining</p>
                            </div>
                        </Link>

                        <p className="text-stone-400 leading-relaxed mb-8 text-base font-light lg:pr-6 xl:pr-10">
                            Where culinary excellence meets unparalleled ambiance.
                            Making every meal a memorable journey since 1984.
                        </p>

                        {/* Social Icons */}
                        <div className="flex flex-nowrap gap-2.5 items-center">
                            {socialIcons.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex-shrink-0 border border-transparent rounded-xl glass-light flex items-center justify-center text-stone-400 hover:text-primary hover:border-primary/50 hover:shadow-[0_0_15px_-3px_rgba(238,124,43,0.4)] transition-all duration-300 group box-border"
                                    aria-label={`Visit our ${social.name} page`}
                                >
                                    {social.type === 'svg' ? (
                                        <div className="flex items-center justify-center transition-colors duration-300">
                                            {social.svg}
                                        </div>
                                    ) : (
                                        <span className="material-icons text-xl transition-colors duration-300">
                                            {social.icon}
                                        </span>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Sections (Quick Links & Support) */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="lg:col-span-1">
                            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest relative inline-block">
                                {section.title}
                                <div
                                    className="absolute -bottom-2 left-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-transparent"
                                    style={{ width: "60%" }}
                                />
                            </h4>

                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-stone-400 hover:text-primary transition-colors duration-300 inline-block text-base font-light"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Info Section */}
                    <div className="lg:col-span-1">
                        <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest relative inline-block">
                            Contact Info
                            <div
                                className="absolute -bottom-2 left-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-transparent"
                                style={{ width: "60%" }}
                            />
                        </h4>

                        <ul className="space-y-5">
                            {contactInfo.map((item) => (
                                <li key={item.text}>
                                    <a
                                        href={item.link}
                                        className="flex items-center gap-4 group w-full min-w-0"
                                        aria-label={item.label}
                                    >
                                        <div className="flex-shrink-0 w-11 h-11 border border-transparent rounded-xl glass-light flex items-center justify-center transition-all duration-300 group-hover:text-primary group-hover:border-primary/50 group-hover:shadow-[0_0_15px_-3px_rgba(238,124,43,0.4)]">
                                            <span className="material-icons text-lg text-primary transition-colors duration-300">
                                                {item.icon}
                                            </span>
                                        </div>
                                        <p className="text-base font-light text-stone-400 group-hover:text-primary transition-colors duration-300 truncate">
                                            {item.text}
                                        </p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="py-6 border-b border-white/5">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="mb-6">
                            <h2 className="section-label">Stay Connected</h2>
                            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                                Subscribe to Our Newsletter
                            </h3>
                            <p className="text-stone-400 text-lg font-light">
                                Get exclusive deals, new menu updates, and special offers delivered to your inbox.
                            </p>
                        </div>

                        <form onSubmit={handleSubscribe} noValidate className="mt-10 max-w-2xl mx-auto w-full">
                            <div className="flex flex-col sm:flex-row gap-4 relative items-stretch w-full" style={{ boxSizing: 'border-box' }}>
                                <input
                                    id="footer-email-input"
                                    type="email"
                                    value={email}
                                    // Simple onChange handler strictly bound to state
                                    onChange={(e) => setEmail(e.target.value)}
                                    // Validation moved to onBlur instead of onChange for better performance
                                    onBlur={(e) => {
                                        // Place any complex validation or formatting here
                                        console.log("Input validated on blur:", e.target.value);
                                    }}
                                    required
                                    spellCheck="false"
                                    autoComplete="email"
                                    placeholder="Enter your email address"
                                    style={{ boxSizing: 'border-box', minWidth: 0 }}
                                    className="footer-newsletter-input flex-1 min-w-0 box-border w-full min-h-[56px] h-[56px] overflow-hidden px-6 text-white text-[16px] placeholder:text-stone-500 rounded-xl border-2 border-primary/40 hover:border-primary/70 outline-none focus:outline-none ring-0 ring-transparent ring-offset-transparent focus:ring-0 focus:ring-transparent focus:ring-offset-0 focus:border-primary focus:shadow-[0_0_0_3px_rgba(238,124,43,0.1)] transition-colors duration-300 bg-transparent appearance-none shrink"
                                />

                                <button
                                    type="submit"
                                    disabled={subscribeStatus === 'loading'}
                                    className="footer-subscribe-btn flex-none shrink-0 min-h-[56px] h-[56px] px-10 bg-primary text-white font-bold border border-transparent rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(238,124,43,0.5)] flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-wider text-[14px] disabled:opacity-80 disabled:cursor-not-allowed" style={{ boxSizing: 'border-box' }}
                                >
                                    {subscribeStatus === 'loading' ? (
                                        <>
                                            <span className="material-icons animate-spin text-lg">autorenew</span>
                                            Subscribing...
                                        </>
                                    ) : (
                                        "Subscribe"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold tracking-widest text-stone-600 uppercase">
                    <p className="flex items-center gap-2">
                        © {currentYear} Lumière Restaurant Group. All rights reserved.
                        <span className="hidden md:inline">Crafted with</span>
                        <span className="text-red-500">❤️</span>
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                className="transition-colors text-stone-600 hover:text-primary"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subscription Success Modal */}
            {subscribeStatus === "success" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm modal-backdrop-animate">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0"
                        onClick={closeSubscribeModal}
                    ></div>

                    {/* Modal Content */}
                    <div
                        className="relative w-full max-w-sm rounded-[24px] p-8 text-center modal-content-animate shadow-2xl"
                        style={{
                            background: '#1A1412',
                            border: '2px solid rgba(34, 197, 94, 0.15)',
                            boxShadow: '0 0 80px rgba(34, 197, 94, 0.08), inset 0 1px 0 rgba(255,255,255,0.03)',
                            fontFamily: '"Outfit", "Plus Jakarta Sans", "Inter", -apple-system, sans-serif'
                        }}
                    >
                        {/* Subtle ambient green glow perfectly centered in the modal background */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-green-500/10 rounded-full blur-[40px] pointer-events-none"></div>

                        {/* Icon - completely bare, no background */}
                        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 relative z-10">
                            <span className="material-icons text-[38px]" style={{ color: '#22c55e' }}>mark_email_read</span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Subscribed Successfully</h2>

                        <p className="text-stone-400 text-[15px] mb-8 leading-relaxed max-w-[280px] mx-auto">
                            You can now receive exclusive updates from <strong className="text-white font-semibold">Lumière</strong>.
                        </p>

                        <span
                            onClick={closeSubscribeModal}
                            className="cursor-pointer text-lg font-bold mt-4 inline-block relative z-10"
                            style={{ color: '#22c55e', transition: 'color 0.2s ease' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                            onMouseLeave={e => e.currentTarget.style.color = '#22c55e'}
                        >
                            Got it!
                        </span>
                    </div>
                </div>
            )}

            {/* Back to Top Button */}
            <button
                onClick={handleScrollBtn}
                className="fixed bottom-8 right-8 z-50 group"
                aria-label={isAtTop ? 'Scroll to bottom' : 'Back to top'}
                style={{ outline: 'none', border: 'none', background: 'none', padding: 0 }}
            >
                {/* Pulsing ring */}
                <span
                    className="absolute inset-0 rounded-2xl animate-ping"
                    style={{
                        background: 'rgba(238,124,43,0.25)',
                        animationDuration: '2s',
                    }}
                />
                {/* Main button */}
                <span
                    className="relative flex items-center justify-center w-10 h-10 rounded-2xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(238,124,43,0.9) 0%, rgba(217,110,31,0.95) 100%)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        boxShadow: '0 0 0 1px rgba(238,124,43,0.4), 0 8px 24px -4px rgba(238,124,43,0.5)',
                        transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = '0 0 0 1px rgba(238,124,43,0.7), 0 0 40px -4px rgba(238,124,43,0.8), 0 12px 32px -4px rgba(0,0,0,0.4)';
                        e.currentTarget.style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = '0 0 0 1px rgba(238,124,43,0.4), 0 8px 24px -4px rgba(238,124,43,0.5)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <span
                        className="material-icons text-white text-2xl"
                        style={{
                            lineHeight: 1,
                            display: 'block',
                            transform: isAtTop ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        keyboard_arrow_up
                    </span>
                </span>
            </button>
        </footer>
    );
};

export default Footer;
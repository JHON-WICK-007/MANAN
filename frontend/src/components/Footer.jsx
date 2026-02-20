import { useState } from "react";
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
        { name: "Facebook", icon: "facebook", url: "https://facebook.com" },
        { name: "Instagram", icon: "camera_alt", url: "https://instagram.com" },
        { name: "Twitter", icon: "alternate_email", url: "https://twitter.com" },
    ];

    const contactInfo = [
        { icon: "phone", text: "+1 (555) 123-4567", link: "tel:+15551234567", label: "Call us" },
        { icon: "email", text: "info@lumiere.com", link: "mailto:info@lumiere.com", label: "Email us" },
        { icon: "location_on", text: "123 Gourmet St, Food City", link: "#", label: "Visit us" },
    ];

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribeStatus("success");
            setTimeout(() => {
                setEmail("");
                setSubscribeStatus("");
            }, 3000);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative bg-dark-deep overflow-hidden border-t border-white/5">
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 pb-16 border-b border-white/5">
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

                        <p className="text-stone-400 leading-relaxed mb-8 text-base font-light">
                            Where culinary excellence meets unparalleled ambiance.
                            Making every meal a memorable journey since 1984.
                        </p>

                        {/* Social Icons */}
                        <div className="flex flex-wrap gap-3">
                            {socialIcons.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-xl glass-light flex items-center justify-center text-stone-400 hover:text-primary hover:border-primary/30 transition-all duration-300 group"
                                    aria-label={`Visit our ${social.name} page`}
                                >
                                    <span className="material-icons text-xl group-hover:scale-110 transition-transform duration-300">
                                        {social.icon}
                                    </span>
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
                                            className="text-stone-400 hover:text-primary transition-colors duration-300 inline-flex items-center gap-2 text-base font-light group"
                                        >
                                            <span className="material-icons text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary">
                                                arrow_forward
                                            </span>
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
                                        className="flex items-center gap-4 group"
                                        aria-label={item.label}
                                    >
                                        <div className="flex-shrink-0 w-11 h-11 rounded-xl glass-light flex items-center justify-center transition-all duration-300 group-hover:border-primary/30">
                                            <span className="material-icons text-lg text-primary">
                                                {item.icon}
                                            </span>
                                        </div>
                                        <p className="text-base font-light text-stone-400 group-hover:text-primary transition-colors duration-300">
                                            {item.text}
                                        </p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="py-16 border-b border-white/5">
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

                        <form onSubmit={handleSubscribe} className="mt-10 max-w-2xl mx-auto">
                            <div className="flex flex-col sm:flex-row gap-4 relative items-stretch">
                                <div className="flex-1 w-full relative">
                                    <input
                                        id="footer-email-input"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Enter your email address"
                                        className="footer-newsletter-input w-full h-14 px-6 text-white text-base placeholder:text-stone-500 focus:outline-none transition-all duration-300 bg-transparent"
                                    />
                                    {subscribeStatus === "success" && (
                                        <div className="absolute -bottom-8 left-0 text-sm font-medium flex items-center gap-2 text-green-400 footer-subscribe-success">
                                            <span className="material-icons text-sm">check_circle</span>
                                            Thanks for subscribing!
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="footer-subscribe-btn h-14 px-10 bg-primary text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(238,124,43,0.5)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-wider text-sm"
                                >
                                    <span className="material-icons text-lg">send</span>
                                    Subscribe
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

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white z-50 animate-float hover:shadow-[0_0_30px_-5px_rgba(238,124,43,0.5)] transition-shadow duration-300"
                aria-label="Back to top"
            >
                <span className="material-icons text-xl">arrow_upward</span>
            </button>
        </footer>
    );
};

export default Footer;

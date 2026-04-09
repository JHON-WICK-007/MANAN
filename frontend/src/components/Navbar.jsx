import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const NAV_COLOR = "#EE7C2B";
const NAV_COLOR_DARK = "#d4621a";

const navLinks = [
    { name: "Home", path: "/", protected: false },
    { name: "Menu", path: "/menu", protected: false },
    { name: "Reservations", path: "/table", protected: true },
    { name: "Cart", path: "/cart", protected: true },
    { name: "Order Status", path: "/order-status", protected: true },
    { name: "About", path: "/about", protected: false },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const lastScrollY = useRef(0);
    const location = useLocation();
    const { isAuthenticated, logout, user } = useAuth();

    const visibleLinks = navLinks.filter(link => !link.protected || isAuthenticated);

    // Hide on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 50);

            if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
                setIsVisible(false);
                setIsMobileMenuOpen(false);
            } else {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: isVisible ? 0 : "-100%" }}
                transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1.2 }}
                className={`fixed top-0 left-0 right-0 z-50 h-20 ${isScrolled ? "nav-scrolled" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-8 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* Logo + Desktop Nav — Left */}
                        <div className="flex items-center space-x-8 mr-auto">

                            {/* Logo */}
                            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg logo-circle"
                                    style={{
                                        background: `linear-gradient(135deg, ${NAV_COLOR}, ${NAV_COLOR_DARK})`,
                                        boxShadow: `0 4px 15px ${NAV_COLOR}40`,
                                    }}
                                >
                                    <span className="text-2xl font-bold text-white">L</span>
                                </div>
                                <span className="text-2xl font-bold text-white hover:text-primary transition-colors duration-300">
                                    Lumière<span style={{ color: NAV_COLOR }}>.</span>
                                </span>
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden lg:flex items-center space-x-1">
                                {visibleLinks.map((link) => {
                                    const active = isActive(link.path);
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`relative px-4 py-2 text-sm font-medium uppercase tracking-wide ${active ? "text-primary" : "text-gray-300 hover:text-white"
                                                }`}
                                        >
                                            {link.name}
                                            <div
                                                className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full origin-center ${active ? "transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]" : ""
                                                    }`}
                                                style={{
                                                    background: `linear-gradient(to right, ${NAV_COLOR}, ${NAV_COLOR_DARK})`,
                                                    transform: active ? "scaleX(1)" : "scaleX(0)",
                                                }}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Auth + Cart — Right */}
                        <div className="hidden lg:flex items-center space-x-4 ml-auto">
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-6 py-2.5 text-white font-medium rounded-xl border border-white/20 hover:bg-white/10 transition-colors duration-300"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-6 py-2.5 text-white font-semibold rounded-xl shadow-lg hover:brightness-110 transition-[filter] duration-300"
                                        style={{
                                            background: `linear-gradient(135deg, ${NAV_COLOR}, ${NAV_COLOR_DARK})`,
                                            boxShadow: `0 4px 15px ${NAV_COLOR}40`,
                                        }}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile" className="px-3 py-1.5 text-white font-medium hover:text-primary transition-all duration-300 flex items-center gap-4 group !outline-none !border-none !ring-0 !shadow-none focus:outline-none focus:ring-0">
                                        {user?.profileImage ? (
                                            <div className="w-14 h-14 rounded-full overflow-hidden !outline-none !border-none !ring-0 !shadow-none">
                                                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover !outline-none !border-none !ring-0" />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:text-primary transition-all duration-300">
                                                <span className="material-icons text-3xl">person</span>
                                            </div>
                                        )}
                                    </Link>
                                    <button onClick={logout} className="px-5 py-2.5 text-white/50 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300">
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile — Cart + Hamburger */}
                        <div className="lg:hidden flex items-center gap-4">


                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-white hover:text-primary transition-colors duration-300"
                                aria-label="Toggle menu"
                            >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden bg-dark/98 border-t border-white/10"
                        >
                            <div className="px-6 py-6 space-y-3">
                                {visibleLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`block px-5 py-3 rounded-xl font-medium border ${isActive(link.path)
                                            ? "border-primary/50 bg-primary/10 text-primary"
                                            : "border-transparent text-gray-300 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                <div className="border-t border-white/10 my-4" />

                                {!isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block px-5 py-3 text-center text-white font-medium rounded-xl border border-white/20 hover:bg-white/10 transition-colors duration-300"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block px-5 py-3 text-center text-white font-semibold rounded-xl transition-colors duration-300"
                                            style={{
                                                background: `linear-gradient(135deg, ${NAV_COLOR}, ${NAV_COLOR_DARK})`,
                                            }}
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/profile" className="flex flex-col items-center gap-4 px-6 py-8 text-center text-primary font-bold text-xl rounded-[2.5rem] border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 shadow-2xl">
                                            {user?.profileImage ? (
                                                <img src={user.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/40 shadow-[0_10px_30px_rgba(238,124,43,0.3)]" />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                                                    <span className="material-icons text-5xl">person</span>
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <span className="block text-2xl text-white">{user?.name || "Account"}</span>
                                                <span className="block text-xs uppercase tracking-[0.3em] text-primary/70">View Your Profile</span>
                                            </div>
                                        </Link>
                                        <button onClick={logout} className="w-full px-5 py-3 text-center text-red-400 font-medium rounded-xl border border-red-500/20 hover:bg-red-500/10 transition-colors duration-300 mt-2">
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
};

export default Navbar;

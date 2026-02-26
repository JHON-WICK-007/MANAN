import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import CartSidebar from "./CartSidebar";
import "./Navbar.css";

const NAV_COLOR = "#EE7C2B";
const NAV_COLOR_DARK = "#d4621a";

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Reservations", path: "/table" },
    { name: "Cart", path: "/cart" },
    { name: "Order Status", path: "/order-status" },
    { name: "Profile", path: "/profile" },
    { name: "About", path: "/about" },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const lastScrollY = useRef(0);
    const location = useLocation();
    const { itemCount } = useCart();

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
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors duration-300 ${isActive(link.path)
                                                ? "text-primary"
                                                : "text-gray-300 hover:text-white"
                                            }`}
                                    >
                                        {link.name}
                                        {isActive(link.path) && (
                                            <motion.div
                                                layoutId="activeUnderline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                                                style={{
                                                    background: `linear-gradient(to right, ${NAV_COLOR}, ${NAV_COLOR_DARK})`,
                                                }}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Auth + Cart — Right */}
                        <div className="hidden lg:flex items-center space-x-4 ml-auto">

                            {/* Cart Button — no scale, color transition only */}
                            <button
                                onClick={() => setCartOpen(true)}
                                className="relative p-2 text-gray-300 hover:text-white transition-colors duration-300"
                            >
                                <span className="material-icons text-2xl">shopping_bag</span>
                                {itemCount > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-dark"
                                        style={{ background: NAV_COLOR }}
                                    >
                                        {itemCount}
                                    </span>
                                )}
                            </button>

                            {/* Login */}
                            <Link
                                to="/login"
                                className="px-6 py-2.5 text-white font-medium rounded-xl border border-white/20 hover:bg-white/10 transition-colors duration-300"
                            >
                                Login
                            </Link>

                            {/* Sign Up — no scale, brightness only */}
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
                        </div>

                        {/* Mobile — Cart + Hamburger */}
                        <div className="lg:hidden flex items-center gap-4">
                            <button
                                onClick={() => setCartOpen(true)}
                                className="relative p-2 text-gray-300 hover:text-white transition-colors duration-300"
                            >
                                <span className="material-icons text-2xl">shopping_bag</span>
                                {itemCount > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
                                        style={{ background: NAV_COLOR }}
                                    >
                                        {itemCount}
                                    </span>
                                )}
                            </button>

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
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`block px-5 py-3 rounded-xl font-medium border transition-colors duration-300 ${isActive(link.path)
                                                ? "border-primary/50 bg-primary/10 text-primary"
                                                : "border-transparent text-gray-300 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                <div className="border-t border-white/10 my-4" />

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
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
};

export default Navbar;

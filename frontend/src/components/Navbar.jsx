import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartSidebar from "./CartSidebar";

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Reservations", path: "/table" },
];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const location = useLocation();
    const { itemCount } = useCart();

    return (
        <>
            <nav className="sticky top-0 z-50 glass border-b border-primary/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-icons text-primary text-3xl">restaurant</span>
                        <span className="text-2xl font-bold tracking-tighter text-white uppercase">
                            Lumière<span className="text-primary">.</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10 text-sm font-medium uppercase tracking-widest">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`hover:text-primary transition-colors ${location.pathname === link.path ? "text-primary" : ""
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        <button onClick={() => setCartOpen(true)} className="relative p-2 text-white hover:text-primary transition-colors">
                            <span className="material-icons text-2xl">shopping_bag</span>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-dark">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        <Link to="/login" className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 uppercase tracking-wider">
                            Sign In
                        </Link>

                        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white">
                            <span className="material-icons">{mobileOpen ? "close" : "menu"}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden glass border-t border-white/10 px-6 py-6 space-y-4">
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                                className={`block text-sm font-medium uppercase tracking-widest py-2 ${location.pathname === link.path ? "text-primary" : "text-stone-300"}`}>
                                {link.name}
                            </Link>
                        ))}
                        <Link to="/login" onClick={() => setMobileOpen(false)} className="block btn-primary text-center mt-4">Sign In</Link>
                    </div>
                )}
            </nav>
            <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
};

export default Navbar;

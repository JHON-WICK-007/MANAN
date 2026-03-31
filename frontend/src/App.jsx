import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Auth from "./pages/Auth/Auth";
import Table from "./pages/Table/Table";
import Cart from "./pages/Cart/Cart";
import Profile from "./pages/Profile/Profile";
import OrderStatus from "./pages/OrderStatus/OrderStatus";
import Checkout from "./pages/Checkout/Checkout";
import AboutContact from "./pages/AboutContact/AboutContact";

/* AnimatedRoutes: Removed AnimatePresence and motion wrapper to prevent Hero unmounting/fading as a container */
function AnimatedRoutes() {
    const location = useLocation();

    return (
        <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/table" element={<Table />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order-status" element={<OrderStatus />} />
            <Route path="/about" element={<AboutContact />} />
        </Routes>
    );
}

function App() {
    const location = useLocation();
    const hideNavAndFooter = ["/login", "/register"].includes(location.pathname);

    return (
        <CartProvider>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen font-display overflow-x-hidden">
                {!hideNavAndFooter && <Navbar />}
                <main className="flex-grow">
                    <AnimatedRoutes />
                </main>
                {!hideNavAndFooter && <Footer />}
            </div>
        </CartProvider>
    );
}

export default App;
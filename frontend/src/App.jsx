import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Auth from "./pages/Auth/Auth";
import Table from "./pages/Table/Table";
import Cart from "./pages/Cart/Cart";
import Profile from "./pages/Profile/Profile";
import OrderStatus from "./pages/OrderStatus/OrderStatus";
import AboutContact from "./pages/AboutContact/AboutContact";

function App() {
    return (
        <CartProvider>
            <div className="flex flex-col min-h-screen font-display overflow-x-hidden">
                <Navbar />
                <main className="flex-grow pt-20">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/login" element={<Auth />} />
                        <Route path="/register" element={<Auth />} />
                        <Route path="/table" element={<Table />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/order-status" element={<OrderStatus />} />
                        <Route path="/about" element={<AboutContact />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </CartProvider>
    );
}

export default App;
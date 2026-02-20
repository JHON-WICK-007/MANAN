import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
    const { items, removeItem, updateQuantity, clearCart, subtotal, tax, total } = useCart();

    if (items.length === 0) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <span className="material-icons text-8xl text-stone-600 mb-6">shopping_bag</span>
                <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
                <p className="text-stone-400 mb-8 max-w-md">Looks like you haven't added anything yet. Explore our menu and discover culinary perfection.</p>
                <Link to="/menu" className="btn-primary">Browse Menu</Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-white mb-2">Your Cart</h1>
                <p className="text-stone-400 mb-10">{items.length} {items.length === 1 ? "item" : "items"} in your cart</p>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div key={item._id} className="flex gap-6 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-all">
                                <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-dark-card">
                                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                        <span className="text-primary font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <p className="text-sm text-white/40 mb-4">₹{item.price.toFixed(2)} each</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-primary/20 text-white/70 hover:text-primary transition-all">
                                                <span className="material-icons text-sm">remove</span>
                                            </button>
                                            <span className="px-4 text-sm font-bold text-white">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white">
                                                <span className="material-icons text-sm">add</span>
                                            </button>
                                        </div>
                                        <button onClick={() => removeItem(item._id)} className="text-white/30 hover:text-red-400 transition-colors flex items-center gap-1 text-sm">
                                            <span className="material-icons text-sm">delete_outline</span> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button onClick={clearCart} className="text-stone-500 hover:text-red-400 text-sm flex items-center gap-1 mt-2 transition-colors">
                            <span className="material-icons text-sm">remove_shopping_cart</span> Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass rounded-2xl p-8 sticky top-28">
                            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Order Summary</h3>

                            {/* Promo Code */}
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                                <span className="material-icons text-primary text-sm">local_offer</span>
                                <input type="text" placeholder="Promo code" className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/30 w-full outline-none" />
                                <button className="text-primary font-bold text-xs uppercase">Apply</button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm"><span className="text-white/60">Subtotal</span><span className="text-white">₹{subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-white/60">Tax (5%)</span><span className="text-white">₹{tax.toFixed(2)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-white/60">Delivery Fee</span><span className="text-green-400">FREE</span></div>
                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-lg font-bold text-white">Total</span>
                                    <span className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                                Place Order
                                <span className="material-icons">arrow_forward</span>
                            </button>
                            <p className="text-center text-[10px] text-white/30 uppercase tracking-[0.2em] mt-4">Secure encrypted checkout</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Cart;

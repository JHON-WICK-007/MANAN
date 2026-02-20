import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose }) => {
    const { items, removeItem, updateQuantity, itemCount, subtotal, tax, total } = useCart();
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <aside className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md flex flex-col shadow-2xl"
                style={{ background: 'rgba(34, 24, 16, 0.85)', backdropFilter: 'blur(16px)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>

                {/* Header */}
                <div className="p-6 flex justify-between items-center border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Your Order</h2>
                        <p className="text-xs text-white/50 uppercase tracking-widest mt-1">{itemCount} {itemCount === 1 ? "Item" : "Items"} Selected</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <span className="material-icons text-white">close</span>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <span className="material-icons text-6xl text-stone-600 mb-4">shopping_bag</span>
                            <p className="text-stone-400 text-lg font-medium mb-2">Your cart is empty</p>
                            <p className="text-stone-500 text-sm">Add items from the menu to get started</p>
                        </div>
                    ) : (
                        <>
                            {items.map((item) => (
                                <div key={item._id} className="flex gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-dark-card">
                                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-white font-medium">{item.name}</h3>
                                            <span className="text-primary font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-white/40 mt-1">${item.price.toFixed(2)} each</p>
                                        <div className="flex justify-between items-center mt-3">
                                            <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-primary/20 text-white/70 hover:text-primary transition-all">
                                                    <span className="material-icons text-sm">remove</span>
                                                </button>
                                                <span className="px-3 text-sm font-medium text-white">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-md bg-primary text-white shadow-lg shadow-primary/20">
                                                    <span className="material-icons text-sm">add</span>
                                                </button>
                                            </div>
                                            <button onClick={() => removeItem(item._id)} className="text-white/30 hover:text-red-400 transition-colors">
                                                <span className="material-icons text-sm">delete_outline</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Promo Code */}
                            <div className="mt-4">
                                <div className="flex items-center gap-2 p-4 rounded-xl bg-primary/10 border border-primary/20">
                                    <span className="material-icons text-primary">local_offer</span>
                                    <input type="text" placeholder="Add promo code" className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/30 w-full outline-none" />
                                    <button className="text-primary font-bold text-sm uppercase whitespace-nowrap">Apply</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Summary */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-white/10 mt-auto" style={{ background: 'rgba(34, 24, 16, 0.85)' }}>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm"><span className="text-white/60">Subtotal</span><span className="text-white">${subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-white/60">Tax (5%)</span><span className="text-white">${tax.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-white/60">Delivery Fee</span><span className="text-green-400">FREE</span></div>
                            <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                <span className="text-lg font-bold text-white">Total</span>
                                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button onClick={() => { onClose(); navigate("/cart"); }}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg flex justify-between items-center px-6 transition-all shadow-xl shadow-primary/20 group">
                            <span>Go to Checkout</span>
                            <span className="flex items-center gap-2">${total.toFixed(2)}<span className="material-icons group-hover:translate-x-1 transition-transform">arrow_forward</span></span>
                        </button>
                        <p className="text-center text-[10px] text-white/30 uppercase tracking-[0.2em] mt-4">Secure encrypted checkout</p>
                    </div>
                )}
            </aside>
        </>
    );
};

export default CartSidebar;

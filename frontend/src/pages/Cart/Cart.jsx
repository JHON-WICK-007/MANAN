import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
    const { items, removeItem, updateQuantity, clearCart, subtotal, tax, total, activeDiscount, discountLabel, promoCode: contextPromoCode, applyDiscount, removeDiscount } = useCart();
    const [editingQty, setEditingQty] = useState({});
    const [promoInput, setPromoInput] = useState(contextPromoCode || "");
    const [promoStatus, setPromoStatus] = useState(contextPromoCode ? "applied" : "idle"); // idle | input | error | applied
    const [promoError, setPromoError] = useState("");
    const [showQtyErrorModal, setShowQtyErrorModal] = useState(false);
    const navigate = useNavigate();

    // Static promo codes — replace with API call in production
    const PROMO_CODES = {
        SAVE20: { type: "percent", value: 20, label: "20% off" },
        FLAT100: { type: "flat", value: 100, label: "₹100 off" },
        WELCOME: { type: "percent", value: 10, label: "10% off" },
        LUMIERE50: { type: "flat", value: 50, label: "₹50 off" },
    };

    const handleApplyPromo = () => {
        const code = promoInput.trim().toUpperCase();
        if (!code) return;
        const promo = PROMO_CODES[code];
        if (promo) {
            applyDiscount(code, promo.type, promo.value, promo.label);
            setPromoStatus("applied");
            setPromoError("");
        } else {
            setPromoStatus("error");
            setPromoError("Invalid promo code");
            removeDiscount();
        }
    };

    const handleRemovePromo = () => {
        setPromoInput("");
        setPromoStatus("idle");
        setPromoError("");
        removeDiscount();
    };

    const adjustedTotal = total;

    const handleQtyChange = (itemId, value) => {
        const cleaned = value.replace(/^0+(?=\d)/, '');
        setEditingQty(prev => ({ ...prev, [itemId]: cleaned }));
    };

    const handleQtyCommit = (itemId, currentQty, e) => {
        const raw = editingQty[itemId];
        if (raw === undefined) return;
        const parsed = parseInt(raw, 10);
        if (!isNaN(parsed) && parsed >= 1) {
            if (parsed > 100) {
                setShowQtyErrorModal(true);
                updateQuantity(itemId, 100);
            } else {
                updateQuantity(itemId, parsed);
            }
        } else {
            updateQuantity(itemId, 1);
        }
        setEditingQty(prev => { const next = { ...prev }; delete next[itemId]; return next; });
    };

    if (items.length === 0) {
        return (
            <main className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4">
                <span className="material-icons text-8xl text-stone-600 mb-6">shopping_bag</span>
                <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
                <p className="text-stone-400 mb-8 max-w-md">Looks like you haven't added anything yet. Explore our menu and discover culinary perfection.</p>
                <Link to="/menu" className="btn-primary">Browse Menu</Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
                <h1 className="text-4xl font-bold text-primary mb-2">Your Cart</h1>
                <p className="text-stone-400 mb-10">{items.length} {items.length === 1 ? "item" : "items"} in your cart</p>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div key={item._id} className="cart-item-fullpage">
                                <div className="cart-item-fullpage-image">
                                    {item.image && <img src={item.image} alt={item.name} />}
                                </div>
                                <div className="cart-item-fullpage-content">
                                    <div className="cart-item-fullpage-header">
                                        <h3 className="cart-item-fullpage-title">{item.name}</h3>
                                        <span className="cart-item-fullpage-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <p className="cart-item-fullpage-unit">₹{item.price.toFixed(2)} each</p>
                                    <div className="cart-item-fullpage-spacer"></div>
                                    <div className="cart-item-fullpage-controls">
                                        <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10" style={{ width: '120px', flexShrink: 0 }}>
                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-primary/20 text-white/70 hover:text-primary transition-all" style={{ flexShrink: 0 }}>
                                                <span className="material-icons text-sm">remove</span>
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max="999"
                                                className="text-sm font-bold text-white"
                                                style={{ width: '3rem', flexShrink: 0, textAlign: 'center', background: 'transparent', border: 'none', outline: 'none', padding: 0, fontVariantNumeric: 'tabular-nums' }}
                                                value={editingQty[item._id] !== undefined ? editingQty[item._id] : item.quantity}
                                                onChange={e => handleQtyChange(item._id, e.target.value)}
                                                onBlur={() => handleQtyCommit(item._id, item.quantity)}
                                                onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
                                            />
                                            <button onClick={() => {
                                                if (item.quantity >= 100) {
                                                    setShowQtyErrorModal(true);
                                                } else {
                                                    updateQuantity(item._id, item.quantity + 1);
                                                }
                                            }}
                                                className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white" style={{ flexShrink: 0 }}>
                                                <span className="material-icons text-sm">add</span>
                                            </button>
                                        </div>
                                        <button onClick={() => removeItem(item._id)} className="cart-item-delete-btn">
                                            <span className="material-icons" style={{ fontSize: '22px' }}>delete_outline</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button onClick={clearCart} className="text-sm flex items-center gap-1 mt-6" style={{ paddingLeft: '20px', color: '#ef4444', transition: 'color 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#f87171'} onMouseLeave={e => e.currentTarget.style.color = '#ef4444'}>
                            <span className="material-icons" style={{ fontSize: '22px' }}>remove_shopping_cart</span> Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass rounded-2xl p-8 sticky top-28 border border-primary">
                            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Order Summary</h3>

                            {/* Promo Code */}
                            <div className="mb-6" style={{ minHeight: '52px' }}>
                                {/* Default: label + APPLY button */}
                                {promoStatus === "idle" && (
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
                                        <span className="material-icons text-primary text-sm">local_offer</span>
                                        <span className="text-base text-white font-medium flex-1">Promo code</span>
                                        <button
                                            onClick={() => setPromoStatus("input")}
                                            className="text-primary font-bold text-xs uppercase tracking-wider transition-colors hover:text-primary/80"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}

                                {/* Input field after clicking APPLY */}
                                {(promoStatus === "input" || promoStatus === "error") && (
                                    <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons text-primary text-sm">local_offer</span>
                                            <span className="text-base text-white font-medium flex-1">Enter Coupon Code</span>
                                            <button onClick={() => { setPromoStatus("idle"); setPromoInput(""); setPromoError(""); }}
                                                className="w-6 h-6 flex items-center justify-center rounded-full transition-colors"
                                                style={{ color: '#ef4444' }}
                                                onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'transparent'; }}
                                            >
                                                <span className="material-icons" style={{ fontSize: '14px' }}>close</span>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                autoFocus
                                                placeholder="e.g. SAVE20"
                                                value={promoInput}
                                                onChange={e => { setPromoInput(e.target.value.toUpperCase()); if (promoStatus === "error") setPromoStatus("input"); setPromoError(""); }}
                                                onKeyDown={e => { if (e.key === 'Enter') handleApplyPromo(); }}
                                                className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder:text-white/40 outline-none transition-all"
                                                style={{ background: 'rgba(255,255,255,0.05)', border: promoStatus === "error" ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}
                                                onFocus={e => { if (promoStatus !== "error") { e.target.style.borderColor = 'rgba(238,124,43,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(238,124,43,0.1)'; } }}
                                                onBlur={e => { e.target.style.borderColor = promoStatus === "error" ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                                            />
                                            <button
                                                onClick={handleApplyPromo}
                                                disabled={!promoInput.trim()}
                                                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors"
                                                style={{ background: 'rgb(238,124,43)', color: '#fff', cursor: 'pointer', border: 'none', flexShrink: 0 }}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                        {promoStatus === "error" && (
                                            <p className="text-xs ml-1" style={{ color: '#ef4444' }}>
                                                <span className="material-icons align-middle" style={{ fontSize: '14px', marginRight: '4px' }}>error_outline</span>
                                                {promoError}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Success: promo applied */}
                                {promoStatus === "applied" && (
                                    <div
                                        className="rounded-2xl p-4 transition-all duration-300"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.04) 100%)',
                                            border: '1px solid rgba(34,197,94,0.25)',
                                            boxShadow: '0 0 20px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.05)'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.boxShadow = '0 0 25px rgba(34,197,94,0.12), inset 0 1px 0 rgba(255,255,255,0.05)';
                                            e.currentTarget.style.borderColor = 'rgba(34,197,94,0.35)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.boxShadow = '0 0 20px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.05)';
                                            e.currentTarget.style.borderColor = 'rgba(34,197,94,0.25)';
                                        }}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            {/* Left: Icon + Text */}
                                            <div className="flex items-center gap-3 min-w-0">
                                                {/* Check Icon with Glow */}
                                                <div
                                                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                                    style={{
                                                        background: 'rgba(34,197,94,0.15)',
                                                        boxShadow: '0 0 12px rgba(34,197,94,0.3)'
                                                    }}
                                                >
                                                    <span className="material-icons" style={{ color: '#22c55e', fontSize: '22px' }}>check</span>
                                                </div>

                                                {/* Text Content */}
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {/* Promo Code - Primary Focus */}
                                                        <span
                                                            className="text-base font-bold tracking-wide"
                                                            style={{ color: '#22c55e' }}
                                                        >
                                                            {contextPromoCode}
                                                        </span>
                                                        {/* Badge - Pill Style */}
                                                        <span
                                                            className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider"
                                                            style={{
                                                                background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.1) 100%)',
                                                                color: '#4ade80',
                                                                border: '1px solid rgba(34,197,94,0.2)'
                                                            }}
                                                        >
                                                            {discountLabel}
                                                        </span>
                                                    </div>
                                                    {/* Savings Text - Secondary */}
                                                    <p
                                                        className="text-xs mt-1.5 font-medium"
                                                        style={{ color: 'rgba(74,222,128,0.8)' }}
                                                    >
                                                        You save ₹{activeDiscount.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right: Remove Button */}
                                            <button
                                                onClick={handleRemovePromo}
                                                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                                                style={{
                                                    color: 'rgba(255,255,255,0.4)',
                                                    background: 'transparent'
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.color = '#ef4444';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                                                }}
                                            >
                                                <span className="material-icons" style={{ fontSize: '14px' }}>close</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm"><span className="text-white/60">Subtotal</span><span className="text-white font-semibold">₹{subtotal.toFixed(2)}</span></div>
                                {activeDiscount > 0 && (
                                    <div className="flex justify-between text-sm"><span style={{ color: '#22c55e' }}>Discount</span><span className="font-semibold" style={{ color: '#22c55e' }}>-₹{activeDiscount.toFixed(2)}</span></div>
                                )}
                                <div className="flex justify-between text-sm"><span className="text-white/60">Tax (5%)</span><span className="text-white font-semibold">₹{tax.toFixed(2)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-white/60">Delivery Fee</span><span className="text-green-400 font-semibold">FREE</span></div>
                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-lg font-bold text-white">Total</span>
                                    <span className="text-2xl font-bold text-primary">₹{adjustedTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button onClick={() => navigate("/checkout")} className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                Place Order
                                <span className="material-icons">arrow_forward</span>
                            </button>
                            <p className="text-center text-[10px] text-white/60 uppercase tracking-[0.2em] mt-4">Secure encrypted checkout</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quantity Limit Error Modal */}
            {showQtyErrorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div
                        className="relative w-full max-w-sm rounded-[24px] p-8 text-center"
                        style={{
                            background: '#1A1412',
                            border: '1px solid rgba(238, 124, 43, 0.15)',
                            boxShadow: '0 0 80px rgba(238, 124, 43, 0.08), inset 0 1px 0 rgba(255,255,255,0.03)',
                            fontFamily: '"Outfit", "Plus Jakarta Sans", "Inter", -apple-system, sans-serif'
                        }}
                    >
                        {/* Subtle red glow perfectly centered behind the icon */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-[40px] pointer-events-none"></div>

                        {/* Icon */}
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10" style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
                            <span className="material-icons text-3xl" style={{ color: '#ef4444' }}>error_outline</span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Limit Exceeded</h2>

                        <p className="text-stone-400 text-[15px] mb-8 leading-relaxed max-w-[280px] mx-auto">
                            You can only add a maximum of <strong className="text-white font-semibold">100 items</strong> of the same product.
                        </p>

                        <span
                            onClick={() => setShowQtyErrorModal(false)}
                            className="cursor-pointer text-lg font-bold mt-4 inline-block"
                            style={{ color: '#ef4444', transition: 'color 0.2s ease' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                            onMouseLeave={e => e.currentTarget.style.color = '#ef4444'}
                        >
                            Got it!
                        </span>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Cart;

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const paymentMethods = [
    { id: "card", label: "Card", icon: "credit_card", desc: "Visa, MasterCard" },
    { id: "upi", label: "UPI", icon: "account_balance", desc: "Google Pay, PhonePe" },
    { id: "cod", label: "Cash on Delivery", icon: "payments", desc: "Pay at doorstep" },
    { id: "online", label: "Online Payment", icon: "language", desc: "Net Banking & more" },
];

const Checkout = () => {
    const { items, subtotal, tax, total, clearCart, activeDiscount } = useCart();
    const navigate = useNavigate();
    const [method, setMethod] = useState("card");
    const [email, setEmail] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardName, setCardName] = useState("");
    const [upiId, setUpiId] = useState("");
    const [processing, setProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (items.length === 0 && !showSuccess) {
        return (
            <main className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4">
                <span className="material-icons text-8xl text-stone-600 mb-6">receipt_long</span>
                <h1 className="text-3xl font-bold text-white mb-4">No Items to Checkout</h1>
                <p className="text-stone-400 mb-8 max-w-md">Add some items to your cart first.</p>
                <Link to="/menu" className="btn-primary">Browse Menu</Link>
            </main>
        );
    }

    const formatCardNumber = (val) => {
        const digits = val.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const formatExpiry = (val) => {
        const digits = val.replace(/\D/g, "").slice(0, 4);
        if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
        return digits;
    };

    const handlePlaceOrder = async () => {
        setProcessing(true);
        // Simulate payment processing
        await new Promise((r) => setTimeout(r, 2000));
        setProcessing(false);
        setShowSuccess(true);
    };

    if (showSuccess) {
        return (
            <main className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4">
                <div className="glass rounded-2xl p-12 max-w-lg w-full">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <div className="absolute inset-0 border-2 border-primary rounded-full animate-ping opacity-20"></div>
                        <span className="material-icons text-5xl text-primary">check_circle</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                    <p className="text-stone-400 mb-6">Your order has been placed. We'll send the details to your email.</p>
                    <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
                        <span className="text-xs text-stone-500 uppercase tracking-widest block mb-1">Amount Paid</span>
                        <span className="text-2xl font-bold text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>₹{total.toFixed(2)}</span>
                    </div>
                    <button onClick={() => { clearCart(); navigate("/"); }} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-colors">
                        Back to Home
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-20">
            <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
                {/* Header */}
                <div className="flex items-center gap-3 mb-10">
                    <Link to="/cart" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="material-icons text-white/60">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">Checkout</h1>
                        <p className="text-stone-500 text-sm">Secure payment</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-10">
                    {/* LEFT — Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="glass rounded-2xl p-6 lg:sticky lg:top-28 border border-primary">
                            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item._id} className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-dark-card">
                                            {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center gap-2">
                                                <p className="text-white text-sm font-medium truncate">{item.name}</p>
                                                <span className="text-primary text-sm font-semibold flex-shrink-0" style={{ fontVariantNumeric: "tabular-nums" }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                            <p className="text-white/30 text-xs">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px my-5" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }}></div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm"><span className="text-white/60">Subtotal</span><span className="text-white font-semibold">₹{subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-white/60">Tax (5%)</span><span className="text-white font-semibold">₹{tax.toFixed(2)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-white/60">Delivery Fee</span><span className="text-green-400 font-semibold">FREE</span></div>
                                {activeDiscount > 0 && (
                                    <div className="flex justify-between text-sm"><span className="text-green-400 font-semibold">Discount</span><span className="text-green-400 font-semibold">-₹{activeDiscount.toFixed(2)}</span></div>
                                )}
                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-lg font-bold text-white">Total</span>
                                    <span className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button onClick={handlePlaceOrder} disabled={processing} className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                                {processing ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Place Order
                                        <span className="material-icons">arrow_forward</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-white/60 uppercase tracking-[0.2em] mt-4">Secure encrypted checkout</p>
                        </div>
                    </div>

                    {/* RIGHT — Payment */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Contact */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em] mb-5">Contact Information</h3>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="input-dark"
                            />
                        </div>

                        {/* Payment Method */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em] mb-5">Payment Method</h3>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {paymentMethods.map((pm) => (
                                    <button
                                        key={pm.id}
                                        onClick={() => setMethod(pm.id)}
                                        className={`group flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${method === pm.id
                                            ? "border-primary bg-primary/[0.08] shadow-[inset_0_0_0_1px_rgba(238,124,43,0.3)]"
                                            : "border-white/5 bg-white/[0.02] hover:border-primary hover:shadow-[0_0_15px_rgba(238,124,43,0.5)]"
                                            }`}
                                    >
                                        <span className={`material-icons text-xl transition-colors duration-300 ${method === pm.id ? "text-primary" : "text-white/40 group-hover:text-primary"}`}>{pm.icon}</span>
                                        <div className="text-left">
                                            <p className={`text-sm font-semibold transition-colors duration-300 ${method === pm.id ? "text-white" : "text-white/70 group-hover:text-white"}`}>{pm.label}</p>
                                            <p className="text-[11px] text-white/30">{pm.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Card Fields */}
                            {method === "card" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-white/30 uppercase tracking-wider mb-2 block">Cardholder Name</label>
                                        <input
                                            type="text"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            placeholder="Full name on card"
                                            className="input-dark"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-white/30 uppercase tracking-wider mb-2 block">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                className="input-dark"
                                                style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.1em" }}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                                <div className="w-8 h-5 rounded bg-white/10 flex items-center justify-center text-[9px] font-bold text-white/40">VISA</div>
                                                <div className="w-8 h-5 rounded bg-white/10 flex items-center justify-center text-[9px] font-bold text-white/40">MC</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-white/30 uppercase tracking-wider mb-2 block">Expiry</label>
                                            <input
                                                type="text"
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                                placeholder="MM / YY"
                                                maxLength={7}
                                                className="input-dark"
                                                style={{ fontVariantNumeric: "tabular-nums" }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-white/30 uppercase tracking-wider mb-2 block">CVV</label>
                                            <input
                                                type="password"
                                                value={cardCvv}
                                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                                placeholder="&bull;&bull;&bull;&bull;"
                                                maxLength={4}
                                                className="input-dark"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* UPI */}
                            {method === "upi" && (
                                <div>
                                    <label className="text-xs text-white/30 uppercase tracking-wider mb-2 block">UPI ID</label>
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="yourname@upi"
                                        className="input-dark"
                                    />
                                </div>
                            )}

                            {/* COD */}
                            {method === "cod" && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15">
                                    <span className="material-icons text-emerald-400">info</span>
                                    <p className="text-sm text-white/60">Pay <span className="text-white font-semibold">₹{total.toFixed(2)}</span> in cash when your order is delivered.</p>
                                </div>
                            )}

                            {/* Online */}
                            {method === "online" && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/[0.06] border border-primary/15">
                                    <span className="material-icons text-primary">launch</span>
                                    <p className="text-sm text-white/60">You'll be redirected to a secure payment gateway to complete your payment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Checkout;

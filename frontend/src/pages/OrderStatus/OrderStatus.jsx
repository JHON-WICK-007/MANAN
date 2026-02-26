import { useState } from "react";

const statuses = ["Pending", "Preparing", "Ready", "Delivered"];

const DUMMY_ORDER = {
    _id: "ord123456",
    status: "Preparing",
    items: [
        { name: "Truffle Bruschetta", quantity: 2, price: 140 },
        { name: "Wagyu Beef Burger", quantity: 1, price: 350 },
        { name: "Molten Cacao Core", quantity: 1, price: 180 },
    ],
    totalAmount: 810,
};

const OrderStatus = () => {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");

    const trackOrder = async () => {
        if (!orderId.trim()) return;
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setOrder(data.data);
            else { setOrder(DUMMY_ORDER); }
        } catch {
            setOrder(DUMMY_ORDER);
        }
    };

    const getStepIndex = (status) => statuses.indexOf(status);

    return (
        <main className="min-h-screen">
            <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Track Your Order</h1>
                    <p className="text-stone-400">Enter your order ID to see real-time updates on your culinary masterpiece.</p>
                </div>

                {/* Search */}
                <div className="flex gap-3 mb-12 max-w-lg mx-auto">
                    <div className="relative flex-1">
                        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">receipt_long</span>
                        <input value={orderId} onChange={(e) => setOrderId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && trackOrder()}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-stone-500"
                            placeholder="Enter Order ID..." />
                    </div>
                    <button onClick={trackOrder} className="bg-primary hover:bg-primary/90 text-white px-8 rounded-xl font-bold transition-all">
                        Track
                    </button>
                </div>

                {error && (
                    <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-8">{error}</div>
                )}

                {/* Order Details */}
                {order && (
                    <div className="glass rounded-2xl p-8">
                        {/* Status Timeline */}
                        <div className="flex items-center justify-between mb-10 px-4">
                            {statuses.map((s, i) => {
                                const currentIdx = getStepIndex(order.status);
                                const isDone = i <= currentIdx;
                                const isCurrent = i === currentIdx;
                                return (
                                    <div key={s} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${isDone ? "bg-primary text-white shadow-[0_0_15px_rgba(238,124,43,0.3)]" : "bg-white/5 border border-white/20 text-stone-500"
                                                } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}>
                                                <span className="material-icons text-sm">{isDone ? "check" : ["pending", "restaurant", "done_all", "local_shipping"][i]}</span>
                                            </div>
                                            <span className={`text-[10px] uppercase tracking-widest font-bold ${isDone ? "text-primary" : "text-stone-500"}`}>{s}</span>
                                        </div>
                                        {i < statuses.length - 1 && (
                                            <div className={`flex-1 h-[2px] mx-2 mt-[-20px] ${i < currentIdx ? "bg-primary" : "bg-white/10"}`}></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="border-t border-white/5 pt-8">
                            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest">Order Items</h3>
                            <div className="space-y-3">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                                        <div>
                                            <p className="text-white font-medium">{item.name || "Item"}</p>
                                            <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-primary font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-lg font-bold text-white">Total</span>
                                <span className="text-2xl font-bold text-primary">₹{order.totalAmount?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Order State */}
                {!order && !error && (
                    <div className="text-center py-16">
                        <span className="material-icons text-8xl text-stone-700 mb-4">local_shipping</span>
                        <p className="text-stone-500">Enter your order ID above to track it</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default OrderStatus;

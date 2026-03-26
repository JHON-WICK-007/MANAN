import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const url = isLogin ? "/api/auth/login" : "/api/auth/register";
        const body = isLogin ? { email: form.email, password: form.password } : form;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/");
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch {
            setError("Server error. Please try again.");
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden font-outfit">
            {/* HERO CONTAINER: FULL BACKGROUND IMAGE */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070"
                    alt="Premium Restaurant Atmosphere"
                    className="w-full h-full object-cover animate-subtle-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/50 to-black/85"></div>
            </div>

            {/* FLOATING LOGIN CARD OVERLAY */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-full max-w-[460px] px-6">
                <div className="p-10 rounded-[20px] overflow-hidden relative group"
                    style={{
                        background: 'rgba(20, 15, 10, 0.55)',
                        backdropFilter: 'blur(18px)',
                        WebkitBackdropFilter: 'blur(18px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6)',
                    }}>

                    {/* Header */}
                    <div className="text-center mb-10 relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 border border-primary/20">
                            <span className="material-icons text-primary text-3xl">restaurant</span>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{isLogin ? "Welcome Back" : "Begin Journey"}</h2>
                        <p className="text-stone-400 text-xs uppercase tracking-widest font-bold opacity-60">
                            {isLogin ? "Lumière Membership" : "Join the inner circle"}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold text-center uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        {!isLogin && (
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-stone-500 text-lg transition-colors group-focus-within:text-primary">person</span>
                                <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Full Name" required
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all duration-300 text-sm" id="name" />
                            </div>
                        )}

                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-stone-500 text-lg transition-colors group-focus-within:text-primary">mail</span>
                            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email Address" required
                                className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all duration-300 text-sm" id="email" />
                        </div>

                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-stone-500 text-lg transition-colors group-focus-within:text-primary">lock</span>
                            <input name="password" value={form.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Password" required
                                className="w-full pl-12 pr-12 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all duration-300 text-sm" id="password" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 hover:text-white transition-colors">
                                <span className="material-icons text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                            </button>
                        </div>

                        {!isLogin && (
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-stone-500 text-lg transition-colors group-focus-within:text-primary">phone</span>
                                <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="Phone Number"
                                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all duration-300 text-sm" id="phone" />
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase px-1">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="checkbox" className="appearance-none h-4 w-4 border border-white/10 rounded bg-white/5 checked:bg-primary checked:border-primary focus:ring-0 transition-all" />
                                    <span className="text-stone-500 group-hover:text-stone-300">Remember</span>
                                </label>
                                <a href="#" className="text-primary hover:text-primary/80 transition-colors">Forgot?</a>
                            </div>
                        )}

                        <button type="submit"
                            className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-xl shadow-2xl shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 uppercase tracking-[0.2em] text-[10px]">
                            {isLogin ? "Sign In" : "Register"}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                        <div className="flex flex-col items-center">
                            <p className="text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                                {isLogin ? "No account?" : "Member?"}
                                <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-primary hover:text-white ml-2 transition-colors">
                                    {isLogin ? "Sign Up" : "Sign In"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;

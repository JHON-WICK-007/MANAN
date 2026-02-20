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
        <div className="min-h-screen flex">
            {/* Left: Atmospheric Image */}
            <div className="hidden lg:block lg:w-7/12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-dark/20 to-dark/80 z-10"></div>
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80" alt="Restaurant interior"
                    className="absolute inset-0 w-full h-full object-cover scale-105" />
                <div className="absolute bottom-12 left-12 z-20 max-w-md">
                    <div className="w-12 h-1 bg-primary mb-6"></div>
                    <h1 className="text-5xl font-bold text-white mb-4 leading-tight">A Symphony of Flavors Awaits.</h1>
                    <p className="text-stone-300 text-lg">Experience the finest culinary craftsmanship in an atmosphere designed for moments that matter.</p>
                </div>
            </div>

            {/* Right: Auth Card */}
            <div className="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-12 relative">
                <div className="absolute inset-0 lg:hidden -z-10">
                    <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=60" alt=""
                        className="w-full h-full object-cover opacity-30" />
                </div>

                <div className="w-full max-w-md glass-card p-8 sm:p-10 rounded-xl shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <span className="material-icons text-primary text-3xl">restaurant</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
                        <p className="text-stone-400">{isLogin ? "Sign in to manage your reservations and preferences." : "Join us for an exclusive dining experience."}</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="relative group">
                                <input name="name" value={form.name} onChange={handleChange} type="text" placeholder=" " required
                                    className="input-dark peer" id="name" />
                                <label htmlFor="name" className="absolute left-4 top-4 text-stone-500 transition-all pointer-events-none origin-left peer-focus:text-primary peer-focus:-translate-y-6 peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:text-primary">
                                    Full Name
                                </label>
                            </div>
                        )}

                        <div className="relative group">
                            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder=" " required
                                className="input-dark peer" id="email" />
                            <label htmlFor="email" className="absolute left-4 top-4 text-stone-500 transition-all pointer-events-none origin-left peer-focus:text-primary peer-focus:-translate-y-6 peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:text-primary">
                                Email Address
                            </label>
                            <div className="absolute inset-y-0 right-4 flex items-center">
                                <span className="material-icons text-stone-600 group-focus-within:text-primary/60">mail</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <input name="password" value={form.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder=" " required
                                className="input-dark peer" id="password" />
                            <label htmlFor="password" className="absolute left-4 top-4 text-stone-500 transition-all pointer-events-none origin-left peer-focus:text-primary peer-focus:-translate-y-6 peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:text-primary">
                                Password
                            </label>
                            <div className="absolute inset-y-0 right-4 flex items-center">
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-stone-600 hover:text-primary transition-colors">
                                    <span className="material-icons">{showPassword ? "visibility_off" : "visibility"}</span>
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="relative group">
                                <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder=" "
                                    className="input-dark peer" id="phone" />
                                <label htmlFor="phone" className="absolute left-4 top-4 text-stone-500 transition-all pointer-events-none origin-left peer-focus:text-primary peer-focus:-translate-y-6 peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-[0.85] peer-[:not(:placeholder-shown)]:text-primary">
                                    Phone Number
                                </label>
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="checkbox" className="appearance-none h-4 w-4 border border-stone-700 rounded bg-white/5 checked:bg-primary checked:border-primary focus:ring-0 transition-all" />
                                    <span className="text-stone-400 group-hover:text-stone-300">Remember me</span>
                                </label>
                                <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">Forgot Password?</a>
                            </div>
                        )}

                        <button type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transform transition-all active:scale-[0.98]">
                            {isLogin ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    {/* Toggle + Social Login */}
                    <div className="mt-8 pt-8 border-t border-stone-700/50">
                        <div className="flex flex-col items-center space-y-4">
                            <p className="text-stone-400">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-primary font-semibold hover:underline ml-1">
                                    {isLogin ? "Sign Up" : "Sign In"}
                                </button>
                            </p>
                            <div className="flex items-center space-x-4 w-full">
                                <div className="h-px bg-stone-700 flex-grow"></div>
                                <span className="text-stone-500 text-xs uppercase tracking-widest">or continue with</span>
                                <div className="h-px bg-stone-700 flex-grow"></div>
                            </div>
                            <div className="flex space-x-4 w-full">
                                <button className="flex-1 flex items-center justify-center space-x-2 py-3 bg-white/5 border border-stone-700 rounded-lg hover:bg-white/10 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-stone-300 text-sm font-medium">Google</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center space-x-2 py-3 bg-white/5 border border-stone-700 rounded-lg hover:bg-white/10 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                                    </svg>
                                    <span className="text-stone-300 text-sm font-medium">Facebook</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;

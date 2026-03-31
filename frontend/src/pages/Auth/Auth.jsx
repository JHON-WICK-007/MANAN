import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!isLogin && form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const url = isLogin ? "/api/auth/login" : "/api/auth/register";
        const body = isLogin
            ? { email: form.email, password: form.password }
            : { name: form.name, email: form.email, password: form.password };

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

    // Shared input style matching "Dark luxury theme, soft border, focus glow" with left padding for icons
    const inputClasses = "w-full pl-[46px] pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner backdrop-blur-md";
    const labelClasses = "block text-white text-xs font-medium mb-1.5 ml-1 opacity-90 tracking-wide";

    return (
        <div className="relative w-full h-screen overflow-hidden font-outfit">

            {/* 1. BACKGROUND (STATIC, No Reload, No Layout Shift, z-0) */}
            <div className="absolute inset-0 z-[0]">
                <div
                    className="w-full h-full animate-subtle-zoom"
                    style={{
                        backgroundColor: '#000000',
                        backgroundImage: `url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
                {/* 2. DARK OVERLAY (z-1) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-black/90 z-[1]"></div>
            </div>

            {/* 3. SPLIT LAYOUT CONTAINER (z-2) */}
            <div className="relative z-[2] flex h-full w-full">

                {/* --- LEFT SECTION (Welcome Text) --- */}
                <div className="hidden lg:flex flex-col justify-center w-1/2 px-16 xl:px-24 relative">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Brand Logo - Circular like the footer icon */}
                        <Link to="/" className="inline-flex items-center gap-3 mb-10 group cursor-pointer inline-block">
                            <div className="relative flex items-center justify-center group-hover:drop-shadow-[0_0_12px_rgba(238,124,43,0.6)] transition-all duration-300">
                                <span className="material-icons text-primary text-4xl">restaurant</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tighter uppercase drop-shadow-md">
                                    Lumière<span className="text-primary">.</span>
                                </h3>
                                <p className="text-sm font-medium text-stone-300 tracking-wide drop-shadow-md">Fine Dining</p>
                            </div>
                        </Link>

                        <h1 className="text-6xl xl:text-7xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-xl">
                            Welcome <br /> Back
                        </h1>
                        <p className="text-stone-300 text-lg font-light leading-relaxed max-w-md mb-4 drop-shadow-md">
                            Experience the pinnacle of fine dining. Sign in to curate your journey, manage your reservations, and explore exclusive culinary events.
                        </p>

                        {/* Social Icons Row */}
                        <div className="flex items-center gap-7 mt-2">
                            {[
                                { name: "Facebook", viewBox: "0 0 320 512", path: "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" },
                                { name: "Instagram", viewBox: "0 0 448 512", path: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" },
                                { name: "X", viewBox: "0 0 512 512", path: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" },
                                { name: "LinkedIn", viewBox: "0 0 448 512", path: "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" }
                            ].map((social, i) => (
                                <a key={i} href="#" aria-label={social.name} className="flex items-center justify-center text-stone-300 hover:text-primary transition-all duration-300 hover:scale-110 group cursor-pointer hover:drop-shadow-[0_0_15px_rgba(238,124,43,0.6)] mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={social.viewBox} fill="currentColor" className="w-[18px] h-[18px] transition-colors duration-300">
                                        <path d={social.path} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* --- RIGHT SECTION (Glass Card) --- */}
                <div className="flex items-center justify-center w-full lg:w-1/2 p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="w-full max-w-[440px] px-8 pt-8 pb-6 md:px-10 md:pt-10 md:pb-6 rounded-[24px] relative"
                        style={{
                            background: 'rgba(20, 15, 10, 0.45)', // semi-transparent dark background
                            backdropFilter: 'blur(20px)',         // backdrop-blur
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)', // soft border
                            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1)', // shadow & subtle top rim
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? "login" : "signup"}
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                {/* Header Title */}
                                <h2 className="text-3xl font-black text-primary mb-8 tracking-tight">
                                    {isLogin ? "Login" : "Create Account"}
                                </h2>

                                {/* Error Alert */}
                                {error && (
                                    <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center uppercase tracking-wider backdrop-blur-md">
                                        {error}
                                    </div>
                                )}

                                {/* Forms */}
                                <form onSubmit={handleSubmit} className="space-y-5">

                                    {/* Register Only Fields */}
                                    {!isLogin && (
                                        <div>
                                            <label htmlFor="name" className={labelClasses}>Full Name</label>
                                            <div className="relative">
                                                <span className="material-icons absolute z-10 left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[20px] pointer-events-none">person_outline</span>
                                                <input
                                                    id="name" name="name" type="text"
                                                    value={form.name} onChange={handleChange} required
                                                    className={inputClasses}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Shared Email Field */}
                                    <div>
                                        <label htmlFor="email" className={labelClasses}>Email Address</label>
                                        <div className="relative">
                                            <span className="material-icons absolute z-10 left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[20px] pointer-events-none">mail_outline</span>
                                            <input
                                                id="email" name="email" type="email"
                                                value={form.email} onChange={handleChange} required
                                                className={inputClasses}
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label htmlFor="password" className={labelClasses}>Password</label>
                                        <div className="relative">
                                            <span className="material-icons absolute z-10 left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[20px] pointer-events-none">lock_outline</span>
                                            <input
                                                id="password" name="password" type={showPassword ? "text" : "password"}
                                                value={form.password} onChange={handleChange} required
                                                className={inputClasses}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors"
                                            >
                                                <span className="material-icons text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Register Only: Confirm Password */}
                                    {!isLogin && (
                                        <div>
                                            <label htmlFor="confirmPassword" className={labelClasses}>Confirm Password</label>
                                            <div className="relative">
                                                <span className="material-icons absolute z-10 left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[20px] pointer-events-none">lock_outline</span>
                                                <input
                                                    id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"}
                                                    value={form.confirmPassword} onChange={handleChange} required
                                                    className={inputClasses}
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Login Only Extras */}
                                    {isLogin && (
                                        <div className="flex items-center justify-between mt-6 text-xs font-semibold">
                                            <label className="flex items-center space-x-2 cursor-pointer group">
                                                <div className="relative flex items-center justify-center">
                                                    <input type="checkbox" className="peer appearance-none h-[18px] w-[18px] border-2 border-white/20 rounded bg-white/5 checked:bg-primary checked:border-primary focus:ring-0 transition-all cursor-pointer" />
                                                    <span className="material-icons absolute text-white text-[14px] font-bold pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                                                </div>
                                                <span className="text-stone-400 group-hover:text-stone-300 transition-colors">Remember me</span>
                                            </label>
                                            <a href="#" className="text-primary hover:text-primary-light transition-colors">Forgot password?</a>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full mt-6 bg-primary hover:bg-[#d96e1f] active:bg-[#c25d14] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(238,124,43,0.3)] hover:shadow-[0_0_30px_rgba(238,124,43,0.5)] transition-all duration-300 text-sm"
                                    >
                                        {isLogin ? "Login" : "Sign up"}
                                    </button>
                                </form>

                                {/* OR Divider */}
                                <div className="relative mt-5 mb-3">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="bg-[#140F0A] px-4 text-stone-500 font-semibold uppercase tracking-widest rounded-full border border-white/5 py-1 backdrop-blur-md">
                                            Or
                                        </span>
                                    </div>
                                </div>

                                {/* Social Login Buttons */}
                                <div className="flex items-center justify-center gap-4 px-8">
                                    <button type="button" className="flex-1 flex items-center justify-center py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-[24px] h-[24px]" />
                                    </button>

                                    <button type="button" className="flex-1 flex items-center justify-center py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-xl transition-all duration-300 text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-[24px] h-[24px]">
                                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Toggle Link */}
                                <div className="mt-5 text-center border-t border-white/10 pt-4">
                                    <p className="text-stone-400 text-xs font-medium">
                                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                                        <button
                                            type="button"
                                            onClick={() => { setIsLogin(!isLogin); setError(""); }}
                                            className="text-primary hover:text-[#d96e1f] font-bold ml-1.5 transition-colors"
                                        >
                                            {isLogin ? "Sign up" : "Login"}
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Auth;

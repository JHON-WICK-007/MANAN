import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const DUMMY_SPECIALS = [
    { _id: "s1", name: "Smoked Wagyu Ribeye", description: "45-day dry-aged beef, served with black garlic purée and charred heritage carrots.", price: 850, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80", isVeg: false, category: "Main Course" },
    { _id: "s2", name: "Hand-Cut Truffle Linguine", description: "Fresh egg pasta tossed in cultured butter, finished with shaved black Perigord truffles.", price: 420, image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=600&q=80", isVeg: true, category: "Main Course" },
    { _id: "s3", name: "Saffron Sea Scallops", description: "Hokkaido scallops with saffron-infused foam, pea tendrils, and chorizo oil.", price: 380, image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80", isVeg: false, category: "Starters" },
    { _id: "s4", name: "Honey Glazed Arctic Char", description: "Wild-caught char, miso-honey glaze, served with pickled radish and ginger broth.", price: 540, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80", isVeg: false, category: "Main Course" },
    { _id: "s5", name: "Molten Cacao Core", description: "70% dark Belgian chocolate lava cake served with Tahitian vanilla bean gelato and gold leaf.", price: 180, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80", isVeg: true, category: "Desserts" },
];

/* ── 3D Tilt Card ── */
const TiltCard = ({ children, className }) => {
    const cardRef = useRef(null);
    const glossRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const halfW = rect.width / 2;
        const halfH = rect.height / 2;
        const centerX = rect.left + halfW;
        const centerY = rect.top + halfH;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDist = Math.max(halfW, halfH);

        const degree = Math.min((dist * 6) / maxDist, 6);
        const rx = deltaY / halfH;
        const ry = deltaX / halfW;

        // NO perspective() here — it's on the parent as a CSS property
        card.style.transform = `rotate3d(${-rx}, ${ry}, 0, ${degree}deg)`;

        if (glossRef.current) {
            glossRef.current.style.transform = `translate(${-ry * 100}%, ${-rx * 100}%) scale(2.4)`;
            glossRef.current.style.opacity = `${Math.min((dist * 0.6) / maxDist, 0.6)}`;
        }
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (card) card.style.transform = "";
        if (glossRef.current) {
            glossRef.current.style.opacity = "0";
            glossRef.current.style.transform = "";
        }
    };

    return (
        // Outer: perspective container — STATIC, never transforms
        <div
            className={className}
            style={{ perspective: "1200px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Inner: the card that rotates — has borderRadius + overflow */}
            <div
                ref={cardRef}
                style={{
                    transition: "transform 0.2s ease",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    position: "relative",
                    border: "2px solid rgba(255, 255, 255, 0.12)",
                }}
            >
                {children}
                <div
                    ref={glossRef}
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%)",
                        opacity: 0,
                        pointerEvents: "none",
                        transition: "opacity 0.2s ease-out",
                        willChange: "opacity, transform",
                        zIndex: 10,
                    }}
                />
            </div>
        </div>
    );
};

const Home = () => {
    const [specials, setSpecials] = useState([]);
    const [hoveredBtn, setHoveredBtn] = useState(null);
    const { addItem } = useCart();

    useEffect(() => {
        fetch("/api/menu?sort=-createdAt&limit=6")
            .then((r) => r.json())
            .then((data) => { if (data.success && data.data.length) setSpecials(data.data); else setSpecials(DUMMY_SPECIALS); })
            .catch(() => setSpecials(DUMMY_SPECIALS));
    }, []);

    /* ── Shared button base ── */
    const btnBase = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "220px",
        padding: "18px 40px",
        borderRadius: "14px",
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        textDecoration: "none",
        cursor: "pointer",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease",
        userSelect: "none",
        whiteSpace: "nowrap",
    };

    const primaryBtn = (hovered) => ({
        ...btnBase,
        backgroundColor: hovered ? "#d96e1f" : "#ee7c2b",
        border: "2px solid transparent",
        color: "#ffffff",
        boxShadow: hovered
            ? "0 0 40px rgba(238,124,43,0.55), 0 8px 24px rgba(0,0,0,0.4)"
            : "0 4px 18px rgba(238,124,43,0.25)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
    });

    const outlineBtn = (hovered) => ({
        ...btnBase,
        backgroundColor: hovered ? "rgba(238,124,43,0.12)" : "rgba(255,255,255,0.04)",
        border: "2px solid rgba(238,124,43,0.6)",
        color: "#ffffff",
        boxShadow: hovered
            ? "0 0 24px rgba(238,124,43,0.2), 0 8px 24px rgba(0,0,0,0.3)"
            : "0 4px 14px rgba(0,0,0,0.25)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
    });

    return (
        <div>
            {/* ───── Hero ───── */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
                        alt="Fine dining"
                        className="w-full h-full object-cover scale-105 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-transparent to-dark" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-8 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-md shadow-[0_0_30px_rgba(238,124,43,0.08)]">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(238,124,43,0.6)]" />
                        <span className="text-[11px] font-semibold tracking-[0.35em] uppercase text-stone-300">
                            A Culinary Journey
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-8 tracking-tight leading-none">
                        Exquisite Flavors, <br />
                        <span className="text-primary">Timeless Memories</span>
                    </h1>
                    <p className="text-lg md:text-xl text-stone-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Experience the pinnacle of fine dining where heritage meets modern innovation in every meticulously crafted plate.
                    </p>

                    {/* ── CTA Buttons with strict inline CSS ── */}
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "20px",
                    }}>
                        <Link
                            to="/menu"
                            style={primaryBtn(hoveredBtn === "menu")}
                            onMouseEnter={() => setHoveredBtn("menu")}
                            onMouseLeave={() => setHoveredBtn(null)}
                        >
                            View Full Menu
                        </Link>
                        <Link
                            to="/table"
                            style={outlineBtn(hoveredBtn === "table")}
                            onMouseEnter={() => setHoveredBtn("table")}
                            onMouseLeave={() => setHoveredBtn(null)}
                        >
                            Book Your Table
                        </Link>
                    </div>
                </div>
            </section>

            {/* ───── Chef's Specials ───── */}
            <section className="pt-32 pb-12 px-4 md:px-20">
                <div className="max-w-7xl mx-auto mb-6">
                    <div className="max-w-xl">
                        <h2 className="section-label">Seasonal Curation</h2>
                        <h3 className="section-title">Chef's Signature Specials</h3>
                    </div>
                </div>

                <div className="flex gap-8 overflow-x-auto px-8 pt-4 pb-12 hide-scrollbar snap-x snap-mandatory">
                    {specials.map((item) => (
                        <TiltCard key={item._id} className="min-w-[320px] md:min-w-[420px] snap-center group relative">
                            <div className="relative h-[500px] overflow-hidden" style={{ background: "rgb(34, 24, 16)" }}>
                                {item.image && (
                                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent"></div>
                                <div className="relative h-full flex flex-col justify-end p-6">
                                    <span className="text-primary font-bold text-sm tracking-widest mb-2">₹{item.price?.toFixed(2)}</span>
                                    <h4 className="text-2xl font-bold text-white mb-2">{item.name}</h4>
                                    <p className="text-stone-300 text-sm font-light mb-6">{item.description}</p>
                                    <button onClick={() => addItem(item)}
                                        className="w-full py-3 border border-white/20 rounded-lg text-white font-medium group-hover:bg-primary group-hover:border-primary transition-all">
                                        Add to Selection
                                    </button>
                                </div>
                            </div>
                        </TiltCard>
                    ))}
                </div>
            </section>

            {/* ───── Our Story ───── */}
            <section className="py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative order-2 md:order-1">
                        <div className="relative z-10 rounded-2xl overflow-hidden">
                            <img src="/res.jpg" alt="Restaurant exterior"
                                className="w-full h-[600px] object-cover" />
                        </div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-primary/40 rounded-tl-2xl"></div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-primary/40 rounded-br-2xl"></div>

                    </div>

                    <div className="order-1 md:order-2">
                        <h2 className="section-label">Our Heritage</h2>
                        <h3 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-8">Crafting Memories Since 1984</h3>
                        <p className="text-lg text-stone-400 font-light leading-relaxed mb-8">
                            Born from a passion for authentic flavors and the warmth of shared moments, Lumière has redefined fine dining for four decades.
                            We believe that a meal is more than just sustenance; it is a narrative told through textures, aromas, and visual artistry.
                        </p>
                        <p className="text-lg text-stone-400 font-light leading-relaxed mb-10">
                            Our ingredients are sourced from local artisans who share our commitment to quality, ensuring that every dish we serve is a testament to the richness of our terroir.
                        </p>
                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div>
                                <p className="text-3xl font-bold text-primary mb-1">12k+</p>
                                <p className="text-stone-500 uppercase text-xs tracking-widest font-bold">Happy Diners</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary mb-1">3</p>
                                <p className="text-stone-500 uppercase text-xs tracking-widest font-bold">Michelin Stars</p>
                            </div>
                        </div>
                        <Link to="/menu" className="inline-flex items-center gap-2 text-primary font-bold group">
                            <span>Explore Our Philosophy</span>
                            <span className="material-icons transition-transform group-hover:translate-x-2">east</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
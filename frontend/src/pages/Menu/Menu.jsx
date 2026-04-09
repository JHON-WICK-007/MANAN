import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import ScrollReveal, { ScrollSection, fadeUp } from "../../components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All Items", "Starters", "Main Course", "Desserts", "Beverages"];

const DUMMY_MENU = [
    { _id: "m1", name: "Avocado Harvest Bowl", description: "Creamy avocado, quinoa, roasted sweet potatoes, and organic kale with a lemon-tahini dressing.", price: 240, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", isVeg: true, category: "Starters", isAvailable: true },
    { _id: "m2", name: "Smoked Glazed Ribs", description: "Slow-smoked for 12 hours with hickory wood, glazed in our secret bourbon BBQ sauce with truffle mash.", price: 420, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80", isVeg: false, category: "Main Course", isAvailable: true },
    { _id: "m3", name: "Molten Cacao Core", description: "70% dark Belgian chocolate lava cake served with Tahitian vanilla bean gelato and gold leaf.", price: 180, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80", isVeg: true, category: "Desserts", isAvailable: true },
    { _id: "m4", name: "Amber Dusk Cocktail", description: "Aged bourbon infused with charred orange, botanical bitters, and a whisper of wood smoke.", price: 160, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80", isVeg: true, category: "Beverages", isAvailable: true },
    { _id: "m5", name: "Pan-Seared Sea Bass", description: "Wild-caught bass with a crisp skin, served over saffron risotto and a delicate beurre blanc.", price: 380, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80", isVeg: false, category: "Main Course", isAvailable: true },
    { _id: "m6", name: "Truffle Bruschetta", description: "Toasted sourdough topped with wild mushrooms, truffle oil, and aged parmesan shavings.", price: 140, image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80", isVeg: true, category: "Starters", isAvailable: true },
    { _id: "m7", name: "Wagyu Beef Burger", description: "Premium wagyu patty with caramelized onions, aged cheddar, and house-made pickles on brioche.", price: 350, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", isVeg: false, category: "Main Course", isAvailable: true },
    { _id: "m8", name: "Tiramisu Classico", description: "Traditional Italian tiramisu with espresso-soaked ladyfingers and mascarpone cream.", price: 160, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80", isVeg: true, category: "Desserts", isAvailable: true },
    { _id: "m9", name: "Fresh Mint Lemonade", description: "Hand-pressed lemons with fresh mint leaves, a touch of honey, and sparkling water.", price: 90, image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&q=80", isVeg: true, category: "Beverages", isAvailable: true },
];

const Menu = () => {
    const [allItems, setAllItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All Items");
    const [search, setSearch] = useState("");
    const { addItem } = useCart();

    // Fetch ALL items once on mount — category filtering happens client-side (instant)
    useEffect(() => {
        fetch(`/api/menu`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data.length) setAllItems(data.data);
                else setAllItems(DUMMY_MENU);
            })
            .catch(() => setAllItems(DUMMY_MENU))
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = allItems.filter((item) => {
        const matchesCategory = activeCategory === "All Items" || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
                {/* Title */}
                <ScrollSection className="mb-12 text-center">
                    <ScrollReveal>
                        <h1 className="text-5xl font-bold mb-4 tracking-tight">Our Curated <span className="text-primary">Menu</span></h1>
                        <p className="text-stone-400 max-w-2xl mx-auto">Experience a symphony of flavors crafted with the finest seasonal ingredients and modern culinary techniques.</p>
                    </ScrollReveal>
                </ScrollSection>

                {/* Filters + Search */}
                <ScrollSection className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12">
                    <ScrollReveal custom={0} className="flex flex-wrap justify-center gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`inline-flex items-center justify-center px-6 py-2 h-10 rounded-full font-medium text-sm transition-colors duration-200 box-border border-2 ${activeCategory === cat
                                    ? "bg-primary text-white border-primary"
                                    : "bg-white/5 text-stone-300 border-transparent hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </ScrollReveal>
                    <ScrollReveal custom={1} className="relative w-full lg:w-96">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-dark pl-12 pr-10 peer"
                            placeholder="Search for your favorite dish..."
                        />
                        <span className={`material-icons absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none peer-focus:text-primary peer-focus:drop-shadow-[0_0_12px_rgba(238,124,43,0.8)] ${search ? 'text-primary drop-shadow-[0_0_8px_rgba(238,124,43,0.5)]' : 'text-stone-500'}`}>search</span>
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors duration-200"
                            >
                                <span className="material-icons text-[18px]">close</span>
                            </button>
                        )}
                    </ScrollReveal>
                </ScrollSection>

                {/* Grid — animated on every category switch */}
                {!isLoading && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {filtered.map((item, idx) => (
                                <motion.div
                                    key={item._id}
                                    className="group card-dark flex flex-col h-full"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: idx * 0.05, ease: 'easeOut' }}
                                >
                                    <div className="aspect-[4/3] overflow-hidden relative flex-shrink-0">
                                        {item.image && (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        )}
                                        <div className="absolute top-0 left-0 z-10">
                                            <div className={`w-5 h-5 rounded-br-lg ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                        </div>
                                        <div className="absolute top-4 right-4 glass-light px-4 py-2 rounded-xl text-primary font-bold">
                                            ₹{item.price?.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">{item.name}</h3>
                                        <p className="text-stone-400 text-sm leading-relaxed mb-6 min-h-[72px]">{item.description}</p>
                                        <div className="flex-grow"></div>
                                        <button onClick={() => addItem(item)}
                                            className="w-full py-3 border border-white/20 rounded-lg text-white font-medium hover:bg-primary hover:border-primary transition-all">
                                            Add to Cart
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}

                {!isLoading && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-icons text-6xl text-stone-600 mb-4">search_off</span>
                        <p className="text-stone-400 text-xl">No dishes found</p>
                    </div>
                )}

                {/* Go to Cart Link */}
                {filtered.length > 0 && (
                    <ScrollReveal delay={0.4} className="mt-16 mb-8 flex justify-center">
                        <Link to="/cart" className="flex items-center gap-2 text-stone-400 hover:text-primary transition-colors duration-300 font-medium text-[15px]">
                            Go to cart
                            <span className="material-icons text-[20px]">arrow_forward</span>
                        </Link>
                    </ScrollReveal>
                )}
            </div>
        </main>
    );
};

export default Menu;
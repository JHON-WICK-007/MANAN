import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

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
    const [items, setItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All Items");
    const [search, setSearch] = useState("");
    const { addItem } = useCart();

    useEffect(() => {
        const query = activeCategory !== "All Items" ? `?category=${activeCategory}` : "";
        fetch(`/api/menu${query}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data.length) setItems(data.data);
                else setItems(activeCategory === "All Items" ? DUMMY_MENU : DUMMY_MENU.filter(i => i.category === activeCategory));
            })
            .catch(() => {
                setItems(activeCategory === "All Items" ? DUMMY_MENU : DUMMY_MENU.filter(i => i.category === activeCategory));
            });
    }, [activeCategory]);

    const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold mb-4 tracking-tight">Our Curated <span className="text-primary">Menu</span></h1>
                    <p className="text-stone-400 max-w-2xl mx-auto">Experience a symphony of flavors crafted with the finest seasonal ingredients and modern culinary techniques.</p>
                </div>

                {/* Filters + Search */}
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((cat) => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${activeCategory === cat
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "glass-light hover:bg-primary/20"
                                    }`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full lg:w-96">
                        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">search</span>
                        <input value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-stone-500 transition-all"
                            placeholder="Search for your favorite dish..." />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filtered.map((item) => (
                        <div key={item._id} className="group card-dark">
                            <div className="aspect-[4/3] overflow-hidden relative">
                                {item.image && (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                )}
                                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`}></div>
                                    <span className="text-[10px] font-bold tracking-widest uppercase">{item.isVeg ? "Veg" : "Non-Veg"}</span>
                                </div>
                                <div className="absolute top-4 right-4 glass-light px-4 py-2 rounded-xl text-primary font-bold">
                                    ₹{item.price?.toFixed(2)}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">{item.name}</h3>
                                <p className="text-stone-400 text-sm mb-6 leading-relaxed">{item.description}</p>
                                <button onClick={() => addItem(item)}
                                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                                    <span className="material-icons text-xl">add</span>
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <span className="material-icons text-6xl text-stone-600 mb-4">search_off</span>
                        <p className="text-stone-400 text-xl">No dishes found</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Menu;

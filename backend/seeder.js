require("dotenv").config();
const mongoose = require("mongoose");
const Menu = require("./models/Menu");

const menuItems = [
    // --- Starters ---
    { name: "Avocado Harvest Bowl", description: "Creamy avocado, quinoa, roasted sweet potatoes, and organic kale with a lemon-tahini dressing.", price: 240, category: "Starters", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", isVeg: true },
    { name: "Truffle Bruschetta", description: "Toasted sourdough topped with wild mushrooms, truffle oil, and aged parmesan shavings.", price: 140, category: "Starters", image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80", isVeg: true },
    { name: "Saffron Sea Scallops", description: "Hokkaido scallops with saffron-infused foam, pea tendrils, and chorizo oil.", price: 380, category: "Starters", image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80", isVeg: false },

    // --- Main Course ---
    { name: "Smoked Wagyu Ribeye", description: "45-day dry-aged beef, served with black garlic purée and charred heritage carrots.", price: 850, category: "Main Course", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80", isVeg: false },
    { name: "Hand-Cut Truffle Linguine", description: "Fresh egg pasta tossed in cultured butter, finished with shaved black Perigord truffles.", price: 420, category: "Main Course", image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=600&q=80", isVeg: true },
    { name: "Pan-Seared Sea Bass", description: "Wild-caught bass with a crisp skin, served over saffron risotto and a delicate beurre blanc.", price: 380, category: "Main Course", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80", isVeg: false },
    { name: "Wagyu Beef Burger", description: "Premium wagyu patty with caramelized onions, aged cheddar, and house-made pickles on brioche.", price: 350, category: "Main Course", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", isVeg: false },
    { name: "Honey Glazed Arctic Char", description: "Wild-caught char, miso-honey glaze, served with pickled radish and ginger broth.", price: 540, category: "Main Course", image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=600&q=80", isVeg: false },

    // --- Desserts ---
    { name: "Molten Cacao Core", description: "70% dark Belgian chocolate lava cake served with Tahitian vanilla bean gelato and gold leaf.", price: 180, category: "Desserts", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80", isVeg: true },
    { name: "Tiramisu Classico", description: "Traditional Italian tiramisu with espresso-soaked ladyfingers and mascarpone cream.", price: 160, category: "Desserts", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80", isVeg: true },
    { name: "Crème Brûlée", description: "Classic vanilla custard with a caramelized sugar shell, infused with Madagascar vanilla.", price: 150, category: "Desserts", image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&q=80", isVeg: true },

    // --- Beverages ---
    { name: "Amber Dusk Cocktail", description: "Aged bourbon infused with charred orange, botanical bitters, and a whisper of wood smoke.", price: 160, category: "Beverages", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80", isVeg: true },
    { name: "Fresh Mint Lemonade", description: "Hand-pressed lemons with fresh mint leaves, a touch of honey, and sparkling water.", price: 90, category: "Beverages", image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&q=80", isVeg: true },
    { name: "Japanese Matcha Latte", description: "Ceremonial-grade Uji matcha whisked with steamed oat milk and a hint of vanilla.", price: 120, category: "Beverages", image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80", isVeg: true },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected for seeding");

        await Menu.deleteMany();
        console.log("🗑️  Cleared existing menu items");

        const created = await Menu.insertMany(menuItems);
        console.log(`🌱 Seeded ${created.length} menu items`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        process.exit(1);
    }
};

seedDB();

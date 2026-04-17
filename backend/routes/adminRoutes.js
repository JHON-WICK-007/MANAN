const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const User = require("../models/User");
const Reservation = require("../models/Reservation");
const Order = require("../models/Order");
const Menu = require("../models/Menu");
const RestaurantTable = require("../models/RestaurantTable");
const ContactMessage = require("../models/ContactMessage");

// All admin routes are protected and require admin role
router.use(protect);
router.use(authorize("admin"));

// ─── DASHBOARD ──────────────────────────────────────────────────────────────
router.get("/dashboard", async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split("T")[0];

        const [todayReservations, activeOrders, tablesOccupied, totalCustomers, recentReservations, recentOrders] =
            await Promise.all([
                Reservation.countDocuments({ date: todayStr }),
                Order.countDocuments({ status: { $in: ["Pending", "Processing"] } }),
                RestaurantTable.countDocuments({ status: "Occupied" }),
                User.countDocuments({ role: "user" }),
                Reservation.find().sort({ createdAt: -1 }).limit(5).lean(),
                Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email").lean(),
            ]);

        res.json({
            success: true,
            data: {
                stats: { todayReservations, activeOrders, tablesOccupied, totalCustomers },
                recentReservations,
                recentOrders,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── RESERVATIONS ────────────────────────────────────────────────────────────
router.get("/reservations", async (req, res) => {
    try {
        const { status, date, search } = req.query;
        const query = {};
        if (status) query.status = status;
        if (date) query.date = date;
        if (search) query.userName = { $regex: search, $options: "i" };

        const reservations = await Reservation.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: reservations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put("/reservations/:id", async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reservation) return res.status(404).json({ success: false, message: "Reservation not found" });
        res.json({ success: true, data: reservation });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete("/reservations/:id", async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Reservation deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── TABLES ──────────────────────────────────────────────────────────────────
router.get("/tables", async (req, res) => {
    try {
        const tables = await RestaurantTable.find().sort({ tableId: 1 });
        res.json({ success: true, data: tables });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post("/tables", async (req, res) => {
    try {
        const table = await RestaurantTable.create(req.body);
        res.status(201).json({ success: true, data: table });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put("/tables/:id", async (req, res) => {
    try {
        const table = await RestaurantTable.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!table) return res.status(404).json({ success: false, message: "Table not found" });
        res.json({ success: true, data: table });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete("/tables/:id", async (req, res) => {
    try {
        await RestaurantTable.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Table deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── MENU ─────────────────────────────────────────────────────────────────────
router.get("/menu", async (req, res) => {
    try {
        const items = await Menu.find().sort({ category: 1, name: 1 });
        res.json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post("/menu", async (req, res) => {
    try {
        const item = await Menu.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put("/menu/:id", async (req, res) => {
    try {
        const item = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ success: false, message: "Menu item not found" });
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete("/menu/:id", async (req, res) => {
    try {
        await Menu.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Menu item deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── ORDERS ──────────────────────────────────────────────────────────────────
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email");
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put("/orders/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("user", "name email");
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────
router.get("/customers", async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).sort({ createdAt: -1 }).lean();

        const enriched = await Promise.all(
            users.map(async (u) => {
                const [reservationCount, orderCount] = await Promise.all([
                    Reservation.countDocuments({ user: u._id }),
                    Order.countDocuments({ user: u._id }),
                ]);
                return { ...u, reservationCount, orderCount };
            })
        );

        res.json({ success: true, data: enriched });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── MESSAGES ────────────────────────────────────────────────────────────────
router.get("/messages", async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json({ success: true, data: messages });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post("/messages", async (req, res) => {
    try {
        const msg = await ContactMessage.create(req.body);
        res.status(201).json({ success: true, data: msg });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put("/messages/:id", async (req, res) => {
    try {
        const msg = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!msg) return res.status(404).json({ success: false, message: "Message not found" });
        res.json({ success: true, data: msg });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete("/messages/:id", async (req, res) => {
    try {
        await ContactMessage.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Message deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
router.get("/analytics", async (req, res) => {
    try {
        // Last 7 days
        const days = 7;
        const labels = [];
        const reservationCounts = [];
        const orderCounts = [];

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            labels.push(dateStr);
            const [rCount, oCount] = await Promise.all([
                Reservation.countDocuments({ date: dateStr }),
                Order.countDocuments({ createdAt: { $gte: new Date(dateStr), $lt: new Date(d.setDate(d.getDate() + 1)) } }),
            ]);
            reservationCounts.push(rCount);
            orderCounts.push(oCount);
        }

        // Popular dishes — top 5 by order frequency
        const allOrders = await Order.find().lean();
        const dishCount = {};
        allOrders.forEach((o) => {
            o.items.forEach((item) => {
                dishCount[item.name] = (dishCount[item.name] || 0) + item.quantity;
            });
        });
        const popularDishes = Object.entries(dishCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        res.json({ success: true, data: { labels, reservationCounts, orderCounts, popularDishes } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── SETTINGS ────────────────────────────────────────────────────────────────
// Store settings as a simple JSON in memory / env (can extend to DB later)
let restaurantSettings = {
    name: "Lumière Dining",
    address: "123 Gourmet Lane, Culinary District",
    phone: "+1 (555) 867-5309",
    email: "reservations@lumiere.com",
    openingHours: "Mon–Sun: 12:00 PM – 11:00 PM",
};

router.get("/settings", (req, res) => {
    res.json({ success: true, data: restaurantSettings });
});

router.put("/settings", (req, res) => {
    restaurantSettings = { ...restaurantSettings, ...req.body };
    res.json({ success: true, data: restaurantSettings });
});

module.exports = router;

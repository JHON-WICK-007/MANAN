const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Route files
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const orderRoutes = require("./routes/orderRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Initialize app
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// --- Routes ---
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

// Public contact form submission
const ContactMessage = require("./models/ContactMessage");
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "Name, email and message are required." });
        }
        const msg = await ContactMessage.create({ name, email, phone, message });
        res.status(201).json({ success: true, data: msg });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Public tables list
const RestaurantTable = require("./models/RestaurantTable");
app.get("/api/tables", async (req, res) => {
    try {
        const tables = await RestaurantTable.find({ status: "Available" }).sort({ tableId: 1 });
        res.json({ success: true, data: tables });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- 404 handler ---
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// --- Error handler ---
app.use(errorHandler);

// --- Start server ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
};

startServer();
const Order = require("../models/Order");

// @desc    Get orders for logged-in user
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort("-createdAt");

        res.json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { items, totalAmount, paymentStatus } = req.body;

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            paymentStatus: paymentStatus || "Pending",
            status: "Pending"
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

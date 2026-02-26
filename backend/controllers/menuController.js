const Menu = require("../models/Menu");

// @desc    Get all menu items (with optional category filter & name search)
// @route   GET /api/menu
// @access  Public
exports.getAllItems = async (req, res, next) => {
    try {
        const filter = { isAvailable: true };

        // Category filter
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Name search (case-insensitive partial match)
        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: "i" };
        }

        // Sorting
        const sort = req.query.sort || "-createdAt";

        // Limit
        const limit = parseInt(req.query.limit) || 0;

        const items = await Menu.find(filter).sort(sort).limit(limit);

        res.json({
            success: true,
            count: items.length,
            data: items,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single menu item by ID
// @route   GET /api/menu/:id
// @access  Public
exports.getItemById = async (req, res, next) => {
    try {
        const item = await Menu.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }

        res.json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};
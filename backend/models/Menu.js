const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Menu item name is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: {
                values: ["Starters", "Main Course", "Desserts", "Beverages"],
                message: "Category must be Starters, Main Course, Desserts, or Beverages",
            },
        },
        image: {
            type: String,
            default: "",
        },
        isVeg: {
            type: Boolean,
            default: false,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Index for efficient filtering
menuSchema.index({ category: 1 });
menuSchema.index({ name: "text" });

module.exports = mongoose.model("Menu", menuSchema);
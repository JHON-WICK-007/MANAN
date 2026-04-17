const mongoose = require("mongoose");

const restaurantTableSchema = new mongoose.Schema(
    {
        tableId: {
            type: String,
            required: [true, "Table ID is required"],
            unique: true,
            trim: true,
        },
        capacity: {
            type: Number,
            required: [true, "Capacity is required"],
            min: [1, "Capacity must be at least 1"],
        },
        type: {
            type: String,
            required: [true, "Table type is required"],
            enum: ["Window", "Private", "Terrace", "Kitchen", "Center", "Outdoor"],
        },
        status: {
            type: String,
            enum: ["Available", "Occupied", "Reserved", "Disabled"],
            default: "Available",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("RestaurantTable", restaurantTableSchema);

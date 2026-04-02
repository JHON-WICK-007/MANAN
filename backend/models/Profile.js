const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // One-to-one relationship
        },
        phone: {
            type: String,
            trim: true,
            default: "",
        },
        address: {
            type: String,
            trim: true,
            default: "",
        },
        profileImage: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);

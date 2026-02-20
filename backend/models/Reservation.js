const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: String,
            required: [true, "Reservation date is required"],
        },
        time: {
            type: String,
            required: [true, "Reservation time is required"],
        },
        guests: {
            type: Number,
            required: [true, "Number of guests is required"],
            min: [1, "At least 1 guest required"],
            max: [20, "Maximum 20 guests per reservation"],
        },
        specialRequests: {
            type: String,
            trim: true,
            maxlength: [500, "Special requests cannot exceed 500 characters"],
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled"],
            default: "Pending",
        },
        bookingId: {
            type: String,
            unique: true,
        },
    },
    { timestamps: true }
);

// Generate unique booking ID before saving
reservationSchema.pre("save", function (next) {
    if (!this.bookingId) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.bookingId = `LUM-${timestamp}-${random}`;
    }
    next();
});

module.exports = mongoose.model("Reservation", reservationSchema);

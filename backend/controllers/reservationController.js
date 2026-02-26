const Reservation = require("../models/Reservation");

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res, next) => {
    try {
        const { date, time, guests, specialRequests } = req.body;

        // Validate required fields
        if (!date || !time || !guests) {
            return res.status(400).json({ success: false, message: "Date, time, and guests are required" });
        }

        // Prevent past dates
        const reservationDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (reservationDate < today) {
            return res.status(400).json({ success: false, message: "Cannot book a reservation in the past" });
        }

        const reservation = await Reservation.create({
            user: req.user._id,
            date,
            time,
            guests,
            specialRequests,
        });

        res.status(201).json({
            success: true,
            message: "Reservation created successfully",
            data: reservation,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reservations for logged-in user
// @route   GET /api/reservations/my
// @access  Private
exports.getMyReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find({ user: req.user._id }).sort("-createdAt");

        res.json({
            success: true,
            count: reservations.length,
            data: reservations,
        });
    } catch (error) {
        next(error);
    }
};
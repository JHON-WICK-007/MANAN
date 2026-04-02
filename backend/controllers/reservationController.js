const Reservation = require("../models/Reservation");

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res, next) => {
    try {
        const { date, time, guests, table, specialRequests } = req.body;

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
            userName: req.user.name,
            userEmail: req.user.email,
            table,
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

// @desc    Cancel a reservation
// @route   PATCH /api/reservations/:id/cancel
// @access  Private
exports.cancelReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ success: false, message: "Reservation not found" });
        }

        // Make sure user owns reservation
        if (reservation.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Not authorized to cancel this reservation" });
        }

        if (reservation.status === 'Cancelled') {
             return res.status(400).json({ success: false, message: "Reservation is already cancelled" });
        }

        reservation.status = 'Cancelled';
        await reservation.save();

        res.status(200).json({
            success: true,
            data: reservation
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
const express = require("express");
const router = express.Router();
const { createReservation, getMyReservations, cancelReservation } = require("../controllers/reservationController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createReservation);
router.get("/my", protect, getMyReservations);
router.patch("/:id/cancel", protect, cancelReservation);

module.exports = router;
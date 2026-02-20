const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Lumière API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

module.exports = router;
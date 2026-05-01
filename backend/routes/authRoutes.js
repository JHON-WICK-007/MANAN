const express = require("express");
const router = express.Router();
const { register, login, getMe, changePassword, deleteAccount } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

module.exports = router;
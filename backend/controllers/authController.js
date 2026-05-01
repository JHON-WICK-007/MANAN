const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "A user with this email already exists" });
        }

        // Create user (password hashing handled by pre-save hook)
        const user = await User.create({ name, email, password, phone });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user & return token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        // Find user and explicitly select password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login/Register via Google
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res, next) => {
    try {
        const { credential } = req.body; // This is the access_token from the frontend
        
        // Fetch user info from Google using the access token
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${credential}` }
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch user info from Google");
        }
        
        const { email, name, picture } = await response.json();
        
        // Find existing user
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create user if they don't exist
            // Generate a random password since they use Google
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            user = await User.create({
                name,
                email,
                password: randomPassword,
                role: "user"
            });
            
            // Optionally, create a Profile with the picture
            const Profile = require("../models/Profile");
            await Profile.create({
                user: user._id,
                profileImage: picture
            });
        }
        
        const token = generateToken(user._id);
        
        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: picture
            }
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ success: false, message: "Google authentication failed" });
    }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change user password
// @route   PUT /api/auth/password
// @access  Private
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide current and new password" });
        }

        const user = await User.findById(req.user._id).select("+password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user account and related data
// @route   DELETE /api/auth/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // We can also delete related models here (Profile, Orders, Reservations) if needed.
        // For now, deleting the user is the core action.
        const Profile = require("../models/Profile");
        await Profile.findOneAndDelete({ user: req.user._id });
        await User.findByIdAndDelete(req.user._id);

        res.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        next(error);
    }
};

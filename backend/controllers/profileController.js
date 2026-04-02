const Profile = require("../models/Profile");
const User = require("../models/User");

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            // Create a default profile if it doesn't exist
            profile = await Profile.create({
                user: req.user._id,
                phone: req.user.phone || "",
                address: "",
                profileImage: "",
            });
        }

        res.json({
            success: true,
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phone, address, profileImage } = req.body;

        // Update User name/phone if provided
        if (name || phone) {
            const user = await User.findById(req.user._id);
            if (name) user.name = name;
            if (phone) user.phone = phone;
            await user.save();
        }

        // Update or Create Profile
        let profile = await Profile.findOne({ user: req.user._id });

        const profileData = {
            phone: phone || (profile ? profile.phone : ""),
            address: address || (profile ? profile.address : ""),
            profileImage: profileImage || (profile ? profile.profileImage : ""),
        };

        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user._id },
                profileData,
                { new: true, runValidators: true }
            );
        } else {
            profile = await Profile.create({
                user: req.user._id,
                ...profileData,
            });
        }

        res.json({
            success: true,
            data: profile,
            user: {
                _id: req.user._id,
                name: name || req.user.name,
                email: req.user.email,
                phone: phone || req.user.phone,
                address: profile.address,
                profileImage: profile.profileImage,
                role: req.user.role,
            }
        });
    } catch (error) {
        next(error);
    }
};

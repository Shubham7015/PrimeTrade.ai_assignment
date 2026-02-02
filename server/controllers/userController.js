const User = require("../models/User");

// @desc    Get user data
// @route   GET /api/v1/me
// @access  Private
exports.getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/v1/me
// @access  Private
exports.updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const { name, email } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;

    // If password update is needed, it should be handled carefully with hashing
    // For this scope, we focus on name/email or add password logic if requested.
    // Assuming simple profile update.

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const jwt = require('jsonwebtoken');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const Admin_signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check credentials against env
    if (email !== ADMIN_USERNAME) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign({ role: 'admin',id: 'admin1' }, process.env.ADMIN_SECRET, { expiresIn: '7d' });

    // Set cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Admin signed in successfully" });
  } catch (error) {
    console.error("Admin signin error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { Admin_signin };

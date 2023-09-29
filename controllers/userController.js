const User = require("../models/userModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ success: false, msg: "Please fill in all required fields." });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ success: false, msg: "Invalid email format" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, msg: "This email is already registered" });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          msg: "Password must be at least 6 characters long",
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new User({
        name,
        email,
        password: passwordHash,
      });

      const userData = await newUser.save();

      res.json({
        success: true,
        msg: "Registration successful",
        data: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid email or password" });
      }

      const refresh_token = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/auth/v1/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const access_token = createAccessToken({ id: user._id });

      res.json({
        success: true,
        msg: "Login successful",
        data: {
          access_token: access_token,
          id: user._id,
          name: user.name,
          email: user.email,
          access_token,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  getAccessToken: (req, res) => {
    try {
      const { rf_token } = req.body;

      if (!rf_token) {
        return res.status(400).json({ msg: "Please provide a valid refresh token" });
      }

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(400).json({ msg: "Invalid or expired refresh token" });
        }

        const access_token = createAccessToken({ id: user.id });
        res.json({ success: true, access_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/auth/v1/refresh_token" });
      return res.json({ msg: "Logged out successfully" });
    } catch (err) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  }
};

const validateEmail = (email) => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;

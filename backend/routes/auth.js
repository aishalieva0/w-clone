const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Register User
router.post(
    "/register",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("phone").isLength({ min: 10 }).withMessage("Phone number is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, phone, password } = req.body;

        try {
            let user = await User.findOne({ phone });
            if (user) return res.status(400).json({ msg: "User already exists" });

            user = new User({ name, phone, password });
            await user.save();

            res.status(201).json({ msg: "User registered successfully" });
        } catch (error) {
            console.error("Registration Error:", error);
            res.status(500).json({ msg: "Server error" });
        }
    }
);

// Login User
router.post(
    "/login",
    [
        body("phone").isLength({ min: 10 }).withMessage("Phone number is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phone, password } = req.body;

        try {
            let user = await User.findOne({ phone });
            if (!user) return res.status(400).json({ msg: "User not found" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.json({ msg: "Login successful", token, user });
        } catch (error) {
            res.status(500).json({ msg: "Server error" });
        }
    }
);

module.exports = router;
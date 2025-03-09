const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { uid, email, name } = req.body;
        let user = await User.findOne({ uid });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User({ uid, email, name });
        await user.save();
        res.json(user);
    } catch (error) {

        res.status(500).json({ message: "Server error" });
    }
});

router.get("/search", async (req, res) => {
    const { query, uid } = req.query;

    if (!query) return res.json([]);

    try {
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
            ],
            uid: { $ne: uid },
        }).select("name email profilePic uid");

        res.json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:uid", async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

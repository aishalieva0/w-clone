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

router.put("/:uid", async (req, res) => {
    try {
        const { name, about } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ message: "Name cannot be empty" });
        }

        if (!about?.trim()) {
            return res.status(400).json({ message: "About cannot be empty" });
        }

        const user = await User.findOneAndUpdate(
            { uid: req.params.uid },
            { name, about },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/:uid/profile-photo", async (req, res) => {
    try {
        const { uid } = req.params;
        const { profilePic } = req.body;

        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.profilePic = profilePic || null;

        await user.save();

        res.json({ message: "Profile photo updated successfully", profilePic: user.profilePic });
    } catch (error) {
        console.error("Error updating profile photo:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/wallpaper", async (req, res) => {
    const { uid, wallpaper } = req.body;

    if (!uid || !wallpaper) {
        return res.status(400).json({ message: "UID and wallpaper are required" });
    }

    try {
        const user = await User.findOneAndUpdate(
            { uid },
            { wallpaper },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Wallpaper updated", wallpaper: user.wallpaper });
    } catch (err) {
        console.error("Error updating wallpaper:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

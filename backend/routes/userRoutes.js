const express = require("express");
const User = require("../models/User");
const upload = require("../middleware/uploadMiddleware")
const path = require("path");
const fs = require("fs");
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
    console.log('search started');

    const { query, uid } = req.query;
    console.log('search uid', uid);
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

router.put("/:uid/profile-photo", upload.single("profilePic"), async (req, res) => {
    try {
        console.log('dfdf');
        const { uid } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.profilePic && user.profilePic !== null) {
            console.log('older--------------');
            const oldPath = path.join(__dirname, "../uploads/", user.profilePic);
            console.log(oldPath);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        user.profilePic = req.file.filename;
        await user.save();

        res.json({ message: "Profile photo updated successfully", profilePic: user.profilePic });
    } catch (error) {
        console.error("Error updating profile photo:", error);
        res.status(500).json({ error: "Server error" });
    }
});
router.delete("/:uid/profile-photo", async (req, res) => {
    try {
        const { uid } = req.params;

        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.profilePic || user.profilePic === "default.jpg") {
            return res.status(400).json({ error: "No profile photo to delete" });
        }

        const photoPath = path.join(__dirname, "../uploads", user.profilePic);
        if (fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
        }

        user.profilePic = null;
        await user.save();

        res.json({ message: "Profile photo removed", profilePic: null });
    } catch (error) {
        console.error("Error deleting profile photo:", error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;

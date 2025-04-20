const express = require("express");
const Story = require("../models/Story");
const User = require("../models/User");

const router = express.Router();


router.post("/upload", async (req, res) => {
    const { userId: firebaseUid, mediaUrl, type } = req.body;

    if (!firebaseUid || !mediaUrl || !type) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        const user = await User.findOne({ uid: firebaseUid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const story = new Story({
            userId: user.uid,
            mediaUrl,
            type,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        await story.save();

        res.status(201).json({ message: "Story uploaded", story });
    } catch (err) {
        console.error("Error uploading story:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/", async (req, res) => {
    try {

        const stories = await Story.find().sort({ createdAt: -1 });

        const userUids = stories.map((s) => s.userId);

        const users = await User.find({ uid: { $in: userUids } });

        const formatted = stories.map((s) => {
            const user = users.find((u) => u.uid === s.userId);

            return {
                _id: s._id,
                userId: s.userId,
                username: user?.name || "Unknown",
                profilePic: user?.profilePic || null,
                mediaUrl: s.mediaUrl,
                type: s.type,
                createdAt: s.createdAt,
            };
        });

        res.status(200).json({ stories: formatted });
    } catch (err) {
        console.error("Error fetching stories:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;

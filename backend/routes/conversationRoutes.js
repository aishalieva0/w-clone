const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");

// Get all conversations for a user
router.get("/:userEmail", async (req, res) => {
    try {
        const userEmail = req.params.userEmail;

        const messages = await Message.find({
            $or: [{ sender: userEmail }, { receiver: userEmail }],
        }).sort({ timestamp: -1 });

        if (!messages.length) return res.json([]);

        const conversationsMap = new Map();

        messages.forEach((msg) => {
            const chatPartner = msg.sender === userEmail ? msg.receiver : msg.sender;

            if (!conversationsMap.has(chatPartner)) {
                conversationsMap.set(chatPartner, {
                    email: chatPartner,
                    lastMessage: msg.message,
                    time: new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    }),
                    unread: 0,
                });
            }

            if (msg.status !== "read" && msg.receiver === userEmail) {
                conversationsMap.get(chatPartner).unread += 1;
            }
        });


        const conversations = await Promise.all(
            [...conversationsMap.values()].map(async (conv) => {
                const user = await User.findOne({ email: conv.email });
                return {
                    ...conv,
                    name: user ? user.name : "Unknown",
                    profilePhoto: user ? user.profilePhoto : null,
                };
            })
        );

        res.json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/mark-read", async (req, res) => {
    try {
        const { sender, receiver } = req.body;

        const result = await Message.updateMany(
            { sender, receiver, status: { $ne: "read" } },
            { $set: { status: "read" } }
        );

        res.json({ success: true, updated: result.modifiedCount });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ error: "Server error" });
    }
});



module.exports = router;

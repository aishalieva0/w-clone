const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

router.get("/:sender/:receiver", async (req, res) => {
    try {
        const { sender, receiver } = req.params;
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

router.put("/mark-as-read", async (req, res) => {
    try {
        const { senderEmail, receiverEmail } = req.body;

        await Message.updateMany(
            { sender: senderEmail, receiver: receiverEmail, status: "delivered" },
            { $set: { status: "read" } }
        );

        res.json({ success: true });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: { type: String, required: true },
        receiver: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
        timestamp: { type: Date, default: Date.now },
    },
    { collection: "messages" }
);
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;



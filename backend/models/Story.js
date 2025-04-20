const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    userId: {
        type: "String",
        ref: "User",
        required: true,
    },
    mediaUrl: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["image", "video"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;
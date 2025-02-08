const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        profilePic: {
            type: String,
            default: null,
        },
        about: {
            type: String,
            default: "Hey there! I am using WhatsApp.",
        },
        isOnline: {
            type: Boolean,
            default: false,
        },
        lastSeen: {
            type: Date,
            default: null,
        },
        otp: {
            type: String,
            default: null,
        },
        otpExpires: {
            type: Date,
            default: null,
        },
        privacy: {
            lastSeen: { type: String, enum: ["everyone", "contacts", "nobody"], default: "everyone" },
            profilePic: { type: String, enum: ["everyone", "contacts", "nobody"], default: "everyone" },
            about: { type: String, enum: ["everyone", "contacts", "nobody"], default: "everyone" },
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;

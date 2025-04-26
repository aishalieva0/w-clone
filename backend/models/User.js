const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
            default: null,
        },
        about: {
            type: String,
            default: "Staying connected on Bubble!",
        },
        isOnline: {
            type: Boolean,
            default: false,
        },
        lastSeen: {
            type: Date,
            default: null,
        },
        wallpaper: {
            type: String,
            default: "/wallpapers/default.jpg",
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
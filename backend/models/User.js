const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
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
        privacy: {
            lastSeen: { type: String, enum: ["everyone", "contacts", "nobody"], default: "everyone" },
            profilePic: { type: String, enum: ["everyone", "contacts", "nobody"], default: "everyone" },
            about: { type: String, enum: ["everyone", "contacts", "nobody"], default: "everyone" },
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

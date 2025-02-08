const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");
const messageRoutes = require("./routes/messages");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/messages", messageRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.error("MongoDB Connection Failed:", err));

let users = {};

// WebSocket Connection
io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    socket.on("register-user", (email) => {
        users[email] = socket.id;
        console.log(`Registered ${email} with socket ${socket.id}`);
    });

    socket.on("send-message", async ({ sender, receiver, message }) => {
        console.log(`Message from ${sender} to ${receiver}: ${message}`);

        // Save message to database
        try {
            const newMessage = new Message({ sender, receiver, message });
            await newMessage.save();
            console.log("Message stored in DB");

            const receiverSocket = users[receiver];
            if (receiverSocket) {
                io.to(receiverSocket).emit("receive-message", { sender, message });
                console.log(`Message delivered to ${receiver}`);
            } else {
                console.warn(`User ${receiver} is not online`);
            }
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        Object.keys(users).forEach((email) => {
            if (users[email] === socket.id) {
                delete users[email];
            }
        });
    });

});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

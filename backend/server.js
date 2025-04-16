const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require("./routes/messages");
const conversationRoutes = require("./routes/conversationRoutes");
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
app.use('/users', userRoutes)
app.use("/messages", messageRoutes);
app.use("/conversations", conversationRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.error("MongoDB Connection Failed:", err));

let users = {};
const activeChats = {};
// WebSocket Connection
io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    socket.on("register-user", async (email) => {
        users[email] = socket.id;
        console.log(`Registered ${email} with socket ${socket.id}`);

        try {
            const undeliveredMessages = await Message.find({ receiver: email, status: "sent" });

            if (undeliveredMessages.length > 0) {
                console.log(`Updating ${undeliveredMessages.length} messages to "delivered"`);

                await Message.updateMany(
                    { receiver: email, status: "sent" },
                    { $set: { status: "delivered" } }
                );

                undeliveredMessages.forEach((msg) => {
                    const senderSocket = users[msg.sender];
                    if (senderSocket) {
                        io.to(senderSocket).emit("message-status-updated", {
                            sender: msg.sender,
                            receiver: msg.receiver,
                            message: msg.message,
                            status: "delivered",
                        });
                    }
                });
            }
        } catch (err) {
            console.error("Error updating message statuses:", err);
        }
    });

    socket.on("send-message", async ({ sender, receiver, message, media, mediaType }) => {
        try {
            const newMessage = new Message({ sender, receiver, message, media, mediaType, status: "sent" });
            await newMessage.save();

            const receiverSocket = users[receiver];
            const receiverInChat = activeChats[receiver] === sender;

            let updatedStatus = "sent";

            if (receiverSocket) {
                updatedStatus = receiverInChat ? "read" : "delivered";

                io.to(receiverSocket).emit("receive-message", {
                    sender,
                    receiver,
                    message,
                    status: updatedStatus,
                });

                io.to(users[sender]).emit("message-status-updated", {
                    sender,
                    receiver,
                    message,
                    status: updatedStatus,
                });

                if (receiverInChat) {
                    await Message.updateMany(
                        { sender, receiver, status: { $ne: "read" } },
                        { $set: { status: "read" } }
                    );

                    io.to(users[sender]).emit("messages-read", { sender: receiver, receiver: sender });
                } else {
                    await Message.updateOne(
                        { _id: newMessage._id },
                        { $set: { status: "delivered" } }
                    );
                }
            }

            io.emit("update-conversation", { sender, receiver, message, timestamp: newMessage.timestamp });

        } catch (err) {
            console.error("Error saving message:", err);
        }
    });



    socket.on("mark-as-read", async ({ sender, receiver }) => {
        try {
            await Message.updateMany(
                { sender, receiver, status: "delivered" },
                { $set: { status: "read" } }
            );
            io.to(users[sender]).emit("messages-read", { sender, receiver });
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    });


    socket.on("join-chat", ({ user, chatWith }) => {
        activeChats[user] = chatWith;
    });

    socket.on("leave-chat", (user) => {
        delete activeChats[user];
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

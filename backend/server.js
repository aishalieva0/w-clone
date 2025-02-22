const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");
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

    socket.on("send-message", async ({ sender, receiver, message }) => {
        // console.log(`Message from ${sender} to ${receiver}: ${message}`);
        // console.log("📥 Server received message:", message);
        try {
            const newMessage = new Message({ sender, receiver, message, status: "sent" });
            await newMessage.save();

            const receiverSocket = users[receiver];
            if (receiverSocket) {
                io.to(receiverSocket).emit("receive-message", {
                    sender,
                    message,
                    status: "delivered",
                });

                await Message.updateOne(
                    { sender, receiver, message },
                    { $set: { status: "delivered" } }
                );

                io.to(users[sender]).emit("message-status-updated", {
                    sender,
                    receiver,
                    message,
                    status: "delivered",
                });

                // console.log(`Message delivered to ${receiver}`);
            } else {
                console.warn(`User ${receiver} is offline. Message remains as 'sent'.`);
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

    socket.on("new-message", async (messageData) => {
        try {
            const newMessage = new Message(messageData);
            await newMessage.save();

            io.to(users[messageData.receiver]).emit("new-message", newMessage);

            const receiverInChat = activeChats[messageData.receiver] === messageData.sender;

            if (receiverInChat) {
                await Message.updateOne(
                    { _id: newMessage._id },
                    { $set: { status: "read" } }
                );

                io.to(users[messageData.sender]).emit("messages-read", {
                    sender: messageData.receiver,
                    receiver: messageData.sender,
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
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

export const sendMessage = (socket, messageData) => {
    if (!socket) return;
    socket.emit("send-message", messageData);
};

export const markAsRead = (socket, senderEmail, receiverEmail) => {
    if (!socket) return;
    socket.emit("mark-as-read", { sender: senderEmail, receiver: receiverEmail });
};

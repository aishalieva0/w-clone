const setupSocketListeners = (socket, setMessages) => {
    if (!socket) return;

    socket.on("receive-message", (data) => {
        setMessages((prev) => [...prev, data]);
    });

    socket.on("message-status-updated", (updatedMessage) => {
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.message === updatedMessage.message &&
                    msg.sender === updatedMessage.sender &&
                    msg.receiver === updatedMessage.receiver
                    ? { ...msg, status: updatedMessage.status }
                    : msg
            )
        );
    });
};

export default setupSocketListeners;

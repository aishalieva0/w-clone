import { addMessage, updateMessageStatus } from "../redux/slices/chatSlice";

const setupSocketListeners = (socket, dispatch) => {
    if (!socket) return;

    socket.on("receive-message", (data) => {
        if (!data || typeof data !== "object") {
            console.error("Received invalid message data:", data);
            return;
        }

        dispatch(addMessage(data));

    });


    socket.on("message-status-updated", (updatedMessage) => {
        if (!updatedMessage || typeof updatedMessage !== "object") {
            console.error("Invalid message update received:", updatedMessage);
            return;
        }

        dispatch(updateMessageStatus(updatedMessage));
    });

    socket.on("messages-read", ({ sender, receiver }) => {
        dispatch(updateMessageStatus({ sender, receiver, status: "read" }));
    });

    socket.on("new-message", (newMessage) => {
        if (!newMessage || typeof newMessage !== "object") {
            console.error("Invalid new-message data received:", newMessage);
            return;
        }

        dispatch(addMessage(newMessage));

        dispatch(updateMessageStatus({
            sender: newMessage.sender,
            receiver: newMessage.receiver,
            status: "read",
        }));
    });
};

export default setupSocketListeners;

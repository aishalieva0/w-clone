import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../context/socket";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverEmail, setReceiverEmail] = useState("");

  const { user } = useSelector((state) => state.user);
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !user) return;

    console.log("🔗 Registering user on socket:", user.email);
    socket.emit("register-user", user.email);

    socket.on("receive-message", (data) => {
      console.log("📩 New message received:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket, user]);

  const sendMessage = () => {
    if (!socket || !user || !receiverEmail || !message.trim()) {
      console.warn("⚠️ Missing required fields for sending message");
      return;
    }

    const newMessage = {
      sender: user.email,
      receiver: receiverEmail,
      message,
    };

    console.log("📤 Sending message:", newMessage);
    socket.emit("send-message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div>
      <h2>Chat</h2>
      <input
        type="email"
        placeholder="Receiver's Email"
        value={receiverEmail}
        onChange={(e) => setReceiverEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage} disabled={!socket}>
        Send
      </button>

      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Chat;

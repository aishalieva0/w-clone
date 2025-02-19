import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageInputContainer from "./MessageInputContainer";
import ChatHeader from "./ChatHeader";
import { useSocket } from "../../context/socket";
import { useSelector } from "react-redux";
import axios from "axios";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const { user } = useSelector((state) => state.user);
  const activeChat = useSelector((state) => state.chat.activeChat);
  const socket = useSocket();

  useEffect(() => {
    if (!activeChat || !user) return;
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5001/messages/${user.email}/${activeChat.email}`
        );
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [activeChat, user]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("register-user", user.email);

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket, user]);

  const sendMessage = () => {
    if (!socket || !user || !activeChat || !message.trim()) {
      return;
    }

    const newMessage = {
      sender: user.email,
      receiver: activeChat.email,
      message,
    };

    socket.emit("send-message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };
  return (
    <div className="chatWindow">
      <ChatHeader activeChat={activeChat} />
      <MessageList messages={messages} userEmail={user?.email} />
      <MessageInputContainer
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default ChatWindow;

import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageInputContainer from "./MessageInputContainer";
import ChatHeader from "./ChatHeader";
import { useSocket } from "../../context/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import setupSocketListeners from "../../socket/socketListeners";
import { markAsRead, sendMessage } from "../../socket/socketActions";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const { user } = useSelector((state) => state.user);
  const activeChat = useSelector((state) => state.chat.activeChat);
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !user) return;
    setupSocketListeners(socket, setMessages);
  }, [socket]);

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
    if (!activeChat) return;
    markAsRead(socket, activeChat.email, user.email);
  }, [activeChat]);

  useEffect(() => {
    if (!socket || !user || !activeChat) return;

    socket.emit("register-user", user.email);

    return () => {
      socket.emit("disconnect-user", user.email);
    };
  }, [socket, user, activeChat]);

  const handleSendMessage = () => {
    if (!socket || !user || !activeChat || !message.trim()) return;
    const newMessage = {
      sender: user.email,
      receiver: activeChat.email,
      message,
      status: "sent",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    sendMessage(socket, newMessage);
    setMessage("");
  };

  return (
    <div className="chatWindow">
      <ChatHeader activeChat={activeChat} />
      <MessageList messages={messages} userEmail={user?.email} />
      <MessageInputContainer
        message={message}
        setMessage={setMessage}
        sendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatWindow;

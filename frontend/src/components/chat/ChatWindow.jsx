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

  const markMessagesAsRead = async () => {
    if (!activeChat) return;

    try {
      await axios.put("http://localhost:5001/messages/mark-as-read", {
        senderEmail: activeChat.email,
        receiverEmail: user.email,
      });
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    }
  };

  useEffect(() => {
    if (activeChat) {
      markMessagesAsRead();
    }
  }, [activeChat]);

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

    return () => {
      socket.off("message-status-updated");
    };
  }, [socket, user]);

  useEffect(() => {
    if (!socket || !user || !activeChat) return;

    socket.emit("register-user", user.email);

    socket.emit("mark-as-read", {
      sender: activeChat.email,
      receiver: user.email,
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket, user, activeChat]);

  const sendMessage = () => {
    if (!socket || !user || !activeChat || !message.trim()) {
      return;
    }

    const newMessage = {
      sender: user.email,
      receiver: activeChat.email,
      message,
      status: "sent",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    socket.emit("send-message", newMessage);
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

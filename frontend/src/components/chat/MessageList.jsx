import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({
  messages,
  userEmail,
  handleScroll,
  messagesRef,
  activeChat,
}) => {
  const messagesEndRef = useRef(null);
  const previousHeightRef = useRef(0);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [activeChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length + 1]);

  useEffect(() => {
    if (messagesRef.current) {
      const currentHeight = messagesRef.current.scrollHeight;
      if (previousHeightRef.current && messages.length) {
        messagesRef.current.scrollTop +=
          currentHeight - previousHeightRef.current;
      }
      previousHeightRef.current = currentHeight;
    }
  }, [messages.length]);

  return (
    <div className="messageList" onScroll={handleScroll} ref={messagesRef}>
      {messages.map((msg, index) => (
        <MessageItem
          key={index}
          message={msg}
          isSent={msg.sender === userEmail}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

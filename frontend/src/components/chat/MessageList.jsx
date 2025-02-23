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

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, activeChat]);

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

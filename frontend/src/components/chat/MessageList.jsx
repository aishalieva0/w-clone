import React from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages, userEmail }) => {
  return (
    <div className="messageList">
      {messages.map((msg, index) => (
        <MessageItem
          key={index}
          message={msg}
          isSent={msg.sender === userEmail}
        />
      ))}
    </div>
  );
};

export default MessageList;

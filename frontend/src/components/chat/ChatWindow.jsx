import React from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatWindow = () => {
  return (
    <div className="chatWindow">
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatWindow;

import React from "react";
import MessageList from "./MessageList";
import MessageInputContainer from "./MessageInputContainer";

const ChatWindow = () => {
  return (
    <div className="chatWindow">
      <MessageList />
      <MessageInputContainer />
    </div>
  );
};

export default ChatWindow;

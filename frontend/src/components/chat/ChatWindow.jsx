import React from "react";
import MessageList from "./MessageList";
import MessageInputContainer from "./MessageInputContainer";
import ChatHeader from "./ChatHeader";

const ChatWindow = () => {
  return (
    <div className="chatWindow">
      <ChatHeader />
      <MessageList />
      <MessageInputContainer />
    </div>
  );
};

export default ChatWindow;

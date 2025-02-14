import React from "react";

const ChatList = () => {
  return (
    <ul className="chatList">
      <li className="chatItem">
        <div className="profileImg">photo</div>
        <div className="content">
          <h3>Jhon Doe</h3>
          <p>Hey! Are you there?</p>
        </div>
        <div className="details">
          <span>14:13</span>
          <span>1</span>
        </div>
      </li>
    </ul>
  );
};

export default ChatList;

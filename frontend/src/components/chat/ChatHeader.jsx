import React from "react";
import DefaultProfilePhoto from "../../assets/media/user/user-default.jpg";
import VideoCallIcon from "../../assets/media/icons/videoCallBtn.svg";
import SearchIcon from "../../assets/media/icons/searchBtn.svg";
import MoreIcon from "../../assets/media/icons/more.svg";

const ChatHeader = ({ activeChat, chatWindowRef }) => {
  const openChatInfo = () => {
    chatWindowRef.current.classList.add("open");
  };
  return (
    <div className="chatHeader">
      <div className="container">
        <div className="row">
          <div
            className="userInfo"
            onClick={() => {
              openChatInfo();
            }}
          >
            <div className="userProfile">
              <img src={DefaultProfilePhoto} alt="User" />
            </div>
            <div className="userName">
              <h3>{activeChat?.email}</h3>
            </div>
          </div>
          <div className="chatOptions">
            <button className="videoCall">{/* <VideoCallIcon /> */}</button>

            <button className="videoCall">{/* <SearchIcon /> */}</button>

            <button className="videoCall">{/* <MoreIcon /> */}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

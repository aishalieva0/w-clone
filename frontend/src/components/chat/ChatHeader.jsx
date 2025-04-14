import React from "react";
import DefaultProfilePhoto from "../../assets/media/user/userDefault.svg?react";
import VideoCallIcon from "../../assets/media/icons/videoCallBtn.svg";
import SearchIcon from "../../assets/media/icons/searchBtn.svg";
import MoreIcon from "../../assets/media/icons/more.svg";
import BackArrowBtn from "../../assets/media/icons/backArrow.svg?react";

const ChatHeader = ({ activeChat, chatWindowRef }) => {
  const openChatInfo = () => {
    chatWindowRef.current.classList.add("open");
  };

  const closeChat = () => {
    activeChat = null;
  };
  return (
    <div className="chatHeader">
      <div className="container">
        <div className="row">
          <div
            className="backBtn"
            onClick={() => {
              closeChat();
            }}
          >
            <BackArrowBtn className="icon" />
          </div>
          <div
            className="userInfo"
            onClick={() => {
              openChatInfo();
            }}
          >
            <div className="userProfile">
              {activeChat.profilePic ? (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/uploads/${
                    activeChat.profilePic
                  }`}
                  alt="profile image"
                />
              ) : (
                <DefaultProfilePhoto className="defaultImg" />
              )}
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

import React from "react";
import DefaultProfilePhoto from "../../assets/media/user/userDefault.svg?react";
import VideoCallIcon from "../../assets/media/icons/videoCallBtn.svg";
import SearchIcon from "../../assets/media/icons/searchBtn.svg";
import MoreIcon from "../../assets/media/icons/more.svg";
import BackArrowBtn from "../../assets/media/icons/backArrow.svg?react";
import { useDispatch } from "react-redux";
import { setActiveChat } from "../../redux/slices/chatSlice";

const ChatHeader = ({ activeChat, chatWindowRef }) => {
  const dispatch = useDispatch();
  const openChatInfo = () => {
    chatWindowRef.current.classList.add("open");
  };

  const closeChat = (e) => {
    e.stopPropagation();
    dispatch(setActiveChat(null));
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
            <div
              className="backBtn"
              onClick={(e) => {
                closeChat(e);
              }}
            >
              <BackArrowBtn className="icon" />
            </div>
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

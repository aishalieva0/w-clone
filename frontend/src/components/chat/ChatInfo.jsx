import React, { useEffect, useState } from "react";
import CloseBtn from "../../assets/media/icons/close.svg?react";
import DefaultProfilePhoto from "../../assets/media/user/userDefault.svg?react";
import { useSelector } from "react-redux";

const ChatInfo = ({ chatWindowRef }) => {
  const activeChat = useSelector((state) => state.chat.activeChat);
  const [profileImg, setProfileImage] = useState(null);

  useEffect(() => {
    if (activeChat.profilePic) {
      setProfileImage(
        `${import.meta.env.VITE_BASE_URL}/uploads/${activeChat.profilePic}`
      );
    } else {
      setProfileImage(null);
    }
  }, [activeChat]);

  const closeChatInfo = () => {
    chatWindowRef.current.classList.remove("open");
  };
  return (
    <div className="chatInfo">
      <div className="row">
        <div className="heading">
          <button className="closeBtn" onClick={closeChatInfo}>
            <CloseBtn className="icon" />
          </button>
          <p>User info</p>
        </div>

        <div className="content">
          <div className="profileContainer">
            <div className="profileImg">
              {profileImg ? (
                <img src={profileImg} alt="Profile Image" />
              ) : (
                <DefaultProfilePhoto />
              )}
            </div>
            <div className="details">
              <h2>{activeChat.name}</h2>
              <p>{activeChat.email}</p>
            </div>
          </div>

          <div className="aboutContainer">
            <div className="container">
              <h3>About</h3>
              <p>{activeChat.about}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;

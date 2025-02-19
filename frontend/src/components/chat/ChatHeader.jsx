import React from "react";
import DefaultProfilePhoto from "../../assets/media/user/user-default.jpg";
import { ReactComponent as VideoCallIcon } from "../../assets/media/icons/videoCallBtn.svg";
import { ReactComponent as SearchIcon } from "../../assets/media/icons/searchBtn.svg";
import { ReactComponent as MoreIcon } from "../../assets/media/icons/more.svg";

const ChatHeader = () => {
  return (
    <div className="chatHeader">
      <div className="container">
        <div className="row">
          <div className="userInfo">
            <div className="userProfile">
              <img src={DefaultProfilePhoto} alt="User" />
            </div>
            <div className="userName">
              <h3>Jhon Doe</h3>
            </div>
          </div>
          <div className="chatOptions">
            <button className="videoCall">
              <VideoCallIcon />
            </button>

            <button className="videoCall">
              <SearchIcon />
            </button>

            <button className="videoCall">
              <MoreIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

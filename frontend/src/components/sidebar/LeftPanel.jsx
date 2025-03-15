import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../redux/slices/sidebarSlice";
import ChatIcon from "../../assets/media/icons/chat.svg?react";
import StatusIcon from "../../assets/media/icons/status.svg?react";
import SettingIcon from "../../assets/media/icons/setting.svg?react";
import DefaultProfilePhoto from "../../assets/media/user/user-default.jpg";

const LeftPanel = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.sidebar.activeTab);

  return (
    <div className="leftPanel">
      <div className="row">
        <ul className="topList">
          <li
            className={`topItem ${activeTab} === "chats" ? "active" : ""`}
            onClick={() => dispatch(setActiveTab("chats"))}
          >
            <ChatIcon className="icon" />
          </li>
          <li
            className={`topItem ${activeTab} === "status" ? "active" : ""`}
            onClick={() => dispatch(setActiveTab("status"))}
          >
            <StatusIcon className="icon" />
          </li>
        </ul>
        <ul className="bottomList">
          <li
            className={`bottomItem ${activeTab} === "setting" ? "active" : ""`}
            onClick={() => dispatch(setActiveTab("setting"))}
          >
            <SettingIcon className="icon" />
          </li>
          <li
            className={`bottomItem ${activeTab} === "profile" ? "active" : ""`}
            onClick={() => dispatch(setActiveTab("profile"))}
          >
            <img src={DefaultProfilePhoto} alt="profile_photo" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftPanel;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../redux/slices/sidebarSlice";
import ChatIcon from "../../assets/media/icons/chat.svg?react";
import StatusIcon from "../../assets/media/icons/status.svg?react";
import SettingIcon from "../../assets/media/icons/setting.svg?react";
import DefaultProfilePhoto from "../../assets/media/user/userDefault.svg?react";

const LeftPanel = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.sidebar.activeTab);
  const { user } = useSelector((state) => state.user);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileImage(user.profilePic);
    }
  }, [user]);

  return (
    <div className="leftPanel">
      <div className="row">
        <ul className="topList">
          <li
            className={`topItem ${activeTab === "chatsTab" ? "active" : ""}`}
            onClick={() => dispatch(setActiveTab("chatsTab"))}
          >
            <ChatIcon className="icon" />
          </li>
          <li
            className={`topItem ${activeTab === "statusTab" ? "active" : ""}`}
            onClick={() => dispatch(setActiveTab("statusTab"))}
          >
            <StatusIcon className="icon" />
          </li>
        </ul>
        <ul className="bottomList">
          <li
            className={`bottomItem ${
              activeTab === "settingTab" ? "active" : ""
            }`}
            onClick={() => dispatch(setActiveTab("settingTab"))}
          >
            <SettingIcon className="icon" />
          </li>
          <li
            className={`bottomItem ${
              activeTab === "profileTab" ? "active" : ""
            }`}
            onClick={() => dispatch(setActiveTab("profileTab"))}
          >
            {profileImage ? (
              <img src={profileImage} alt="profile_photo" />
            ) : (
              <DefaultProfilePhoto className="defaultImg" />
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftPanel;

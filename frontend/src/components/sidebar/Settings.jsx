import React, { useEffect, useState } from "react";
import LogoutBtn from "../../assets/media/icons/logout.svg?react";
import ChatIcon from "../../assets/media/icons/chatIcon.svg?react";
import Chevron from "../../assets/media/icons/chevron.svg?react";
import DefaultProfilePhoto from "../../assets/media/user/user-default.jpg";
import { logOutUser } from "../../firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../redux/slices/sidebarSlice";
import PopupModal from "../PopupModal";

const Setting = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showThemePopup, setShowThemePopup] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    logOutUser(dispatch);
    setShowLogoutPopup(false);
  };

  const openLogoutPopup = () => {
    setShowLogoutPopup(true);
  };

  const closeLogoutPopup = () => {
    setShowLogoutPopup(false);
  };

  const openThemePopup = () => {
    setShowThemePopup(true);
  };

  const closeThemePopup = () => {
    setShowThemePopup(false);
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setProfileImage(user.profilePic || DefaultProfilePhoto);
    }
  }, [user]);
  return (
    <div className="settings">
      <div className="row">
        <div className="heading">
          <h2>Settings</h2>
        </div>
        <div className="settingContainer">
          <div
            className="profileInfo"
            onClick={() => dispatch(setActiveTab("profileTab"))}
          >
            <div className="container">
              <div className="profileImg">
                <img
                  src={profileImage || DefaultProfilePhoto}
                  alt="Profile Image"
                />
              </div>
              <div className="details">
                <h3>{name}</h3>
                <p>{email}</p>
              </div>
            </div>
          </div>
          <div className="settingList">
            <button className="settingItem" onClick={openThemePopup}>
              <div className="container">
                <div className="row">
                  <div className="settingItemInner">
                    <ChatIcon className="icon" />
                    <div className="settingText">
                      <h4>Theme</h4>
                      <span>Light mode</span>
                    </div>
                  </div>
                  <Chevron className="icon chevron" />
                </div>
              </div>
            </button>
            <button className="settingItem">
              <div className="container">
                <div className="row">
                  <div className="settingItemInner">
                    <ChatIcon className="icon" />
                    <h4 className="">Wallpaper</h4>
                  </div>
                  <Chevron className="icon chevron" />
                </div>
              </div>
            </button>
            <button className="settingItem logout" onClick={openLogoutPopup}>
              <div className="container">
                <div className="row">
                  <LogoutBtn className="icon" />
                  <span>Log out</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <PopupModal
        title="Log out"
        confirmBtnText="Log out"
        isOpen={showLogoutPopup}
        onConfirm={handleLogout}
        onCancel={closeLogoutPopup}
      >
        <p>Are you sure you want to logout?</p>
      </PopupModal>

      <PopupModal
        title="Theme"
        confirmBtnText="OK"
        isOpen={showThemePopup}
        onConfirm={null} 
        onCancel={closeThemePopup}
      >
        <div className="themeOption">
          <input type="radio" name="theme" id="light" />
          <label htmlFor="light">Light</label>
        </div>
        <div className="themeOption">
          <input type="radio" name="theme" id="dark" />
          <label htmlFor="dark">Dark</label>
        </div>
        <div className="themeOption">
          <input type="radio" name="theme" id="default" />
          <label htmlFor="default">System default</label>
        </div>
      </PopupModal>
    </div>
  );
};

export default Setting;

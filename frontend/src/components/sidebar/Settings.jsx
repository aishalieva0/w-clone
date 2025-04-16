import React, { useEffect, useState } from "react";
import LogoutBtn from "../../assets/media/icons/logout.svg?react";
import ChatIcon from "../../assets/media/icons/chatIcon.svg?react";
import { logOutUser } from "../../firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import DefaultProfilePhoto from "../../assets/media/user/user-default.jpg";
import { setActiveTab } from "../../redux/slices/sidebarSlice";

const Setting = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    logOutUser(dispatch);
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
          <div className="container">
            <div
              className="profileInfo"
              onClick={() => dispatch(setActiveTab("profileTab"))}
            >
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
            <div className="settingList">
              <button className="settingItem">
                <ChatIcon className="icon" />
                Theme
              </button>
              <button className="settingItem">
                <ChatIcon className="icon" />
                <span>Wallpaper</span>
              </button>
              <button className="settingItem logout" onClick={handleLogout}>
                <LogoutBtn className="icon" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;

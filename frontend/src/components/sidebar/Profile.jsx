import React from "react";
import DefaultProfilePhoto from "../../assets/media/user/user-default.jpg";
import CameraIcon from "../../assets/media/icons/camera.svg?react";
import EmojiInput from "../../assets/media/icons/emojiInput.svg?react";
import CheckMark from "../../assets/media/icons/checkMark.svg?react";
import Pencil from "../../assets/media/icons/pencil.svg?react";
import View from "../../assets/media/icons/view.svg?react";
import CameraOutline from "../../assets/media/icons/cameraOutline.svg?react";
import Folder from "../../assets/media/icons/folder.svg?react";
import Delete from "../../assets/media/icons/delete.svg?react";

const Profile = () => {
  return (
    <div className="profile">
      <div className="row">
        <div className="heading">
          <h2>Profile</h2>
        </div>
        <div className="profileContent">
          <div className="profileImgContainer">
            <div className="profileImg">
              <img src={DefaultProfilePhoto} alt="Profile Image" />
            </div>
            <div className="editImg">
              <CameraIcon className="icon" />
              <span>Change Profile Photo</span>
            </div>
            <ul className="optionList">
              <li className="optionItem">
                <View className="icon" />
                <span>View photo</span>
              </li>
              <li className="optionItem">
                <CameraOutline className="icon" />
                <span>Take photo</span>
              </li>
              <li className="optionItem">
                <Folder className="icon" />
                <span>Upload photo</span>
              </li>
              <hr className="divider" />
              <li className="optionItem">
                <Delete className="icon" />
                <span>Remove photo</span>
              </li>
            </ul>
          </div>
          <div className="profileInfo">
            <div className="detailContainer">
              <p className="title">Your name</p>
              <div className="display">
                <p>aisha</p>
                <Pencil className="icon icon-fixed" />
              </div>
              <div className="inputGroup">
                <input type="text" maxlength="25" />
                <div className="btnGroup">
                  <span className="letterCount">25</span>
                  <div className="iconGroup">
                    <EmojiInput className="icon emoji" />
                    <CheckMark className="icon icon-fixed" />
                  </div>
                </div>
              </div>
            </div>
            <div className="desc">
              <p>This name will be visible to everyone for finding you.</p>
            </div>
            <div className="detailContainer">
              <p className="title">About</p>
              <div className="display">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <Pencil className="icon icon-fixed" />
              </div>
              <div className="inputGroup">
                <input type="text" maxlength="25" />
                <div className="btnGroup">
                  <span className="letterCount">25</span>
                  <div className="iconGroup">
                    <EmojiInput className="icon emoji" />
                    <CheckMark className="icon icon-fixed" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

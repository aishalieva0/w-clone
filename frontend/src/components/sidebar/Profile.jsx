import React, { useEffect, useRef, useState } from "react";
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
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState("aisha");
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [about, setAbout] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  );
  const [optionVisible, setOptionVisible] = useState(false);
  const [optionPosition, setOptionPosition] = useState({ top: 0, left: 0 });
  const [showEditImg, setShowEditImg] = useState(false);
  const optionRef = useRef(null);
  const nameRef = useRef(null);
  const aboutRef = useRef(null);

  const handleOptionClick = (e) => {
    setOptionVisible(!optionVisible);
    setOptionPosition({ top: e.clientY, left: e.clientX });
  };
  const handleClickOutside = (e) => {
    if (optionRef.current && !optionRef.current.contains(e.target)) {
      setOptionVisible(false);
      setShowEditImg(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isEditingAbout && aboutRef.current) {
      autoResize(aboutRef.current);
    }
  }, [isEditingAbout]);

  const autoResize = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  useEffect(() => {
    if (isEditingName && nameRef.current) {
      nameRef.current.focus();
    }
    if (isEditingAbout && aboutRef.current) {
      aboutRef.current.focus();
    }
  }, [isEditingName, isEditingAbout]);

  return (
    <div className="profile">
      <div className="row">
        <div className="heading">
          <h2>Profile</h2>
        </div>
        <div className="profileContent">
          <div className="profileImgContainer">
            <div
              className="profileImg"
              ref={optionRef}
              onMouseEnter={() => setShowEditImg(true)}
              onMouseLeave={() => !optionVisible && setShowEditImg(false)}
            >
              <img src={DefaultProfilePhoto} alt="Profile Image" />
              <div
                className={`editImg ${
                  showEditImg || optionVisible ? "visible" : ""
                }`}
                onClick={handleOptionClick}
              >
                <CameraIcon className="icon" />
                <span>Change Profile Photo</span>
              </div>
              <ul
                className={`optionList ${optionVisible ? "visible" : ""}`}
                style={{ top: optionPosition.top, left: optionPosition.left }}
              >
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
          </div>
          <div className="profileInfo">
            <div className="detailContainer">
              <p className="title">Your name</p>
              <div
                className={`display ${isEditingName ? "" : "visible-static"}`}
              >
                <p>{name}</p>
                <button
                  onClick={() => {
                    setIsEditingName(true);
                  }}
                >
                  <Pencil className="icon icon-fixed" />
                </button>
              </div>

              <div
                className={`inputGroup ${
                  isEditingName ? "visible-static" : ""
                }`}
              >
                <input
                  ref={nameRef}
                  type="text"
                  maxLength="25"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <div className="btnGroup">
                  <span className="letterCount">{25 - name.length}</span>
                  <div className="iconGroup">
                    <button>
                      <EmojiInput className="icon emoji" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                      }}
                    >
                      <CheckMark className="icon icon-fixed" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="desc">
              <p>This name will be visible to everyone for finding you.</p>
            </div>
            <div className="detailContainer">
              <p className="title">About</p>
              <div
                className={`display ${isEditingAbout ? "" : "visible-static"}`}
              >
                <p>{about}</p>
                <button
                  onClick={() => {
                    setIsEditingAbout(true);
                  }}
                >
                  <Pencil className="icon icon-fixed" />
                </button>
              </div>
              <div
                className={`inputGroup ${
                  isEditingAbout ? "visible-static" : ""
                }`}
              >
                <textarea
                  ref={aboutRef}
                  value={about}
                  onChange={(e) => {
                    setAbout(e.target.value);
                    autoResize(e.target);
                  }}
                  rows="1"
                  maxLength="139"
                />
                <div className="btnGroup">
                  <span className="letterCount">{139 - about.length}</span>
                  <div className="iconGroup">
                    <button>
                      <EmojiInput className="icon emoji" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingAbout(false);
                      }}
                    >
                      <CheckMark className="icon icon-fixed" />
                    </button>
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

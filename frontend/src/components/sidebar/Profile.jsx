import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeEmojiPicker,
  openEmojiPicker,
  setSelectedEmoji,
} from "../../redux/slices/emojiSlice";
import { setUser } from "../../redux/slices/userSlice";
import axios from "axios";
import DefaultProfilePhoto from "../../assets/media/user/user-default.jpg";
import CameraIcon from "../../assets/media/icons/camera.svg?react";
import EmojiInput from "../../assets/media/icons/emojiInput.svg?react";
import CheckMark from "../../assets/media/icons/checkmark.svg?react";
import Pencil from "../../assets/media/icons/pencil.svg?react";
import View from "../../assets/media/icons/view.svg?react";
import CameraOutline from "../../assets/media/icons/cameraOutline.svg?react";
import Folder from "../../assets/media/icons/folder.svg?react";
import Delete from "../../assets/media/icons/delete.svg?react";
import EmojiPicker from "../EmojiPicker";
import notifyToast from "../../utils/toastifyMsg";
import { storage } from "../../firebase/firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getStorage,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Profile = () => {
  const dispatch = useDispatch();
  const { targetInput, selectedEmoji } = useSelector((state) => state.emoji);
  const { user } = useSelector((state) => state.user);
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState("");
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [about, setAbout] = useState("");
  const [optionVisible, setOptionVisible] = useState(false);
  const [optionPosition, setOptionPosition] = useState({ top: 0, left: 0 });
  const [showEditImg, setShowEditImg] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const optionRef = useRef(null);
  const nameRef = useRef(null);
  const aboutRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const handleOptionClick = (e) => {
    setOptionVisible(!optionVisible);
    setOptionPosition({ top: e.clientY, left: e.clientX });
  };

  const handleClickOutside = (e) => {
    if (optionRef.current && !optionRef.current.contains(e.target)) {
      setOptionVisible(false);
      setShowEditImg(false);
    }

    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(e.target) &&
      !e.target.closest(".emojiBtn")
    ) {
      dispatch(closeEmojiPicker());
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

  useEffect(() => {
    if (selectedEmoji && targetInput) {
      handleEmojiSelect(selectedEmoji, targetInput);
      dispatch(setSelectedEmoji(null));
    }
  }, [selectedEmoji, targetInput]);

  const handleEmojiSelect = (emoji, target) => {
    if (target === "name") {
      insertAtCursor(nameRef.current, setName, emoji);
    } else if (target === "about") {
      insertAtCursor(aboutRef.current, setAbout, emoji);
    }
  };

  const handleEmojiButtonClick = (e, target) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dispatch(
      openEmojiPicker({
        target,
        position: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        },
      })
    );
  };

  const insertAtCursor = (input, setState, emoji) => {
    if (!input) return;
    const { selectionStart, selectionEnd, value } = input;
    const newValue =
      value.substring(0, selectionStart) +
      emoji +
      value.substring(selectionEnd);
    setState(newValue);
    setTimeout(() => {
      input.selectionStart = input.selectionEnd = selectionStart + emoji.length;
      input.focus();
    }, 0);
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAbout(user.about);
      setProfileImage(user.profilePic || DefaultProfilePhoto);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/${user.uid}`,
        { name, about }
      );
      dispatch(setUser(res.data));
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      notifyToast("Only JPG, PNG, and WEBP files are allowed!", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      notifyToast("File size should be less than 10MB!", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      setProfileImage(reader.result);
      await uploadProfileImage(file);
    };
    reader.readAsDataURL(file);
  };

  const uploadProfileImage = async (file) => {
    try {
      const storageRef = ref(storage, `profileImages/${uuidv4()}`);
      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef);

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/${user.uid}/profile-photo`,
        { profilePic: imageUrl }
      );

      dispatch(setUser({ ...user, profilePic: imageUrl }));
      notifyToast("Profile photo updated!", "success");
    } catch (error) {
      notifyToast("Failed to update profile photo!", "error");
      console.error("Upload error:", error);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      if (user.profilePic) {
        const storage = getStorage();
        const decodedUrl = decodeURIComponent(user.profilePic);
        const path = decodedUrl.split("/o/")[1].split("?")[0];
        const imageRef = ref(storage, path);

        await deleteObject(imageRef);
      }

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/${user.uid}/profile-photo`,
        {
          profilePic: null,
        }
      );

      dispatch(setUser({ ...user, profilePic: null }));
      setProfileImage(DefaultProfilePhoto);
      notifyToast("Profile photo removed!", "success");
    } catch (error) {
      notifyToast("Failed to remove photo!", "error");
      console.error("Remove photo error:", error);
    }
  };

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
              <img
                src={profileImage || DefaultProfilePhoto}
                alt="Profile Image"
              />
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
                {profileImage && (
                  <li className="optionItem">
                    <View className="icon" />
                    <span>View photo</span>
                  </li>
                )}

                <li className="optionItem">
                  <CameraOutline className="icon" />
                  <span>Take photo</span>
                </li>
                <li
                  className="optionItem"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Folder className="icon" />
                  <span>Upload photo</span>
                </li>
                {profileImage && (
                  <>
                    <hr className="divider" />
                    <li className="optionItem" onClick={handleRemovePhoto}>
                      <Delete className="icon" />
                      <span>Remove photo</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
            />
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
                    <button
                      className="emojiBtn"
                      onClick={(e) => handleEmojiButtonClick(e, "name")}
                    >
                      <EmojiInput className="icon emoji" />
                    </button>
                    <button
                      onClick={() => {
                        if (!name.trim()) {
                          notifyToast("Name cannot be empty!", "error");
                          return;
                        }
                        setIsEditingName(false);
                        handleSave();
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
                    <button
                      className="emojiBtn"
                      onClick={(e) => handleEmojiButtonClick(e, "about")}
                    >
                      <EmojiInput className="icon emoji" />
                    </button>
                    <button
                      onClick={() => {
                        if (!about.trim()) {
                          notifyToast("Name cannot be empty!", "error");
                          return;
                        }
                        setIsEditingAbout(false);
                        handleSave();
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
      {targetInput && (
        <div ref={emojiPickerRef} className="emojiField">
          <EmojiPicker />
        </div>
      )}
    </div>
  );
};

export default Profile;

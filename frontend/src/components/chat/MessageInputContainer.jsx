import React, { useEffect, useRef, useState } from "react";
import SendMsgBtn from "../../assets/media/icons/sendMsgBtn.svg?react";
import PlusBtn from "../../assets/media/icons/plusBtn.svg?react";
import EmojiInput from "../../assets/media/icons/emojiInput.svg?react";
import VoiceMsgBtn from "../../assets/media/icons/voiceMsgBtn.svg?react";
import DocumentIcon from "../../assets/media/icons/document.svg?react";
import CameraIcon from "../../assets/media/icons/cameraColor.svg?react";
import MediaIcon from "../../assets/media/icons/media.svg?react";
import CloseBtn from "../../assets/media/icons/close.svg?react";
import DocumentPreview from "../../assets/media/icons/documentPreview.svg?react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeEmojiPicker,
  openEmojiPicker,
  setSelectedEmoji,
} from "../../redux/slices/emojiSlice";
import EmojiPicker from "../EmojiPicker";
import { storage } from "../../firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const MessageInputContainer = ({ message, setMessage, sendMessage }) => {
  const dispatch = useDispatch();
  const { targetInput, selectedEmoji } = useSelector((state) => state.emoji);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachmentModalRef = useRef(null);
  const plusBtnRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const [inputMsg, setInputMsg] = useState("");
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setInputMsg(textarea.value);
  };

  const handleClickOutside = (e) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(e.target) &&
      !e.target.closest(".emojiBtn")
    ) {
      dispatch(closeEmojiPicker());
    }

    if (
      attachmentModalRef.current &&
      !attachmentModalRef.current.contains(e.target) &&
      !e.target.closest(".plusBtn")
    ) {
      setShowAttachmentOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedEmoji && targetInput) {
      handleEmojiSelect(selectedEmoji, targetInput);
      dispatch(setSelectedEmoji(null));
    }
  }, [selectedEmoji, targetInput]);

  const handleEmojiSelect = (emoji, target) => {
    if (target === "message") {
      insertAtCursor(textareaRef.current, setMessage, emoji);
    }
  };

  const handleEmojiButtonClick = (e, target) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dispatch(
      openEmojiPicker({
        target,
        position: {
          top: rect.top + window.scrollY - 30,
          left: rect.left + window.scrollX - 270,
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
    if (showAttachmentOptions) {
      attachmentModalRef.current.classList.add("open");
      plusBtnRef.current.classList.add("active");
    } else {
      attachmentModalRef.current.classList.remove("open");
      plusBtnRef.current.classList.remove("active");
    }
  }, [showAttachmentOptions]);

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    fileInputRef.current.value = "";
    cameraInputRef.current.value = "";
    documentInputRef.current.value = "";
  };

  const formatFileSize = (size) => {
    return size < 1024
      ? `${size} B`
      : size < 1024 * 1024
      ? `${(size / 1024).toFixed(1)} KB`
      : `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadFileToFirebase = async (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file selected");

      setIsUploading(true);
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          setIsUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setIsUploading(false);

          const mediaType = file.type.split("/")[0];

          resolve({ fileUrl: downloadURL, mediaType });
        }
      );
    });
  };

  const handleSend = async () => {
    if (!message.trim() && !selectedFile) return;

    let fileUrl = null;
    let mediaType = null;

    if (selectedFile) {
      const uploadResult = await uploadFileToFirebase(selectedFile);
      fileUrl = uploadResult.fileUrl;
      mediaType = uploadResult.mediaType;
    }

    sendMessage(message, fileUrl, mediaType);
    setMessage("");
    setSelectedFile(null);
  };

  return (
    <div className="messageInputContainer">
      <div className="row">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*, video/*"
          onChange={handleFileChange}
        />

        <input
          type="file"
          ref={cameraInputRef}
          style={{ display: "none" }}
          accept="image/*, video/*"
          capture="environment"
          onChange={handleFileChange}
        />

        <input
          type="file"
          ref={documentInputRef}
          style={{ display: "none" }}
          accept=".pdf, .docx, .txt"
          onChange={handleFileChange}
        />
        <button
          className="plusBtn"
          onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
          ref={plusBtnRef}
        >
          <PlusBtn className="icon" />
        </button>

        <div className="attachmentModal open" ref={attachmentModalRef}>
          <button onClick={() => documentInputRef.current.click()}>
            <DocumentIcon />
            <span>Document</span>
          </button>
          <button onClick={() => fileInputRef.current.click()}>
            <MediaIcon />
            <span>Photos & Videos</span>
          </button>
          <button onClick={() => cameraInputRef.current.click()}>
            <CameraIcon />
            <span>Camera</span>
          </button>
        </div>

        <div className="messageInput">
          <button
            className="emojiBtn"
            onClick={(e) => handleEmojiButtonClick(e, "message")}
          >
            <EmojiInput className="icon emoji" />
          </button>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            ref={textareaRef}
            onInput={handleInput}
            rows={1}
            type="text"
            placeholder="Type a message"
          />
        </div>

        {inputMsg ? (
          <button onClick={handleSend} className="sendMsgBtn">
            <SendMsgBtn />
          </button>
        ) : (
          <button className="sendVoiceMsgBtn">
            <VoiceMsgBtn />
          </button>
        )}
      </div>
      {targetInput && (
        <div ref={emojiPickerRef} className="emojiField">
          <EmojiPicker />
        </div>
      )}

      {selectedFile && (
        <div className="filePreview">
          <div className="container">
            <div className="row">
              <div className="heading">
                <button className="closeBtn" onClick={removeFile}>
                  <CloseBtn className="icon" />
                </button>
              </div>
              <div className="content">
                {previewUrl ? (
                  selectedFile.type.startsWith("image") ? (
                    <img
                      src={previewUrl}
                      className="previewImg"
                      alt="Preview"
                    />
                  ) : (
                    <video controls className="previewVideo">
                      <source src={previewUrl} type={selectedFile.type} />
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <div className="noPreview">
                    <DocumentPreview />
                    <div className="details">
                      <span>No preview available</span>
                      <p>
                        {formatFileSize(selectedFile.size)} -{" "}
                        {selectedFile.name.split(".").pop().toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="bottom">
                <button onClick={handleSend} disabled={isUploading}>
                  <SendMsgBtn className="icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInputContainer;

import React, { useEffect, useRef, useState } from "react";
import SendMsgBtn from "../../assets/media/icons/sendMsgBtn.svg?react";
import PlusBtn from "../../assets/media/icons/plusBtn.svg?react";
import ExpressionBtn from "../../assets/media/icons/expressionBtn.svg?react";
import EmojiInput from "../../assets/media/icons/emojiInput.svg?react";
import VoiceMsgBtn from "../../assets/media/icons/voiceMsgBtn.svg?react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeEmojiPicker,
  openEmojiPicker,
  setSelectedEmoji,
} from "../../redux/slices/emojiSlice";
import EmojiPicker from "../EmojiPicker";

const MessageInputContainer = ({ message, setMessage, sendMessage }) => {
  const dispatch = useDispatch();
  const { targetInput, selectedEmoji } = useSelector((state) => state.emoji);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const [inputMsg, setInputMsg] = useState("");

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
  return (
    <div className="messageInputContainer">
      <div className="row">
        <button className="plusBtn">
          <PlusBtn />
        </button>

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
          <button onClick={sendMessage} className="sendMsgBtn">
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
    </div>
  );
};

export default MessageInputContainer;

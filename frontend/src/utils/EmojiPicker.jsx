import React, { useEffect, useRef } from "react";
import { Picker } from "@emoji-mart/react";
import data from "@emoji-mart/data";

const EmojiPicker = ({ isVisible, onClose, onSelect }) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="emojiPicker">
      <div ref={pickerRef} className="pickerWrapper">
        <Picker data={data} onEmojiSelect={onSelect} />
      </div>
    </div>
  );
};

export default EmojiPicker;

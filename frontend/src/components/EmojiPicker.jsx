import React from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedEmoji } from "../redux/slices/emojiSlice";

const EmojiPicker = () => {
  const dispatch = useDispatch();
  const { isOpen, position } = useSelector((state) => state.emoji);

  if (!isOpen) return null;

  return (
    <div
      className="emojiPickerContainer"
      style={{
        top: position?.top - 410 || 0,
        left: position?.left || 0,
        transform: "translateY(5px)",
      }}
    >
      <Picker
        data={data}
        onEmojiSelect={(emoji) => {
          dispatch(setSelectedEmoji(emoji.native));
        }}
        maxFrequentRows={2}
        perLine={15}
        emojiSize={28}
        previewPosition="none"
      />
    </div>
  );
};

export default EmojiPicker;
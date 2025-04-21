import React from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedEmoji } from "../redux/slices/emojiSlice";

const EmojiPicker = () => {
  const dispatch = useDispatch();
  const { isOpen, position } = useSelector((state) => state.emoji);
  const theme = useSelector((state) => state.theme.theme);

  if (!isOpen) return null;

  const isMobile = window.innerWidth <= 768;

  const mobileStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "320px",
    background: "#fff",
    zIndex: 1000,
    borderTop: "1px solid #ddd",
  };

  const desktopStyle = {
    position: "absolute",
    top: position?.top - 410 || 0,
    left: position?.left || 0,
    transform: "translateY(5px)",
    zIndex: 1000,
  };

  return (
    <div
      className="emojiPickerContainer"
      style={isMobile ? mobileStyle : desktopStyle}
      // style={{
      //   top: position?.top - 410 || 0,
      //   left: position?.left || 0,
      //   transform: "translateY(5px)",
      // }}
    >
      <Picker
        data={data}
        onEmojiSelect={(emoji) => {
          dispatch(setSelectedEmoji(emoji.native));
        }}
        maxFrequentRows={2}
        // perLine={15}
        perLine={isMobile ? 8 : 15}
        emojiSize={28}
        previewPosition="none"
        theme={theme}
      />
    </div>
  );
};

export default EmojiPicker;

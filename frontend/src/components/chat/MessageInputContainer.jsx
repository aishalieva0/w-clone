import React, { useRef, useState } from "react";
import SendMsgBtn from "../../assets/media/icons/sendMsgBtn.svg?react";
import PlusBtn from "../../assets/media/icons/plusBtn.svg?react";
import ExpressionBtn  from "../../assets/media/icons/expressionBtn.svg?react";
import VoiceMsgBtn  from "../../assets/media/icons/voiceMsgBtn.svg?react";

const MessageInputContainer = ({ message, setMessage, sendMessage }) => {
  const textareaRef = useRef(null);
  const [inputMsg, setInputMsg] = useState("");

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setInputMsg(textarea.value);
  };
  return (
    <div className="messageInputContainer">
      <button className="plusBtn">
        <PlusBtn/>
      </button>

      <div className="messageInput">
        <button className="expressionBtn">
          <ExpressionBtn />
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
  );
};

export default MessageInputContainer;

import React from "react";

import { ReactComponent as MsgDeliveredIcon } from "../../assets/media/icons/msgDelivered.svg";
import { ReactComponent as MsgSentIcon } from "../../assets/media/icons/msgSent.svg";

const MessageItem = ({ className }) => {
  return (
    <div className={`messageItem ${className}`}>
      <p className="messageText">This is a sample message.</p>
      <div className="details">
        <span className="messageTimestamp">12:34</span>
        <span className="messageStatus">
          <MsgDeliveredIcon />
        </span>
      </div>
    </div>
  );
};

export default MessageItem;

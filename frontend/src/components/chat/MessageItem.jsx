import React from "react";

import { ReactComponent as MsgDeliveredIcon } from "../../assets/media/icons/msgDelivered.svg";
import { ReactComponent as MsgSentIcon } from "../../assets/media/icons/msgSent.svg";

const MessageItem = ({ message, isSent }) => {
  console.log(message.status, message.message);
  return (
    <div
      className={`messageItem ${isSent ? "sentMessage" : "receivedMessage"}`}
    >
      <p className="messageText">{message.message}</p>
      <div className="details">
        <span className="messageTimestamp">12:34</span>
        <span className="messageStatus">
          {message.status === "sent" ? (
            <MsgSentIcon />
          ) : message.status === "delivered" ? (
            <MsgDeliveredIcon />
          ) : message.status === "read" ? (
            <MsgDeliveredIcon color="blue" />
          ) : null}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;

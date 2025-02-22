import React from "react";
import moment from "moment-timezone";
import { ReactComponent as MsgDeliveredIcon } from "../../assets/media/icons/msgDelivered.svg";
import { ReactComponent as MsgSentIcon } from "../../assets/media/icons/msgSent.svg";

const MessageItem = ({ message, isSent }) => {
  const localTimestamp = moment(message.timestamp)
    .tz("Asia/Baku")
    .format("HH:mm");
  return (
    <div
      className={`messageItem ${isSent ? "sentMessage" : "receivedMessage"}`}
    >
      <p className="messageText">{message.message}</p>
      <div className="details">
        <span className="messageTimestamp">{localTimestamp}</span>
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

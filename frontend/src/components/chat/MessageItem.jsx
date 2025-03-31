import React from "react";
import moment from "moment-timezone";
import MsgDeliveredIcon from "../../assets/media/icons/msgDelivered.svg?react";
import MsgSentIcon from "../../assets/media/icons/msgSent.svg?react";

const MessageItem = ({ message, isSent }) => {
  const localTimestamp = moment(message.timestamp)
    .tz("Asia/Baku")
    .format("HH:mm");
  return (
    <div
      className={`messageItem ${isSent ? "sentMessage" : "receivedMessage"}`}
    >
      {message.media && message.mediaType === "image" && (
        <div className="messageMedia">
          <img src={message.media} alt="image" />
        </div>
      )}

      {message.media && message.mediaType === "video" && (
        <div className="messageMedia">
          <video controls className="message-video">
            <source src={message.media} type="video/mp4" />
            Your browser does not support the video tag.
          </video>{" "}
        </div>
      )}

      {message.media && message.mediaType === "text" && (
        <div className="messageDoc">
          <a
            href={message.media}
            target="_blank"
            rel="noopener noreferrer"
            className="message-document"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAA8CAYAAADL94L/AAAByElEQVR4Ae3axdJTQRAFYFyegA3u8ALseCDcicsGhxt3x+G32BXc3X3NBnfXYTqp3sZlhuqpOlXZRL46He9ReJyJxGSTEreaPfEHZiX+1uSJvelVNu+Jvjd7Yk9zI8aSUe0eDpjCIYfNSuw5v/zF5In/6mU27478tXriLJvXjdSwPq1lCDTCmxjiCNav8GZYBVMwWKagX8kWjk9vCcMhYWhEFEw1+oV0wZjdPKY6Vn9EwmBDTYPwBoXCYPLGDQTJjkHQNQRJj0FQtmgs+C8wOHIIkh2DoDu5vD5Xfkz9hsTBWDyxhjDYUDqvLRYSY1JilSQGyyxXOt4QKJPX70NDQmI27gyxHcn9bH/5RFMNAUgoDI4afOAMHBiCdiDNj5woGAhgsCEYudSI1lBCRwoPL957slAoDDYEoPXb/ZVs3FE/y9072fDxsx4BMPVfGOpl1VY/y5++4EWM1Fm9LcCKpy8RpnchDGEIQxjCEIYwhCEMYQhDGMIQhjCEIQxhCEMYwhCGMIQhDGEIQxhYNlXiP+XHXLRDM5thQVpyzIfS2YtLceVEkRmzalsgMArPhp258bA6b/LEb8LqPM930VNdvY/fhMmCxw+Of+4BTcPInBo2AAAAAElFTkSuQmCC"
              alt="document"
            />
            View Document
          </a>
        </div>
      )}

      {message.message && <p className="messageText">{message.message}</p>}

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

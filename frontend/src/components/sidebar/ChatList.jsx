import React, { useEffect, useState } from "react";
// import { ReactComponent as newChatIcon } from "../../assets/media/icons/newChat.svg";
import { ReactComponent as NewChatIcon } from "../../assets/media/icons/newChat.svg";
import { ReactComponent as MoreIcon } from "../../assets/media/icons/more.svg";
import DefaultProfilePhoto from "../../assets/media/user/user-default.jpg";
import { useSocket } from "../../context/socket";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat } from "../../redux/slices/chatSlice";
import axios from "axios";

const ChatList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5001/conversations/${user.email}`
        );
        setConversations(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    socket.on("update-conversation", (data) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.email === data.receiver || conv.email === data.sender
            ? {
                ...conv,
                lastMessage: data.message,
                time: new Date(data.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }),
                unread:
                  conv.email === data.sender
                    ? (conv.unread || 0) + 1
                    : conv.unread,
              }
            : conv
        )
      );
    });

    return () => {
      socket.off("update-conversation");
    };
  }, [socket]);

  const handleChatClick = async (chat) => {
    dispatch(setActiveChat(chat));

    try {
      await axios.put("http://localhost:5001/conversations/mark-read", {
        sender: chat.email,
        receiver: user.email,
      });

      // Update unread count in state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.email === chat.email ? { ...conv, unread: 0 } : conv
        )
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  return (
    <div className="chatList">
      <div className="container">
        <div className="row">
          <div className="heading">
            <div className="title">
              <h2>Chats</h2>
            </div>
            <div className="moreIcons">
              <NewChatIcon className="icon" />
              <MoreIcon className="icon" />
            </div>
          </div>
          <div className="searchBar">
            <input type="text" name="search" id="search" placeholder="Search" />
          </div>
          <div className="chatFilter">
            <span className="active">All</span>
            <span>Unread</span>
            <span>Favorites</span>
            <span>Groups</span>
          </div>
          <ul className="conversationList">
            {conversations.map((chat, index) => (
              <li
                className="chatItem"
                key={index}
                onClick={() => handleChatClick(chat)}
              >
                <div className="profileImg">
                  <img src={DefaultProfilePhoto} alt="profile_photo" />
                </div>
                <div className="content">
                  <div className="info">
                    <h3>{chat.name}</h3>
                    <p>{chat.lastMessage}</p>
                  </div>
                  <div className="details">
                    <span className="date">{chat.time}</span>
                    {chat.unread > 0 && (
                      <span className="unread">{chat.unread}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatList;

import React, { useEffect, useState } from "react";
import NewChatIcon from "../../assets/media/icons/newChat.svg?react";
import MoreIcon from "../../assets/media/icons/more.svg?react";
import DefaultProfilePhoto from "../../assets/media/user/userDefault.svg?react";
import { useSocket } from "../../context/socket";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveChat } from "../../redux/slices/chatSlice";
import axios from "axios";

const ChatList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const activeChat = useSelector((state) => state.chat.activeChat);
  const [conversations, setConversations] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const socket = useSocket();

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid date";

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/conversations/${user.email}`
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
      setConversations((prev) => {
        const updated = prev.map((conv) =>
          conv.email === data.receiver || conv.email === data.sender
            ? {
                ...conv,
                lastMessage: data.message,
                timestamp: data.timestamp,
                unread:
                  conv.email === data.sender
                    ? (conv.unread || 0) + 1
                    : conv.unread,
              }
            : conv
        );
        return updated.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
      });
    });

    return () => {
      socket.off("update-conversation");
    };
  }, [socket]);

  const handleChatClick = async (chat) => {
    dispatch(setActiveChat(chat));

    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/conversations/mark-read`,
        {
          sender: chat.email,
          receiver: user.email,
        }
      );

      setConversations((prev) =>
        prev.map((conv) =>
          conv.email === chat.email ? { ...conv, unread: 0 } : conv
        )
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);

    if (searchTerm.trim() === "" || !user?.uid) {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/search`,
        {
          params: { query: searchTerm, uid: user.uid },
        }
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const startChat = (selectedUser) => {
    navigate(`/chat/${selectedUser.uid}`);
  };

  return (
    <div className="chatList">
      <div className="row">
        <div className="heading">
          <div className="title">
            <h2>Chats</h2>
          </div>
        </div>
        <div className="searchBar">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search"
            value={query}
            onChange={handleSearch}
          />
        </div>
        <ul className="conversationList">
          {query && results.length > 0 ? (
            results.map((user, index) => (
              <li
                className="chatItem"
                key={index}
                onClick={() => {
                  startChat(user);
                  handleChatClick(user);
                }}
              >
                <div className="profileImgContainer">
                  <div className="profileImg">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt="profile image" />
                    ) : (
                      <DefaultProfilePhoto className="defaultImg" />
                    )}
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                </div>
              </li>
            ))
          ) : query.length > 0 && results.length === 0 ? (
            <div className="noResult">
              <span>No users found.</span>
            </div>
          ) : (
            conversations.map((chat, index) => (
              <li
                className={`chatItem ${
                  activeChat?.email === chat.email ? "activeChat" : ""
                }`}
                key={index}
                onClick={() => handleChatClick(chat)}
              >
                <div className="profileImgContainer">
                  <div className="profileImg">
                    {chat.profilePic ? (
                      <img src={chat.profilePic} alt="profile image" />
                    ) : (
                      <DefaultProfilePhoto className="defaultImg" />
                    )}
                  </div>
                </div>
                <div className="content">
                  <div className="info">
                    <h3>{chat.name}</h3>
                    <p>{chat.lastMessage}</p>
                  </div>
                  <div className="details">
                    <span className="date">{formatDate(chat.timestamp)}</span>
                    {chat.unread > 0 && (
                      <span className="unread">{chat.unread}</span>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;

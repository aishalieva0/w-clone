import React from "react";
// import { ReactComponent as newChatIcon } from "../../assets/media/icons/newChat.svg";
import { ReactComponent as NewChatIcon } from "../../assets/media/icons/newChat.svg";
import { ReactComponent as MoreIcon } from "../../assets/media/icons/more.svg";
import DefaultProfilePhoto from "../../assets/media/user/user-default.jpg";
import { useDispatch } from "react-redux";
import { setActiveChat } from "../../redux/slices/chatSlice";

const ChatList = () => {
  const dispatch = useDispatch();

  const conversations = [
    {
      email: "john@example.com",
      name: "John Doe",
      lastMessage: "Hey! Are you there?",
      time: "14:13",
      unread: 1,
    },
    {
      email: "jane@example.com",
      name: "Jane Doe",
      lastMessage: "Let's meet tomorrow!",
      time: "10:45",
      unread: 0,
    },
    {
      email: "aysalieva6@gmail.com",
      name: "Aisha",
      lastMessage: "Let's meet tomorrow!",
      time: "10:45",
      unread: 0,
    },
  ];

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
                onClick={() => dispatch(setActiveChat(chat))}
              >
                <div className="profileImg">
                  <img src={DefaultProfilePhoto} alt="profile_photo" />
                </div>
                <div className="content">
                  <div className="info">
                    <h3>{chat.name}</h3>
                    <p>Hey! Are you there?</p>
                  </div>
                  <div className="details">
                    <span className="date">14:13</span>
                    <span className="unread">1</span>
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

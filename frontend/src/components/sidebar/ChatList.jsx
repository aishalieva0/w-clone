import React from "react";
// import { ReactComponent as newChatIcon } from "../../assets/media/icons/newChat.svg";
import { ReactComponent as NewChatIcon } from "../../assets/media/icons/newChat.svg";
import { ReactComponent as MoreIcon } from "../../assets/media/icons/more.svg";
import DefaultProfilePhoto from "../../assets/media/user/user-default.jpg";

const ChatList = () => {
  return (
    <div className="chatList">
      <div className="container">
        <div className="row">
          <div className="chatHeader">
            <div className="heading">
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
            <li className="chatItem">
              <div className="profileImg">
                <img src={DefaultProfilePhoto} alt="profile_photo" />
              </div>
              <div className="content">
                <div className="info">
                  <h3>Jhon Doe</h3>
                  <p>Hey! Are you there?</p>
                </div>
                <div className="details">
                  <span className="date">14:13</span>
                  <span className="unread">1</span>
                </div>
              </div>
            </li>
            <li className="chatItem">
              <div className="profileImg">
                <img src={DefaultProfilePhoto} alt="profile_photo" />
              </div>
              <div className="content">
                <div className="info">
                  <h3>Jhon Doe</h3>
                  <p>Hey! Are you there?</p>
                </div>
                <div className="details">
                  <span className="date">14:13</span>
                  <span className="unread">1</span>
                </div>
              </div>
            </li>
            <li className="chatItem">
              <div className="profileImg">
                <img src={DefaultProfilePhoto} alt="profile_photo" />
              </div>
              <div className="content">
                <div className="info">
                  <h3>Jhon Doe</h3>
                  <p>Hey! Are you there?</p>
                </div>
                <div className="details">
                  <span className="date">14:13</span>
                  <span className="unread">1</span>
                </div>
              </div>
            </li>

            <li className="chatItem">
              <div className="profileImg">
                <img src={DefaultProfilePhoto} alt="profile_photo" />
              </div>
              <div className="content">
                <div className="info">
                  <h3>Jhon Doe</h3>
                  <p>Hey! Are you there?</p>
                </div>
                <div className="details">
                  <span className="date">14:13</span>
                  <span className="unread">1</span>
                </div>
              </div>
            </li>
            <li className="chatItem">
              <div className="profileImg">
                <img src={DefaultProfilePhoto} alt="profile_photo" />
              </div>
              <div className="content">
                <div className="info">
                  <h3>Jhon Doe</h3>
                  <p>Hey! Are you there?</p>
                </div>
                <div className="details">
                  <span className="date">14:13</span>
                  <span className="unread">1</span>
                </div>
              </div>
            </li>
            <li className="chatItem">
              <div className="profileImg">
                <img src={DefaultProfilePhoto} alt="profile_photo" />
              </div>
              <div className="content">
                <div className="info">
                  <h3>Jhon Doe</h3>
                  <p>Hey! Are you there?</p>
                </div>
                <div className="details">
                  <span className="date">14:13</span>
                  <span className="unread">1</span>
                </div>
              </div>
            </li>
            <li className="chatItem">
              <div className="profileImg">
                <img src={DefaultProfilePhoto} alt="profile_photo" />
              </div>
              <div className="content">
                <div className="info">
                  <h3>Jhon Doe</h3>
                  <p>Hey! Are you there?</p>
                </div>
                <div className="details">
                  <span className="date">14:13</span>
                  <span className="unread">1</span>
                </div>
              </div>
            </li>
            <li className="chatItem">
              <div className="profileImg">
                <img src={DefaultProfilePhoto} alt="profile_photo" />
              </div>
              <div className="content">
                <div className="info">
                  <h3>Jhon Doe</h3>
                  <p>Hey! Are you there?</p>
                </div>
                <div className="details">
                  <span className="date">14:13</span>
                  <span className="unread">1</span>
                </div>
              </div>
            </li>
            <li className="chatItem">
              <div className="profileImg">
                <img src={DefaultProfilePhoto} alt="profile_photo" />
              </div>
              <div className="content">
                <div className="info">
                  <h3>Jhon Doe</h3>
                  <p>Hey! Are you there?</p>
                </div>
                <div className="details">
                  <span className="date">14:13</span>
                  <span className="unread">1</span>
                </div>
              </div>
            </li>
            <li className="chatItem">
              <div className="profileImg">
                <img src={DefaultProfilePhoto} alt="profile_photo" />
              </div>
              <div className="content">
                <div className="info">
                  <h3>Jhon Doe</h3>
                  <p>Hey! Are you there?</p>
                </div>
                <div className="details">
                  <span className="date">14:13</span>
                  <span className="unread">1</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatList;

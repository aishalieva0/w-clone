import React, { useEffect, useMemo, useRef, useState } from "react";
import MessageList from "./MessageList";
import MessageInputContainer from "./MessageInputContainer";
import ChatInfo from "./ChatInfo";
import ChatHeader from "./ChatHeader";
import { useSocket } from "../../context/socket";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import setupSocketListeners from "../../socket/socketListeners";
import { markAsRead, sendMessage } from "../../socket/socketActions";
import { addMessage, setMessages } from "../../redux/slices/chatSlice";
import AnimationChatBubble from "../../assets/media/animation/AnimationChatBubble.json";
import Lottie from "lottie-react";

const ChatWindow = ({ chatWindowRef }) => {
  const [message, setMessage] = useState("");

  const { user } = useSelector((state) => state.user);
  const messages = useSelector((state) => state.chat.messages) || [];
  const activeChat = useSelector((state) => state.chat.activeChat);
  const currentMessages = useSelector((state) => state.chat.messages) || [];
  const preview = useSelector((state) => state.wallpaper.preview);
  const dispatch = useDispatch();
  const socket = useSocket();
  const [page, setPage] = useState(1);
  const messagesRef = useRef(null);
  useEffect(() => {
    if (!socket || !user) return;
    setupSocketListeners(socket, dispatch);
  }, [socket, user, dispatch]);

  // works---------
  // useEffect(() => {
  //   dispatch(setMessages([]));
  //   setPage(1);
  //   if (chatWindowRef.current) {
  //     chatWindowRef.current.classList.remove("open");
  //   }
  // }, [activeChat]);

  // useEffect(() => {
  //   if (!activeChat || !user) return;
  //   const fetchMessages = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `${import.meta.env.VITE_BASE_URL}/messages/${user.email}/${
  //           activeChat.email
  //         }?page=${page}&limit=20`
  //       );

  //       if (Array.isArray(data)) {
  //         const existingMessages = [...messages];
  //         dispatch(setMessages([...data.reverse(), ...existingMessages]));
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchMessages();
  // }, [page, activeChat, user, dispatch]);
  // works--------

  useEffect(() => {
    if (!activeChat || !user) return;
    dispatch(setMessages([]));
    setPage(1);
  }, [activeChat?.email, user?.email]);

  useEffect(() => {
    if (!activeChat || !user || !page) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/messages/${user.email}/${
            activeChat.email
          }?page=${page}&limit=20`
        );

        if (Array.isArray(data)) {
          if (page === 1) {
            dispatch(setMessages(data.reverse()));
          } else {
            dispatch(setMessages([...data.reverse(), ...currentMessages]));
          }
        }
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();
  }, [page, activeChat?.email, user?.email, dispatch]);

  useEffect(() => {
    if (!activeChat || !socket || !user) return;
    markAsRead(socket, activeChat.email, user.email);

    const updatedMessages = messages.map((msg) =>
      msg.sender === activeChat.email && msg.receiver === user.email
        ? { ...msg, status: "read" }
        : msg
    );

    dispatch(setMessages(updatedMessages));
  }, [activeChat, socket, user, dispatch]);

  useEffect(() => {
    if (!socket || !user || !activeChat) return;
    socket.emit("join-chat", { user: user.email, chatWith: activeChat.email });
    socket.emit("register-user", user.email);
    return () => {
      socket.emit("leave-chat", user.email);
      socket.emit("disconnect-user", user.email);
    };
  }, [socket, user, activeChat]);

  const handleSendMessage = (message, media = null, mediaType = null) => {
    if (!socket || !user || !activeChat || (!message.trim() && !media)) return;

    const newMessage = {
      sender: user.email,
      receiver: activeChat.email,
      message,
      media,
      mediaType,
      status: "sent",
      timestamp: new Date().toISOString(),
    };
    dispatch(addMessage(newMessage));

    sendMessage(socket, newMessage);
    setMessage("");
  };

  const handleScroll = () => {
    if (messagesRef.current && messagesRef.current.scrollTop === 0) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  }, [messages]);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();
    window.addEventListener("resize", setVh);

    return () => {
      window.removeEventListener("resize", setVh);
    };
  }, []);

  if (!activeChat && !preview) {
    return (
      <div className="startWindow">
        <div className="row">
          <Lottie
            animationData={AnimationChatBubble}
            loop={true}
            className="animation"
          />
          <div className="text">
            <p>You are not currently in a chat</p>
            <p>
              Start by selecting a chat from the sidebar or create a new one by
              typing a friend's name
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (preview) {
    return (
      <div
        className="chatWindow"
        style={{
          backgroundImage: `url(${preview})`,
          width: "100%",
        }}
      >
        <div className="previewHeader">
          <div className="row">
            <p>Wallpaper preview</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row">
        <ChatHeader activeChat={activeChat} chatWindowRef={chatWindowRef} />
        <MessageList
          messages={sortedMessages}
          userEmail={user?.email}
          messagesRef={messagesRef}
          handleScroll={handleScroll}
          activeChat={activeChat}
        />
        <MessageInputContainer
          message={message}
          setMessage={setMessage}
          sendMessage={handleSendMessage}
        />
      </div>
      <div className="chatInfoContainer">
        <ChatInfo chatWindowRef={chatWindowRef} />
      </div>
    </>
  );
};

export default ChatWindow;

import { useSelector } from "react-redux";
import ChatWindow from "../components/chat/ChatWindow";
import Sidebar from "../components/sidebar/Sidebar";
import { useRef } from "react";
import { useEffect } from "react";
const Chat = () => {
  const sidebarRef = useRef(null);
  const chatWindowRef = useRef(null);
  const activeChat = useSelector((state) => state.chat.activeChat);

  useEffect(() => {
    if (activeChat) {
      sidebarRef.current.classList.remove("activeWindow");
      chatWindowRef.current.classList.add("activeWindow");
    } else {
      sidebarRef.current.classList.add("activeWindow");
      chatWindowRef.current.classList.remove("activeWindow");
    }
  }, [activeChat]);

  useEffect(() => {
    const setAppHeight = () => {
      const appHeight = window.innerHeight;
      document.documentElement.style.setProperty(
        "--app-height",
        `${appHeight}px`
      );
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);

    return () => {
      window.removeEventListener("resize", setAppHeight);
    };
  }, []);

  return (
    <div className="chat">
      <div className="row">
        <div className="sidebar" ref={sidebarRef}>
          <Sidebar />
        </div>
        <div className="chatWindow" ref={chatWindowRef}>
          <ChatWindow chatWindowRef={chatWindowRef} />
        </div>
      </div>
    </div>
  );
};

export default Chat;

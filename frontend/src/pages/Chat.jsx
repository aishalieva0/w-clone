import { logOutUser } from "../firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import ChatWindow from "../components/chat/ChatWindow";
import Sidebar from "../components/sidebar/Sidebar";
import { useRef } from "react";
import { useEffect } from "react";
const Chat = () => {
  const sidebarRef = useRef(null);
  const chatWindowRef = useRef(null);
  const activeChat = useSelector((state) => state.chat.activeChat);
  const dispatch = useDispatch();

  const handleLogout = () => {
    logOutUser(dispatch);
  };

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

    setAppHeight(); // initial call
    window.addEventListener("resize", setAppHeight); // update on resize

    return () => {
      window.removeEventListener("resize", setAppHeight);
    };
  }, []);

  return (
    <div className="chat">
      <div className="row">
        {/* <button onClick={handleLogout}>logout</button> */}
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

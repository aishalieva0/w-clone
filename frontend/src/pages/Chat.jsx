import { useDispatch, useSelector } from "react-redux";
import ChatWindow from "../components/chat/ChatWindow";
import Sidebar from "../components/sidebar/Sidebar";
import { useRef } from "react";
import { useEffect } from "react";
import { setWallpaper } from "../redux/slices/wallpaperSlice";
const Chat = () => {
  const sidebarRef = useRef(null);
  const chatWindowRef = useRef(null);
  const activeChat = useSelector((state) => state.chat.activeChat);
  const wallpaper = useSelector((state) => state.wallpaper.image);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeChat) {
      sidebarRef.current.classList.remove("activeWindow");
      chatWindowRef.current.classList.add("activeWindow");
    } else {
      sidebarRef.current.classList.add("activeWindow");
      chatWindowRef.current.classList.remove("activeWindow");
    }
  }, [activeChat]);

  // useEffect(() => {
  //   const setAppHeight = () => {
  //     const appHeight = window.innerHeight;
  //     document.documentElement.style.setProperty(
  //       "--app-height",
  //       `${appHeight}px`
  //     );
  //   };

  //   setAppHeight();
  //   window.addEventListener("resize", setAppHeight);

  //   return () => {
  //     window.removeEventListener("resize", setAppHeight);
  //   };
  // }, []);

  useEffect(() => {
    const setAppHeight = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${vh}px`);
    };

    setAppHeight();

    window.visualViewport?.addEventListener("resize", setAppHeight);
    window.addEventListener("orientationchange", setAppHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", setAppHeight);
      window.removeEventListener("orientationchange", setAppHeight);
    };
  }, []);

  useEffect(() => {
    if (user?.wallpaper) {
      dispatch(setWallpaper(user.wallpaper));
    }
  }, [user]);

  return (
    <div className="chat">
      <div className="row">
        <div className="sidebar" ref={sidebarRef}>
          <Sidebar />
        </div>
        <div
          className="chatWindow"
          ref={chatWindowRef}
          style={{
            backgroundImage: `url(${wallpaper})`,
          }}
        >
          <ChatWindow chatWindowRef={chatWindowRef} />
        </div>
      </div>
    </div>
  );
};

export default Chat;

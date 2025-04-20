import React, { useEffect } from "react";
import LeftPanel from "./LeftPanel";
import ChatList from "./ChatList";
import StatusList from "./StatusList";
import Settings from "./Settings";
import Profile from "./Profile";
import { useDispatch, useSelector } from "react-redux";
import Wallpaper from "./Wallpaper";
import { clearPreviewWallpaper } from "../../redux/slices/wallpaperSlice";

const Sidebar = () => {
  const activeTab = useSelector((state) => state.sidebar.activeTab);
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeTab !== "wallpaperTab") {
      dispatch(clearPreviewWallpaper());
    }
  }, [activeTab]);

  let ContentComponent;
  switch (activeTab) {
    case "chatsTab":
      ContentComponent = <ChatList />;
      break;
    case "statusTab":
      ContentComponent = <StatusList />;
      break;
    case "settingTab":
      ContentComponent = <Settings />;
      break;
    case "profileTab":
      ContentComponent = <Profile />;
      break;
    case "wallpaperTab":
      ContentComponent = <Wallpaper />;
      break;
    default:
      ContentComponent = <ChatList />;
  }
  return (
    <>
      <LeftPanel />
      {ContentComponent}
    </>
  );
};

export default Sidebar;

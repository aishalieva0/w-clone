import React from "react";
import LeftPanel from "./LeftPanel";
import ChatList from "./ChatList";
import StatusList from "./StatusList";
import Settings from "./Settings";
import Profile from "./Profile";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const activeTab = useSelector((state) => state.sidebar.activeTab);
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
    default:
      ContentComponent = <ChatList />;
  }
  return (
    <div className="sidebar">
      <LeftPanel />
      {ContentComponent}
    </div>
  );
};

export default Sidebar;

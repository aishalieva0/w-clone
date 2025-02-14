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
    case "chats":
      ContentComponent = <ChatList />;
      break;
    case "status":
      ContentComponent = <StatusList />;
      break;
    case "setting":
      ContentComponent = <Settings />;
      break;
    case "profile":
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

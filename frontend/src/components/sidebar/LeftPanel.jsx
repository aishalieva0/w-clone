import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../redux/slices/sidebarSlice";

const LeftPanel = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.sidebar.activeTab);

  return (
    <div className="leftPanel">
      <div className="row">
        <ul className="topList">
          <li className="topItem">
            <button
              className={activeTab === "chats" ? "active" : ""}
              onClick={() => dispatch(setActiveTab("chats"))}
            >
              Chats
            </button>
          </li>
          <li className="topItem">
            <button
              className={activeTab === "status" ? "active" : ""}
              onClick={() => dispatch(setActiveTab("status"))}
            >
              Status
            </button>
          </li>
        </ul>
        <ul className="bottomList">
          <li className="bottomItem">
            <button
              className={activeTab === "setting" ? "active" : ""}
              onClick={() => dispatch(setActiveTab("setting"))}
            >
              Settings
            </button>
          </li>
          <li className="bottomItem">
            <button
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => dispatch(setActiveTab("profile"))}
            >
              Profile
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftPanel;

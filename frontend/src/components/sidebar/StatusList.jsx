import React, { useEffect, useRef, useState } from "react";
import DefaultProfilePhoto from "../../assets/media/user/user-default.jpg";
import AddBtn from "../../assets/media/icons/add.svg?react";
import PlusBtn from "../../assets/media/icons/plusSmall.svg?react";
import notifyToast from "../../utils/toastifyMsg";
import { useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig";
import axios from "axios";
import StoryViewer from "./StoryViewer";
import formatStoryTime from "../../utils/formatStoryTime";

const StatusList = () => {
  const { user } = useSelector((state) => state.user);
  const fileInputRef = useRef();
  const [stories, setStories] = useState([]);
  const [viewerStories, setViewerStories] = useState(null);
  const [groupedStories, setGroupedStories] = useState([]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.uid) return;

    const storageRef = ref(
      storage,
      `stories/${user.uid}/${Date.now()}-${file.name}`
    );
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await axios.post(`${import.meta.env.VITE_BASE_URL}/stories/upload`, {
        userId: user.uid,
        mediaUrl: downloadURL,
        type: file.type.startsWith("video") ? "video" : "image",
      });

      notifyToast("Story uploaded", "success");
    } catch (err) {
      console.error("Story upload error:", err);
      notifyToast("Story upload failed", "error");
    }
  };

  const handleStoryClick = (userId) => {
    const userStories = stories.filter((s) => s.userId === userId);
    setViewerStories(userStories);
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/stories`);
        setStories(res.data.stories);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    const grouped = Object.values(
      stories.reduce((acc, story) => {
        if (!acc[story.userId]) {
          acc[story.userId] = {
            userId: story.userId,
            username: story.username,
            profilePic: story.profilePic,
            stories: [],
          };
        }
        acc[story.userId].stories.push(story);
        return acc;
      }, {})
    );
    setGroupedStories(grouped);
  }, [stories]);

  const myStories = stories.filter((s) => s.userId === user?.uid);

  return (
    <div className="statusList">
      <div className="row">
        <div className="heading">
          <h2>Status</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current.click();
            }}
          >
            <PlusBtn className="icon" />
          </button>
        </div>
        <div className="content">
          <div
            className="statusShareContainer"
            onClick={(e) => {
              if (myStories.length > 0) {
                handleStoryClick(user?.uid);
              } else {
                fileInputRef.current.click();
                e.stopPropagation();
              }
            }}
          >
            <div
              className={`profileImg ${myStories.length > 0 ? "hasStory" : ""}`}
            >
              <img
                src={user?.profilePic || DefaultProfilePhoto}
                alt="Profile"
              />
              {myStories.length < 0 && (
                <button className="addBtn">
                  <AddBtn />
                </button>
              )}
            </div>
            <div className="details">
              <h3>My status</h3>
              {myStories.length < 0 ? (
                <p>Click to add status update</p>
              ) : (
                <p>
                  {myStories.length > 0 &&
                    formatStoryTime(myStories[myStories.length - 1].createdAt)}
                </p>
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*,video/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="statusContainer">
            <div className="title">
              <h2>recent</h2>
            </div>
            <div className="stories">
              <ul className="storyList">
                {groupedStories
                  .filter((group) => group.userId !== user?.uid)
                  .map((group) => {
                    const latestStory = group.stories.reduce((a, b) =>
                      new Date(a.createdAt) > new Date(b.createdAt) ? a : b
                    );

                    return (
                      <li
                        className="storyItem"
                        key={group.userId}
                        onClick={() => handleStoryClick(group.userId)}
                      >
                        <div className="img">
                          <img
                            src={group.profilePic || DefaultProfilePhoto}
                            alt={group.username}
                            className={`profileImg ${
                              myStories.length > 0 ? "hasStory" : ""
                            }`}
                          />
                        </div>
                        <div className="details">
                          <h3>{group.username}</h3>
                          <p>{formatStoryTime(latestStory.createdAt)}</p>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {viewerStories && (
        <StoryViewer
          stories={viewerStories}
          onClose={() => setViewerStories(null)}
        />
      )}
    </div>
  );
};

export default StatusList;

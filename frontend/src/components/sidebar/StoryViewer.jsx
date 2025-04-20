import React, { useState } from "react";
import Stories from "react-insta-stories";
import formatStoryTime from "../../utils/formatStoryTime";
import MoreIcon from "../../assets/media/icons/more.svg?react";
import { useSelector } from "react-redux";
import PopupModal from "../PopupModal";

const StoryViewer = ({ stories, onClose, handleDeleteStory }) => {
  const { user } = useSelector((state) => state.user);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const formattedStories = stories.map((story) => ({
    url: story.mediaUrl,
    type: story.type === "video" ? "video" : "image",
    header: {
      heading: story.username,
      subheading: formatStoryTime(story.createdAt),
    },
  }));

  const openDeletePopup = () => {
    setShowDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
  };

  const currentStory =
    stories && currentIndex >= 0 && currentIndex < stories.length
      ? stories[currentIndex]
      : null;

  return (
    <div className="storyViewerOverlay">
      <div className="storyContainer">
        <Stories
          stories={formattedStories}
          defaultInterval={5000}
          width="100%"
          height="100vh"
          onAllStoriesEnd={onClose}
          onStoryStart={(s, i) => {
            if (i >= 0 && i < stories.length) {
              setCurrentIndex(i);
            }
          }}
        />
        {currentStory && user.uid === currentStory.userId && (
          <>
            <button className="moreBtn">
              <MoreIcon />
            </button>
            <div className="dropdown">
              <button
                className="deleteBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeletePopup();
                }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
      <PopupModal
        title="Delete 1 status update"
        confirmBtnText="Delete"
        isOpen={showDeletePopup}
        onConfirm={() => {
          if (currentStory) handleDeleteStory(currentStory._id);
          closeDeletePopup();
        }}
        onCancel={closeDeletePopup}
      >
        <p>
          Delete this status update? It will also be deleted for everyone who
          received it.
        </p>
      </PopupModal>
    </div>
  );
};

export default StoryViewer;

import React from "react";
import Stories from "react-insta-stories";
import formatStoryTime from "../../utils/formatStoryTime";
import MoreIcon from "../../assets/media/icons/more.svg?react";
import { useSelector } from "react-redux";

const StoryViewer = ({ stories, onClose, handleDeleteStory }) => {
  const { user } = useSelector((state) => state.user);

  const formattedStories = stories.map((story) => ({
    url: story.mediaUrl,
    type: story.type === "video" ? "video" : "image",
    header: {
      heading: story.username,
      subheading: formatStoryTime(story.createdAt),
    },
  }));
  return (
    <div className="storyViewerOverlay">
      <div className="storyContainer">
        <Stories
          stories={formattedStories}
          defaultInterval={5000}
          width="100%"
          height="100vh"
          onAllStoriesEnd={onClose}
        />
        {user.uid === stories[0].userId && (
          <>
            <button className="moreBtn">
              <MoreIcon />
            </button>
            <div className="dropdown">
              <button
                className="deleteBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStory(stories[0]._id);
                }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;

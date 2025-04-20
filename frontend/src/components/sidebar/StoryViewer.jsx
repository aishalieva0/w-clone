import React from "react";
import Stories from "react-insta-stories";
import formatStoryTime from "../../utils/formatStoryTime";

const StoryViewer = ({ stories, onClose }) => {
  const formattedStories = stories.map((story) => ({
    url: story.mediaUrl,
    type: story.type === "video" ? "video" : "image",
    header: {
      heading: story.username || "Unknown",
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
      </div>
    </div>
  );
};

export default StoryViewer;

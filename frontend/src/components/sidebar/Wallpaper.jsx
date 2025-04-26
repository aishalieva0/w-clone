import React from "react";
import BackArrowBtn from "../../assets/media/icons/backArrow.svg?react";
import { setActiveTab } from "../../redux/slices/sidebarSlice";
import {
  clearPreviewWallpaper,
  setPreviewWallpaper,
  setWallpaper,
} from "../../redux/slices/wallpaperSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import notifyToast from "../../utils/toastifyMsg";
const Wallpaper = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const wallpaper = useSelector((state) => state.wallpaper.image);

  const wallpapers = [
    "/wallpapers/default.jpeg",
    "/wallpapers/w1.jpg",
    "/wallpapers/w2.jpeg",
    "/wallpapers/w3.jpeg",
    "/wallpapers/w4.jpeg",
    "/wallpapers/w5.jpeg",
    "/wallpapers/w6.jpeg",
    "/wallpapers/w7.jpeg",
    "/wallpapers/w8.jpeg",
    "/wallpapers/w9.jpeg",
  ];

  const handleBackClick = () => {
    dispatch(setActiveTab("settingTab"));
    dispatch(clearPreviewWallpaper(null));
  };

  const saveWallpaper = async (img) => {
    if (!user || !user.uid) return;

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/wallpaper`, {
        uid: user.uid,
        wallpaper: img,
      });

      dispatch(setWallpaper(img));
      dispatch(setPreviewWallpaper(img));
      notifyToast("Wallpaper set", "success");
    } catch (err) {
      console.error("Failed to save wallpaper:", err);
    }
  };

  return (
    <div className="wallpaper">
      <div className="header">
        <button className="backBtn" onClick={handleBackClick}>
          <BackArrowBtn className="icon" />
        </button>
        <span>Set chat wallpaper</span>
      </div>
      <div className="content">
        <div className="container">
          <div className="row">
            {wallpapers.map((img) => (
              <div
                className={`item ${img == wallpaper ? "borderActive" : ""}`}
                key={img}
              >
                <img
                  src={img}
                  alt="Wallpaper"
                  onClick={() => saveWallpaper(img)}
                  className="wallpaperThumbnail"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallpaper;

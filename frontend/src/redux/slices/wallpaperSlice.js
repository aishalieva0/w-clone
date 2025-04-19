import { createSlice } from "@reduxjs/toolkit";

const wallpaperSlice = createSlice({
    name: "wallpaper",
    initialState: {
        image: "",
        preview: null,
    },
    reducers: {
        setWallpaper: (state, action) => {
            state.image = action.payload;
        },
        setPreviewWallpaper: (state, action) => {
            state.preview = action.payload;
        },
        clearPreviewWallpaper: (state) => {
            state.preview = null;
        },
    },
});

export const {
    setWallpaper,
    setPreviewWallpaper,
    clearPreviewWallpaper,
} = wallpaperSlice.actions;
export default wallpaperSlice.reducer;

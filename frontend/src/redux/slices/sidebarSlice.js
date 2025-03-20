import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeTab: "chatsTab",
};

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
});

export const { setActiveTab } = sidebarSlice.actions;
export default sidebarSlice.reducer;

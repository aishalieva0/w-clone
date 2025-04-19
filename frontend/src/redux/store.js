import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import chatReducer from "./slices/chatSlice";
import sidebarReducer from "./slices/sidebarSlice";
import emojiReducer from "./slices/emojiSlice";
import themeReducer from "./slices/themeSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
        sidebar: sidebarReducer,
        emoji: emojiReducer,
        theme: themeReducer,
    },
});

export default store;
export { store };

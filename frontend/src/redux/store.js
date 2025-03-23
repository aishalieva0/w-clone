import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import chatReducer from "./slices/chatSlice";
import sidebarReducer from "./slices/sidebarSlice";
import emojiReducer from "./slices/emojiSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
        sidebar: sidebarReducer,
        emoji: emojiReducer,
    },
});

export default store;
export { store };

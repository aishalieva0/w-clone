import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import chatReducer from "./slices/chatSlice";
import sidebarReducer from "./slices/sidebarSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
        sidebar: sidebarReducer,
    },
});

export default store;
export { store };

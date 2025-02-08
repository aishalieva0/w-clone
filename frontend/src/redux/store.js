import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
// import chatReducer from "./slices/chatSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        // chat: chatReducer,
    },
});

export default store;

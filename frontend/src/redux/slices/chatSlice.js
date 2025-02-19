import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    activeChat: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
    },
});

export const { addMessage, setMessages, setActiveChat } = chatSlice.actions;
export default chatSlice.reducer;

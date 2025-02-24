import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    activeChat: null,
    lastUpdated: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addMessage: (state, action) => {
            if (!Array.isArray(state.messages)) {
                state.messages = [];
            }
            state.messages.push(action.payload);
        },
        setMessages: (state, action) => {
            state.messages = Array.isArray(action.payload) ? [...action.payload].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) : [];
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
        updateMessageStatus: (state, action) => {

            if (!Array.isArray(state.messages)) {
                state.messages = [];
            }

            const { sender, receiver, status } = action.payload;

            state.messages = state.messages.map((msg) =>
                msg.sender === sender && msg.receiver === receiver && msg.status !== "read"
                    ? { ...msg, status: status || "read" }
                    : msg
            );


            state.lastUpdated = Date.now();
        },
    },
});

export const { addMessage, setMessages, setActiveChat, updateMessageStatus } = chatSlice.actions;
export default chatSlice.reducer;

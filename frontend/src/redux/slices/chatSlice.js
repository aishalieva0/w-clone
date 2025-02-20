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
        updateMessageStatus: (state, action) => {
            const updatedMessage = action.payload;
            if (state.messages[updatedMessage.receiver]) {
                state.messages[updatedMessage.receiver] = state.messages[
                    updatedMessage.receiver
                ].map((msg) =>
                    msg.message === updatedMessage.message &&
                        msg.sender === updatedMessage.sender
                        ? { ...msg, status: updatedMessage.status }
                        : msg
                );
            }
        },
    },
});

export const { addMessage, setMessages, setActiveChat, updateMessageStatus } = chatSlice.actions;
export default chatSlice.reducer;

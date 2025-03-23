import { createSlice } from "@reduxjs/toolkit";

const emojiSlice = createSlice({
    name: "emoji",
    initialState: {
        isOpen: false,
        targetInput: null,
        selectedEmoji: null,
        position: { top: 0, left: 0 },
    },
    reducers: {
        openEmojiPicker: (state, action) => {
            const { target, position } = action.payload;
            state.isOpen = state.targetInput === target ? !state.isOpen : true;
            state.targetInput = target;
            state.position = position;
        },
        setSelectedEmoji: (state, action) => {
            state.selectedEmoji = action.payload;
        },
        closeEmojiPicker: (state) => {
            state.isOpen = false;
            state.targetInput = null;
            state.position = { top: 0, left: 0 };
        },
    },
});

export const { openEmojiPicker, setSelectedEmoji, closeEmojiPicker } = emojiSlice.actions;
export default emojiSlice.reducer;
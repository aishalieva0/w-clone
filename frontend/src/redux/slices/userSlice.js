import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    authReady: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            console.log("🔄 setUser called with:", action.payload);
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
            state.authReady = true;
        },
        logout: (state) => {
            console.log("🚪 User logged out");
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.authReady = true;
        },
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;

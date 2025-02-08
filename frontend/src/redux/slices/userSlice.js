import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../../firebase/firebaseConfig";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setUser, logout, setLoading } = userSlice.actions;

export const checkAuthStatus = () => async (dispatch) => {
    dispatch(setLoading(true));
    auth.onAuthStateChanged((user) => {
        if (user) {
            dispatch(setUser(user));
        } else {
            dispatch(logout());
        }
    });
};
export default userSlice.reducer;

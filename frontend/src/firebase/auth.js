import { auth } from "./firebaseConfig";
import { setUser, logout } from "../redux/slices/userSlice";

export const listenForAuthChanges = (dispatch) => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            dispatch(setUser({ uid: user.uid, email: user.email }));
        } else {
            dispatch(logout());
        }
    });
};

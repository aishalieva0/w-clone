import { auth } from "./firebaseConfig";
import { setUser, logout } from "../redux/slices/userSlice";
import axios from "axios";

export const listenForAuthChanges = (dispatch) => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            dispatch(setUser({ uid: user.uid, email: user.email }));
        } else {
            dispatch(logout());
        }
    });
};

export const fetchUserData = async (uid, dispatch) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${uid}`);
        dispatch(setUser(res.data));
    } catch (error) {
        console.error("Error fetching user data", error);
    }
};

export const handleLogin = async (dispatch) => {
    console.log("👀 Waiting for Firebase auth...");
    auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
            console.log("✅ Firebase user detected:", firebaseUser.uid);
            await fetchUserData(firebaseUser.uid, dispatch);
        } else {
            console.log("❌ No Firebase user found.");
            dispatch(setUser(null));
        }
    });
};

export const logOutUser = (dispatch) => {
    auth
        .signOut()
        .then(() => {
            dispatch(logout());
        })
        .catch((error) => {
            console.error("Error logging out: ", error);
        });
};

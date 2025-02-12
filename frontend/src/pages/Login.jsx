import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import { setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import notifyToast from "../utils/toastifyMsg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = localStorage.getItem("emailForSignIn");

      if (!storedEmail) {
        navigate("/register");
      }

      signInWithEmailLink(auth, storedEmail, window.location.href)
        .then((result) => {
          localStorage.removeItem("emailForSignIn");
          dispatch(setUser({ email: result.user.email, uid: result.user.uid }));
          navigate("/chat");
        })
        .catch((error) => {
          console.error("Error verifying email link:", error);
          notifyToast(error.message, "error");
        });
    }
  }, [dispatch, navigate]);

  return null;
};

export default Login;

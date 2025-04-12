import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import { setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import notifyToast from "../utils/toastifyMsg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
      return;
    }

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = localStorage.getItem("emailForSignIn");
      if (!storedEmail || !window.location.href.includes("signIn")) {
        navigate("/register");
        return;
      }
      if (!auth.currentUser) {
        signInWithEmailLink(auth, storedEmail, window.location.href)
          .then(async (result) => {
            const user = {
              email: result.user.email,
              uid: result.user.uid,
            };

            try {
              const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/users/${user.uid}`
              );

              if (response.data.name) {
                dispatch(setUser(response.data));
                navigate("/chat");
              } else {
                setUserData(user);
              }
            } catch (error) {
              setUserData(user);
            }
          })
          .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
              console.warn("User is already signed in.");
            } else {
              console.error("Error verifying email link:", error);
            }
          });
      }
    }
  }, [dispatch, navigate]);

  const saveUserName = async () => {
    if (!name.trim()) {
      notifyToast("Please enter your name.", "error");
      return;
    }
    console.log("saveUserName");
    setLoading(true);
    try {
      console.log("----user saved to db");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users`,
        {
          ...userData,
          name,
        }
      );

      dispatch(setUser(response.data));
      navigate("/chat");
    } catch (error) {
      console.error("Error saving user:", error);
      notifyToast("Failed to save name. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="container">
        <div className="row">
          {userData && !loading && (
            <div className="content">
              <h4>Enter your name to continue</h4>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <button onClick={saveUserName} disabled={loading}>
                {loading ? <span className="spinner"></span> : "Continue"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

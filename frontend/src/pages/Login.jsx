import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import { setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = localStorage.getItem("emailForSignIn");

      if (!storedEmail) {
        storedEmail = prompt("Please enter your email:");
      }

      signInWithEmailLink(auth, storedEmail, window.location.href)
        .then((result) => {
          localStorage.removeItem("emailForSignIn");
          dispatch(setUser({ email: result.user.email, uid: result.user.uid }));
          navigate("/chat"); // Redirect to chat page
        })
        .catch((error) => {
          console.error("Error verifying email link:", error);
          alert(error.message);
        });
    }
  }, [dispatch, navigate]);

  return (
    <div>
      <h2>Login</h2>
      <p>Check your email and click the verification link to log in.</p>
    </div>
  );
};

export default Login;

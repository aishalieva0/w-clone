import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { sendSignInLinkToEmail } from "firebase/auth";
import notifyToast from "../utils/toastifyMsg";

const Register = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendEmailLink = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      notifyToast("Please enter a valid email address.", "error");
      return;
    }

    const actionCodeSettings = {
      url: "http://localhost:3000/login",
      handleCodeInApp: true,
    };

    try {
      setLoading(true);
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem("emailForSignIn", email);
      notifyToast("Verification link sent to your email.", "success");
      setEmail("");
    } catch (error) {
      console.error("Error sending email link:", error);
      notifyToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="container">
        <div className="row">
          <div className="content">
            <h4>Enter your email</h4>
            <p>We'll send you a login link to access WhatsApp.</p>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button onClick={sendEmailLink} disabled={loading}>
              {loading ? <span className="spinner"></span> : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

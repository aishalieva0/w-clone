import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { sendSignInLinkToEmail } from "firebase/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendEmailLink = async () => {
    if (!email) {
      alert("Please enter your email.");
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
      alert("Verification link sent to your email.");
    } catch (error) {
      console.error("Error sending email link:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendEmailLink} disabled={loading}>
        {loading ? "Sending..." : "Send Verification Link"}
      </button>
    </div>
  );
};

export default Register;

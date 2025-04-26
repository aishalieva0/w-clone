import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import AnimationWelcomeDoodle from "../assets/media/animation/AnimationWelcomeDoodle.json";
import { useSelector } from "react-redux";
const Welcome = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="welcome">
      <div className="container">
        <div className="row">
          <Lottie
            animationData={AnimationWelcomeDoodle}
            loop={true}
            className="doodle-animation"
          />
          <div className="details">
            <h1>Welcome to WhatsApp</h1>
            <p>
              Connect with friends and family, share messages, and stay in touch
              anytime, anywhere.
            </p>
            <Link className="getStartedBtn" to={"./register"}>
              Get started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

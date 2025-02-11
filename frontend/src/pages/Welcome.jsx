import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import AnimationWelcomeDoodle from "../assets/media/AnimationWelcomeDoodle.json";
const Welcome = () => {
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

import React from "react";
import { Link } from "react-router-dom";
const Welcome = () => {
  return (
    <div>
      <p>welocme</p>
      <Link to={"./register"}>lets start</Link>
    </div>
  );
};

export default Welcome;

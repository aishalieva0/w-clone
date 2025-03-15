import React from "react";
import CameraIcon from "../../assets/media/icons/camera.svg?react";

const Profile = () => {
  return (
    <div className="profile">
      <div className="container">
        <div className="row">
          <div className="heading">
            <h2>Profile</h2>
          </div>
          <div className="profileContent">
            <div className="profileImgContainer">
              <div className="profileImg">
                <img src="https://example.com/image.jpg" alt="Profile Image" />
              </div>
              <div className="editImg">
                <CameraIcon className="icon" />
                <span>Change Profile Photo</span>
              </div>
              <ul className="optionList">
                <li className="optionItem"></li>
                <li className="optionItem"></li>
                <li className="optionItem"></li>
                <li className="optionItem"></li>
              </ul>
            </div>
            <div className="profileInfo">
              <div className="name">
                <h3>John Doe</h3>
              </div>
              <div className="about">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

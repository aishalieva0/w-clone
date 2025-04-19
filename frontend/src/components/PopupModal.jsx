import React, { useEffect, useState } from "react";

const PopupModal = ({
  isOpen,
  title,
  children,
  confirmBtnText,
  onConfirm,
  onCancel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onCancel();
      onConfirm();
    }, 300);
  };

  if (!isOpen && !showModal) return null;

  return (
    <div className="popupOverlay">
      <div className={`popupModal ${showModal ? "opened" : "closed"}`}>
        <div className="container">
          <div className="row">
            <div className="header">
              <h2>{title}</h2>
            </div>
            <div className="content">{children}</div>
            <div className="footer">
              <div className="btnGroup">
                <button className="cancelBtn" onClick={handleClose}>
                  Cancel
                </button>
                <button className="confirmBtn" type="button" onClick={handleClose}>
                  {confirmBtnText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;

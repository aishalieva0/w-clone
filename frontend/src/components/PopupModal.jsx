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

  const handleConfirm = () => {
    setShowModal(false);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  const handleCancel = () => {
    setShowModal(false);
    setTimeout(() => {
      onCancel();
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
            <div className="popupContent">{children}</div>
            <div className="footer">
              <div className="btnGroup">
                <button className="cancelBtn" onClick={handleCancel}>
                  Cancel
                </button>
                <button
                  className="confirmBtn"
                  type="button"
                  onClick={handleConfirm}
                >
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

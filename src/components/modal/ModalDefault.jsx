import React from "react";
import "./css/ModalDefault.css";

const ModalDefault = ({ closeModal, children }) => {
  console.log("ModalDefault received closeModal prop:", closeModal);

  return (
    <div className="modalDefaultContainer">
      <div className="modalDefaultBackgroundBlur"></div>
      <div className="modalDefaultContent">
        <div className="modalHeader">
          <div className="spacer"></div>
          <button
            className="closeButton"
            onClick={() => closeModal(false)}
          >
            X
          </button>
        </div>
        <div className="modalBody">
          <div className="modalBodyContainer">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDefault;
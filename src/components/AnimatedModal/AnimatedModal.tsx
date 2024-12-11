import React, { useState } from "react";
import "./AnimatedModal.css";

interface AnimatedModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({ isVisible, onClose, children }) => {
  return (
    <div className={`modal-backdrop ${isVisible ? "visible" : "hidden"}`} onClick={onClose}>
      <div className={`modal-content ${isVisible ? "fade-in" : "fade-out"}`} onClick={(e) => e.stopPropagation()}>
        {children}
        {/* <button className="close-button" onClick={onClose}>
          Close
        </button> */}
      </div>
    </div>
  );
};

export default AnimatedModal;

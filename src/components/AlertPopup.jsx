import React from "react";

const AlertPopup = ({ area }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        backgroundColor: "red",
        color: "white",
        padding: 15,
        borderRadius: 10,
        zIndex: 1000,
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      }}
    >
      🚨 High Noise Alert in {area}!
    </div>
  );
};

export default AlertPopup;

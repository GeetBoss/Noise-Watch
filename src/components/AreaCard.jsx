import React from "react";

const AreaCard = ({ area, noise }) => {
  const isDanger = noise > 80;
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
        backgroundColor: isDanger ? "#ffcccc" : "#ccffcc",
      }}
    >
      <h2>{area}</h2>
      <p>
        <strong>Noise Level:</strong> {noise} dB
      </p>
      {isDanger && <p style={{ color: "red" }}>⚠️ High Noise Alert!</p>}
    </div>
  );
};

export default AreaCard;

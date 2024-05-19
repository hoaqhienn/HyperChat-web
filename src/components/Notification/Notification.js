import React from 'react';

const Notification = ({ message }) => (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "30%",
      transform: "translate(-50%, -50%)",
      border: "none",
      padding: "20px",
      zIndex: 100,
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    }}
  >
    <p>{message.notification}</p>
  </div>
);
export default Notification;
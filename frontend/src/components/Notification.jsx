import React from "react";
import { useNotification } from "../context/NotificationContext";

export default function Notification() {
  const { notification, hideNotification } = useNotification();

  if (!notification.show) return null;

  const color = {
    success: "success",
    error: "danger",
    warning: "warning",
    info: "info",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "20px",
        zIndex: 9999,
        minWidth: "320px",
      }}
    >
      <div
        className={`alert alert-${color[notification.type]} alert-dismissible shadow`}
      >
        {notification.message}

        <button
          type="button"
          className="btn-close"
          onClick={hideNotification}
        ></button>
      </div>
    </div>
  );
}
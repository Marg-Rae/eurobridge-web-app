import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const AuthDebug = () => {
  const auth = useAuth();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        background: "#000",
        color: "#0f0",
        padding: "10px",
        borderRadius: "4px",
        fontSize: "12px",
        fontFamily: "monospace",
        maxWidth: "300px",
        maxHeight: "200px",
        overflow: "auto",
        zIndex: 9999,
      }}
    >
      <div>
        <strong>Auth Debug:</strong>
      </div>
      <div>loading: {String(auth.loading)}</div>
      <div>token: {auth.token ? "✓" : "✗"}</div>
      <div>user: {auth.user ? "✓" : "✗"} {auth.user?.name}</div>
      <div>role: {auth.user?.role || "none"}</div>
      <div>isAuthenticated: {String(auth.isAuthenticated)}</div>
      <div style={{ marginTop: "5px", fontSize: "11px", opacity: 0.7 }}>
        localStorage token: {localStorage.getItem("token") ? "✓" : "✗"}
      </div>
    </div>
  );
};

export default AuthDebug;

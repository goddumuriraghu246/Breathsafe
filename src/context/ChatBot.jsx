import React from "react"

const ChatBot = () => {
  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 9999,
        width: "100%",
        maxWidth: 400,
        minWidth: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <Chat
        projectID="68202d1c6c9c534714a6b660"
        versionID="production"
        url="https://general-runtime.voiceflow.com"
        voice={{ url: "https://runtime-api.voiceflow.com" }}
      />
    </div>
  );
};

export default ChatBot;

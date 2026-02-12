import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to socket.io server
    const socketUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const newSocket = io(socketUrl);

    newSocket.on("connect", () => {
      setConnectionStatus("connected");
    });

    newSocket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    newSocket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageInput.trim() || !socket) {
      return;
    }

    const message = {
      text: messageInput,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    socket.emit("sendMessage", message);
    setMessageInput("");
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <section className="chat-container">
      <div className="chat-header">
        <h2>Live Chat</h2>
        <div className={`connection-status ${connectionStatus}`}>
          {connectionStatus === "connected" && <span className="status-dot connected" />}
          {connectionStatus === "disconnected" && <span className="status-dot disconnected" />}
          {connectionStatus === "connecting" && <span className="status-dot connecting" />}
          <span>{connectionStatus}</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="message">
              <div className="message-content">
                <p>{message.text}</p>
              </div>
              <div className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={messageInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={connectionStatus !== "connected"}
        />
        <button
          type="submit"
          className="button primary"
          disabled={!messageInput.trim() || connectionStatus !== "connected"}
        >
          Send
        </button>
      </form>
    </section>
  );
};

export default Chat;

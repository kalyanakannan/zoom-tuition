// Dynamically determine the WebSocket URL
const websocketURL =
  window.location.hostname === "localhost"
    ? process.env.REACT_APP_WEBSOCKET_URL_LOCAL || "ws://localhost:8000/ws/ai-chat/"
    : process.env.REACT_APP_WEBSOCKET_URL_PRODUCTION || "wss://your-production-domain/ws/ai-chat/";

class WebSocketService {
  constructor() {
    this.socket = null;
    this.messageHandlers = [];
  }

  connect() {
    this.socket = new WebSocket(websocketURL);

    this.socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageHandlers.forEach((handler) => handler(data));
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ message }));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  addMessageHandler(handler) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

// Export a singleton instance
const WebSocketInstance = new WebSocketService();
export default WebSocketInstance;

// Dynamically determine the WebSocket URL
const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const websocketURL =
  protocol + "://" +
  window.location.hostname +
  (window.location.port ? ":" + window.location.port : "") +
  "/ws/ai-chat/";

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

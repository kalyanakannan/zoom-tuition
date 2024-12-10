import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // Import KaTeX CSS for LaTeX rendering

const AIChat = ({ peerId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket("ws://localhost:8000/ws/ai-chat/");
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, { sender: data.sender || "AI", text: data.message }]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && socket) {
      // Send message to WebSocket server
      socket.send(JSON.stringify({ message }));
      setMessages((prev) => [...prev, { sender: "Me", text: message }]);
      setMessage(""); // Clear input
    }
  };

  return (
    <div className="w-1/3 bg-purple-800 p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Chat with AI</h3>
      <div className="flex-1 overflow-y-auto bg-purple-700 rounded p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="text-white">
            <strong>{msg.sender}:</strong>
            <ReactMarkdown
              children={msg.text}
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              className="prose prose-invert" // Tailwind for better styling
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          placeholder="Ask the AI Assistant"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 rounded border border-purple-600 bg-purple-700 text-white"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-green-600 rounded hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;

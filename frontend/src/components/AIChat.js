import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // Import KaTeX CSS for LaTeX rendering
import WebSocketService from "../api/websocket";

const AIChat = ({ peerId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to WebSocket
    WebSocketService.connect();

    // Handle incoming messages
    const handleMessage = (data) => {
      setMessages((prev) => [...prev, { sender: data.sender || "AI", text: data.message }]);
    };

    WebSocketService.addMessageHandler(handleMessage);

    return () => {
      WebSocketService.removeMessageHandler(handleMessage);
      WebSocketService.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      WebSocketService.sendMessage(message);
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

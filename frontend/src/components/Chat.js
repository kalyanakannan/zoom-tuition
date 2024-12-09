import React, { useEffect, useState } from "react";

const Chat = ({ peerId, messages, sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message); // Use the sendMessage function from usePeerConnection
      setMessage(""); // Clear the input
    }
  };

  return (
    <div className="w-1/3 bg-gray-800 p-4 flex flex-col">
      {/* Peer ID */}
      <div className="">
        <h3>Your Peer ID: {peerId}</h3>
      </div>
      <h3 className="text-lg font-semibold mb-2">Chat</h3>
      <div className="flex-1 overflow-y-auto bg-gray-700 rounded p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="text-white">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 rounded border border-gray-600 bg-gray-700 text-white"
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

export default Chat;

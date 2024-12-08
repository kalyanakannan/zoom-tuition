import React, { useState } from "react";

const Chat = ({ peerId, meetingId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { sender: peerId, text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="w-1/3 bg-gray-800 text-white flex flex-col">
      <h2 className="text-xl font-bold p-4">Chat</h2>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              message.sender === peerId
                ? "bg-blue-500 text-white text-right"
                : "bg-gray-700 text-white"
            }`}
          >
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex p-4">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 rounded-l bg-gray-700 text-white"
        />
        <button
          type="submit"
          className="bg-blue-500 px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

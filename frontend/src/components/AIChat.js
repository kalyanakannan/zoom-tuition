import React from "react";

const AIChat = ({ peerId }) => {
  return (
    <div className="w-1/3 bg-purple-800 p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Chat with AI</h3>
      <div className="flex-1 overflow-y-auto bg-purple-700 rounded p-4 space-y-2">
        {/* AI Chat messages will go here */}
      </div>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          placeholder="Ask the AI Assistant"
          className="flex-grow p-2 rounded border border-purple-600 bg-purple-700 text-white"
        />
        <button className="ml-2 p-2 bg-green-600 rounded hover:bg-green-700">
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;

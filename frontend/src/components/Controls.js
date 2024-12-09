import React from "react";
import { MdVideocam, MdVideocamOff, MdMic, MdMicOff, MdCallEnd } from "react-icons/md";

const Controls = ({ isVideoEnabled, isAudioEnabled, toggleTrack, leaveMeeting }) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
      {/* Video Toggle Button */}
      <button
        onClick={() => toggleTrack("video")}
        className={`p-4 rounded-full flex justify-center items-center ${
          isVideoEnabled ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 hover:bg-gray-600"
        }`}
      >
        {isVideoEnabled ? (
          <MdVideocam size={24} className="text-white" />
        ) : (
          <MdVideocamOff size={24} className="text-white" />
        )}
      </button>

      {/* Audio Toggle Button */}
      <button
        onClick={() => toggleTrack("audio")}
        className={`p-4 rounded-full flex justify-center items-center ${
          isAudioEnabled ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600"
        }`}
      >
        {isAudioEnabled ? (
          <MdMic size={24} className="text-white" />
        ) : (
          <MdMicOff size={24} className="text-white" />
        )}
      </button>

      {/* Leave Meeting Button */}
      <button
        onClick={leaveMeeting}
        className="p-4 rounded-full flex justify-center items-center bg-red-700 hover:bg-red-800"
      >
        <MdCallEnd size={24} className="text-white" />
      </button>
    </div>
  );
};

export default Controls;

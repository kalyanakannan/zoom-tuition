import React from "react";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

const Controls = ({ isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo }) => (
  <div className="bg-gray-800 p-4 flex justify-around items-center">
    {/* Video Control */}
    <button
      onClick={toggleVideo}
      className={`p-4 rounded-full ${
        isVideoEnabled ? "bg-green-500" : "bg-red-500"
      } hover:opacity-80`}
      title={isVideoEnabled ? "Disable Video" : "Enable Video"}
    >
      {isVideoEnabled ? (
        <MdVideocam size={24} className="text-white" />
      ) : (
        <MdVideocamOff size={24} className="text-white" />
      )}
    </button>

    {/* Audio Control */}
    <button
      onClick={toggleAudio}
      className={`p-4 rounded-full ${
        isAudioEnabled ? "bg-green-500" : "bg-red-500"
      } hover:opacity-80`}
      title={isAudioEnabled ? "Disable Audio" : "Enable Audio"}
    >
      {isAudioEnabled ? (
        <MdMic size={24} className="text-white" />
      ) : (
        <MdMicOff size={24} className="text-white" />
      )}
    </button>
  </div>
);

export default Controls;

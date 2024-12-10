import React, { useEffect, useState  } from "react";
import { usePeerConnection } from "../hooks/usePeerConnection";
import Controls from "../components/Controls";
import { useNavigate, useParams } from "react-router-dom";
import { joinMeetingAPI } from "../api/api";
import Chat from "../components/Chat";
import AIChat from "../components/AIChat";

const MeetingRoom = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const userId = localStorage.getItem("userId");

  const {
    peerId,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    localVideoRef,
    remoteVideoRef,
    callPeer,
    toggleTrack,
    leaveMeeting,
    messages, // Add messages
    sendMessage, // Add sendMessage
  } = usePeerConnection(userId);

  const [selectedOption, setSelectedOption] = useState("chat");

  useEffect(() => {
    const joinMeeting = async () => {
      try {
        const response = await joinMeetingAPI(meetingId, { userId });
        console.log("Joined meeting successfully:", response.data);
      } catch (error) {
        console.error("Error joining meeting:", error);
        navigate("/login");
      }
    };

    joinMeeting();
  }, [meetingId, userId, navigate]);

  const navigateToEnd = () => {
    navigate("/meeting-end"); // Redirect to meeting end page
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* Video Section */}
      <div className="flex-1 relative bg-black">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-20 right-4 w-32 h-32 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* Meeting Controls */}
        <Controls
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
          toggleTrack={toggleTrack}
          leaveMeeting={navigateToEnd} // Pass navigation function
          onChat={() => setSelectedOption("chat")}
          onChatWithAI={() => setSelectedOption("aiChat")}
        />

        {/* Peer ID Input */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Enter Peer ID"
              id="peer-id-input"
              className="p-2 rounded border border-gray-600 bg-gray-800 text-white w-48"
            />
            <button
              onClick={() => {
                const otherPeerId =
                  document.getElementById("peer-id-input").value;
                callPeer(otherPeerId);
              }}
              className="ml-2 p-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Call
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Rendering for Chat or AI Chat */}
      {selectedOption === "chat" && (
        <Chat peerId={userId} messages={messages} sendMessage={sendMessage} />
      )}
      {selectedOption === "aiChat" && <AIChat peerId={userId} />}
    </div>
  );
};

export default MeetingRoom;

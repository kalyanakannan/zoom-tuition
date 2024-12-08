import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import Video from "../components/Video";
import Controls from "../components/Controls";
import Chat from "../components/Chat";

const MeetingRoom = ({ meetingId }) => {
  const [peerId, setPeerId] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState(null); // Remote user's Peer ID
  const [userName, setUserName] = useState("You"); // Default to "You" for local user
  const [remoteUserName, setRemoteUserName] = useState("Guest"); // Default to "Guest" for remote user
  const [callActive, setCallActive] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      console.log("Peer ID:", id);

      // Fetch the local user's name from a backend or session data
      fetchUserName(id);

      // Notify server or signaling mechanism about joining the meeting
      joinMeeting(meetingId, id);
    });

    peer.on("call", (call) => {
      call.answer(localStreamRef.current); // Answer the call with local stream
      setRemotePeerId(call.peer); // Save the remote user's Peer ID

      // Fetch the remote user's name based on their Peer ID
      fetchRemoteUserName(call.peer);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        setCallActive(true);
      });
    });

    return () => peer.destroy();
  }, []);

  const fetchUserName = async (id) => {
    const name = "Your Name"; // Fetch from backend
    setUserName(name);
  };

  const fetchRemoteUserName = async (id) => {
    const name = "Guest Name"; // Fetch from backend
    setRemoteUserName(name);
  };

  const joinMeeting = async (meetingId, peerId) => {
    console.log(`Joining meeting ${meetingId} with peer ID ${peerId}`);
    // Notify server about joining
  };

  // Centralized logic to initialize or reinitialize the media stream
  const getOrCreateStream = async (enableVideo = false, enableAudio = false) => {
    try {
      
        // Initialize the stream if not already created
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
          video: enableVideo,
          audio: enableAudio,
        });
        localVideoRef.current.srcObject = localStreamRef.current;
      return localStreamRef.current;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  };

  const toggleVideo = async () => {
    try {
      const stream = await getOrCreateStream(true, isAudioEnabled);
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    } catch (error) {
      console.error("Error toggling video:", error);
    }
  };

  const toggleAudio = async () => {
    try {
      const stream = await getOrCreateStream(isVideoEnabled, true);
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    } catch (error) {
      console.error("Error toggling audio:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Side: Video Section */}
      <div className="flex-1 flex flex-col">
        <div
          className={`flex-1 flex ${
            callActive ? "grid grid-cols-2 gap-4" : "justify-center items-center"
          } p-4`}
        >
          <Video
            streamRef={localVideoRef}
            isMuted={!isAudioEnabled}
            label={userName} // Use the user's name
          />
          {callActive && (
            <Video
              streamRef={remoteVideoRef}
              isMuted={false}
              label={remoteUserName} // Use the remote user's name
            />
          )}
        </div>
        {/* Bottom Controls */}
        <Controls
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
        />
      </div>

      {/* Right Side: Chat Section */}
      <Chat peerId={peerId} meetingId={meetingId} />
    </div>
  );
};

export default MeetingRoom;

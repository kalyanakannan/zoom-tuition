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
    // Fetch the user's name from a backend or session (replace with real logic)
    const name = "Your Name"; // Example: Replace with actual name
    setUserName(name);
  };

  const fetchRemoteUserName = async (id) => {
    // Fetch the remote user's name from a backend or session (replace with real logic)
    const name = "Guest Name"; // Example: Replace with actual name
    setRemoteUserName(name);
  };

  const joinMeeting = async (meetingId, peerId) => {
    console.log(`Joining meeting ${meetingId} with peer ID ${peerId}`);
    // Example: Implement server communication logic here.
  };

  const toggleVideo = async () => {
    try {
      if (!localStreamRef.current) {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: isAudioEnabled, // Maintain the current audio state
        });
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      } else {
        console.error("No video track found in the stream.");
      }
    } catch (error) {
      console.error("Error toggling video:", error);
    }
  };

  const toggleAudio = async () => {
    try {
      if (!localStreamRef.current) {
        // Initialize the media stream if it doesn't exist
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled, // Maintain the current video state
          audio: true,
        });
        localVideoRef.current.srcObject = localStreamRef.current; // Attach stream to video
      }
  
      // Get the audio track and toggle its enabled property
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      } else {
        console.warn("No audio track found. Reinitializing stream.");
        // Reinitialize the stream with audio
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled,
          audio: true,
        });
        const newAudioTrack = localStreamRef.current.getAudioTracks()[0];
        if (newAudioTrack) {
          newAudioTrack.enabled = true;
          setIsAudioEnabled(true);
          localVideoRef.current.srcObject = localStreamRef.current;
        }
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

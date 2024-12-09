import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import Video from "../components/Video";
import Controls from "../components/Controls";
import Chat from "../components/Chat";

const MeetingRoom = ({ meetingId }) => {
  const [peerId, setPeerId] = useState(null);
  const [participants, setParticipants] = useState([]); // Store participant data
  const [callActive, setCallActive] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const localVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      console.log("Peer ID:", id);

      // Notify server or signaling mechanism about joining the meeting
      joinMeeting(meetingId, id);
    });

    peer.on("call", (call) => {
      call.answer(localStreamRef.current); // Answer the call with local stream
      call.on("stream", (remoteStream) => {
        setParticipants((prev) => [
          ...prev,
          { peerId: call.peer, stream: remoteStream },
        ]);
        setCallActive(true);
      });
    });

    return () => peer.destroy();
  }, []);

  const joinMeeting = async (meetingId, peerId) => {
    console.log(`Joining meeting ${meetingId} with peer ID ${peerId}`);
    // Notify server about joining
  };

  const getOrCreateStream = async (enableVideo = false, enableAudio = false) => {
    try {
      localStreamRef.current =
        localStreamRef.current ||
        (await navigator.mediaDevices.getUserMedia({
          video: enableVideo,
          audio: enableAudio,
        }));
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
        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
          {/* Local Video */}
          <Video
            streamRef={localVideoRef}
            isMuted={!isAudioEnabled}
            label="You"
          />

          {/* Remote Participants */}
          {participants.map((participant) => (
            <Video
              key={participant.peerId}
              streamRef={{ current: new MediaStream(participant.stream) }}
              isMuted={false}
              label={`User ${participant.peerId}`} // Customize the label as needed
            />
          ))}
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

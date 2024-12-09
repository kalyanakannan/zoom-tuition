import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import Video from "../components/Video";
import Controls from "../components/Controls";
import Chat from "../components/Chat";
import { joinMeetingAPI } from "../api/api";
import { useParams, useLocation } from "react-router-dom";

const MeetingRoom = ({ meetingsId }) => {
  const [peerId, setPeerId] = useState(null);
  const [participants, setParticipants] = useState([]); 
  const [callActive, setCallActive] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const localVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const participantsRef = useRef(new Set()); // Track unique participants
  const location = useLocation();
  const { meetingId } = useParams();

  useEffect(() => {
    
    const query = new URLSearchParams(location.search);
    const guestName = query.get("guestName");
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", async (id) => {
      setPeerId(id);
      console.log("Peer ID:", id);
      console.log(meetingId)
      try {
        // Post peer ID and guest name to backend
        await joinMeetingAPI(meetingId, { guest_name: guestName, peer_id: id });
        console.log("Successfully joined the meeting.");
      } catch (error) {
        console.error("Failed to join the meeting:", error);
      }
      joinMeeting(meetingId, id);
    });

    peer.on("call", (call) => {
      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
        call.on("stream", (remoteStream) => {
          // Avoid adding duplicate participants
          if (!participantsRef.current.has(call.peer)) {
            setParticipants((prev) => [...prev, { 
              peerId: call.peer, 
              stream: remoteStream 
            }]);
            participantsRef.current.add(call.peer);
            setCallActive(true);
          }
        });
      }
    });

    return () => {
      peer.destroy();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [meetingId]);

  const joinMeeting = async (meetingId, peerId) => {
    try {
      // Get local stream first
      await getOrCreateStream(true, true);

      // Simulate other participants (in a real app, this would come from a signaling server)
      // For demonstration, we'll simulate a second participant
      const otherParticipantId = 'other-participant-id';
      
      if (peerRef.current && localStreamRef.current) {
        const call = peerRef.current.call(otherParticipantId, localStreamRef.current);
        
        call.on("stream", (remoteStream) => {
          if (!participantsRef.current.has(otherParticipantId)) {
            setParticipants((prev) => [...prev, { 
              peerId: otherParticipantId, 
              stream: remoteStream 
            }]);
            participantsRef.current.add(otherParticipantId);
            setCallActive(true);
          }
        });
      }
    } catch (error) {
      console.error("Error joining meeting:", error);
    }
  };

  const getOrCreateStream = async (enableVideo = false, enableAudio = false) => {
    try {
      if (!localStreamRef.current) {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
          video: enableVideo,
          audio: enableAudio,
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
        
        setIsVideoEnabled(enableVideo);
        setIsAudioEnabled(enableAudio);
      }
      return localStreamRef.current;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  };

  const toggleVideo = async () => {
    try {
      const stream = localStreamRef.current;
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
      const stream = localStreamRef.current;
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
      <div className="flex-1 flex flex-col">
        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
          {/* Local Video */}
          <Video
            streamRef={localVideoRef}
            isMuted={true}
            label="You"
          />

          {/* Remote Participants */}
          {participants.map((participant) => (
            <Video
              key={participant.peerId}
              streamRef={{ current: participant.stream }}
              isMuted={false}
              label={`User ${participant.peerId}`}
            />
          ))}
        </div>

        <Controls
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
        />
      </div>

      <Chat peerId={peerId} meetingId={meetingId} />
    </div>
  );
};

export default MeetingRoom;
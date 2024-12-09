import React, { useEffect, useRef, useState, useCallback } from "react";
import Peer from "peerjs";
import Video from "../components/Video";
import Controls from "../components/Controls";
import Chat from "../components/Chat";
import { joinMeetingAPI, fetchParticipants } from "../api/api";
import { useParams, useLocation } from "react-router-dom";

const MeetingRoom = () => {
  const [peerId, setPeerId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const localVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const participantsRef = useRef(new Set());
  const location = useLocation();
  const { meetingId } = useParams();

  const joinMeeting = useCallback(async (meetingId, peerId) => {
    try {
      await getOrCreateStream(true, true);
    } catch (error) {
      console.error("Error joining meeting:", error);
    }
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const guestName = query.get("guestName");
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", async (id) => {
      setPeerId(id);
      console.log("Peer ID:", id);
    
      try {
        // Initialize the stream first
        await getOrCreateStream(true, true);
        console.log("Local stream initialized.");
    
        // Register the participant
        await joinMeetingAPI(meetingId, { guest_name: guestName, peer_id: id });
        console.log("Successfully joined the meeting.");
    
        // Connect to existing participants
        connectToExistingParticipants();
      } catch (error) {
        console.error("Failed to initialize local stream or connect to participants:", error);
      }
    });
    

    peer.on("call", (call) => {
      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
        call.on("stream", (remoteStream) => {
          if (!participantsRef.current.has(call.peer)) {
            setParticipants((prev) => [
              ...prev,
              { peerId: call.peer, stream: remoteStream },
            ]);
            participantsRef.current.add(call.peer);
          }
        });
      }
    });

    const connectToExistingParticipants = async () => {
      if (!localStreamRef.current) {
        console.warn("Local stream not initialized. Skipping connection to participants.");
        return;
      }
    
      const response = await fetchParticipants(meetingId);
      const existingParticipants = response.data;
    
      existingParticipants.forEach((participant) => {
        console.log("participant.peer_id exists:", !!participant.peer_id);
        console.log("peerRef.current exists:", !!peerRef.current);
        console.log("localStreamRef.current exists:", !!localStreamRef.current);
    
        if (participant.peer_id && peerRef.current) {
          console.log("Connecting to participant.peer_id:", participant.peer_id);
          const call = peerRef.current.call(participant.peer_id, localStreamRef.current);
          call.on("stream", (remoteStream) => {
            if (!participantsRef.current.has(participant.peer_id)) {
              setParticipants((prev) => [
                ...prev,
                { peerId: participant.peer_id, stream: remoteStream },
              ]);
              participantsRef.current.add(participant.peer_id);
            }
          });
        } else {
          console.warn("Skipping participant due to missing dependencies:", participant);
        }
      });
    };
    
    


    return () => {
      peer.destroy();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [meetingId, location.search, joinMeeting]);

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

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
          <Video streamRef={localVideoRef} isMuted={true} label="You" />
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
          toggleAudio={() => setIsAudioEnabled((prev) => !prev)}
          toggleVideo={() => setIsVideoEnabled((prev) => !prev)}
        />
      </div>
      <Chat peerId={peerId} meetingId={meetingId} />
    </div>
  );
};

export default MeetingRoom;

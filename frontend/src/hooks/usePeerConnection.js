import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

export const usePeerConnection = (userId) => {
  const [peerId, setPeerId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is required to initialize PeerJS");
      return;
    }

    // Initialize PeerJS with the user ID as the Peer ID
    const peer = new Peer(userId);
    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log("Peer ID:", id);
      setPeerId(id);
    });

    peer.on("call", (call) => {
      console.log("Incoming call received");
      call.answer(localStreamRef.current);

      call.on("stream", (stream) => {
        console.log("Incoming stream received");
        setRemoteStream(stream);
      });

      call.on("close", () => {
        console.log("Call closed by remote peer");
      });
    });

    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Failed to initialize local stream:", error);
      }
    };

    initLocalStream();

    return () => {
      peer.destroy();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [userId]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const callPeer = (otherPeerId) => {
    if (!peerRef.current || !localStreamRef.current) return;

    console.log("Calling peer ID:", otherPeerId);
    const call = peerRef.current.call(otherPeerId, localStreamRef.current);

    call.on("stream", (stream) => {
      console.log("Remote stream received:", stream);
      setRemoteStream(stream);
    });

    call.on("close", () => {
      console.log("Call closed");
    });
  };

  const toggleTrack = (type) => {
    if (!localStreamRef.current) return;
    const track = localStreamRef.current.getTracks().find((t) => t.kind === type);
    if (track) {
      track.enabled = !track.enabled;
      if (type === "video") setIsVideoEnabled(track.enabled);
      if (type === "audio") setIsAudioEnabled(track.enabled);
    }
  };

  const leaveMeeting = () => {
    peerRef.current?.destroy();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    window.location.reload();
  };

  return {
    peerId,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    localVideoRef,
    remoteVideoRef,
    callPeer,
    toggleTrack,
    leaveMeeting,
  };
};

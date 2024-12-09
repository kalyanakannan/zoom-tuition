import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

export const usePeerConnection = (userId) => {
  const [peerId, setPeerId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connections, setConnections] = useState(new Map()); // For data connections
  const [messages, setMessages] = useState([]); // Track chat messages

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

    // Handle incoming data connections
    peer.on("connection", (conn) => {
      console.log("Incoming data connection:", conn.peer);

      conn.on("data", (data) => {
        console.log("Received message:", data);
        setMessages((prev) => [...prev, { sender: conn.peer, text: data }]);
      });

      conn.on("open", () => {
        setConnections((prev) => new Map(prev).set(conn.peer, conn));
      });

      conn.on("close", () => {
        setConnections((prev) => {
          const updated = new Map(prev);
          updated.delete(conn.peer);
          return updated;
        });
        console.log("Data connection closed with:", conn.peer);
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

    // Establish a data connection for chat
    const conn = peerRef.current.connect(otherPeerId);

    conn.on("open", () => {
      console.log("Data connection established with:", otherPeerId);
      setConnections((prev) => new Map(prev).set(otherPeerId, conn));
    });

    conn.on("data", (data) => {
      console.log("Received message:", data);
      setMessages((prev) => [...prev, { sender: otherPeerId, text: data }]);
    });

    conn.on("close", () => {
      setConnections((prev) => {
        const updated = new Map(prev);
        updated.delete(otherPeerId);
        return updated;
      });
      console.log("Data connection closed with:", otherPeerId);
    });
  };

  const sendMessage = (message) => {
    connections.forEach((conn) => {
      conn.send(message);
    });
    setMessages((prev) => [...prev, { sender: "Me", text: message }]);
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
    sendMessage,
    messages,
    toggleTrack,
    leaveMeeting,
  };
};

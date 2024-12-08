import React from "react";

const Video = ({ streamRef, isMuted, label }) => (
  <div className="flex flex-col items-center">
    <h2 className="text-xl font-bold mb-2">{label}</h2>
    <video
      ref={streamRef}
      autoPlay
      playsInline
      muted={isMuted}
      className="w-full h-auto border rounded"
    />
  </div>
);

export default Video;

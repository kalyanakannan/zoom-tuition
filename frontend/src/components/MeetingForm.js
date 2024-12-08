import React, { useState } from "react";
import { createMeeting } from "../api/api";

const MeetingForm = () => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMeeting({ title, start_time: startTime, is_active: true });
      alert("Meeting created successfully!");
      setTitle("");
      setStartTime("");
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Meeting</h1>
      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Create Meeting
      </button>
    </form>
  );
};

export default MeetingForm;

import React, { useEffect, useState } from "react";
import { getMeetings } from "../api/api";
import { useNavigate } from "react-router-dom";

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { data } = await getMeetings();
        setMeetings(data);
      } catch (err) {
        console.error("Failed to load meetings:", err);
      }
    };
    fetchMeetings();
  }, []);

  const handleJoin = (meetingId) => {
    navigate(`/meeting/${meetingId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meetings</h1>
      <ul>
        {meetings.map((meeting) => (
          <li key={meeting.id} className="border p-4 mb-2 rounded">
            <h2 className="text-xl font-bold">{meeting.title}</h2>
            <p>Start Time: {new Date(meeting.start_time).toLocaleString()}</p>
            <p>Host: {meeting.host}</p>
            <button
              onClick={() => handleJoin(meeting.id)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeetingList;

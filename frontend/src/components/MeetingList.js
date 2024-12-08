import React, { useEffect, useState } from "react";
import { getMeetings } from "../api/api";

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { data } = await getMeetings();
        setMeetings(data);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    fetchMeetings();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meetings</h1>
      <ul>
        {meetings.map((meeting) => (
          <li key={meeting.id} className="border p-4 mb-2 rounded">
            <h2 className="text-xl font-bold">{meeting.title}</h2>
            <p>Start Time: {new Date(meeting.start_time).toLocaleString()}</p>
            <p>Host: {meeting.host}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeetingList;

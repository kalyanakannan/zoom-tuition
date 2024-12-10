import React from "react";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "../api/api";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNewMeeting = async () => {
    try {
      // API call to create a new meeting
      const response = await createMeeting({
        title: "New Meeting",
        start_time: new Date().toISOString(),
        is_active: true,
      });
      const meetingId = response.data.id; // Assuming API response contains `id` as the meeting ID
      console.log("Meeting created successfully:", meetingId);

      // Redirect to the newly created meeting URL
      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      console.error("Error creating meeting:", error);
      alert("Failed to create a new meeting. Please try again.");
    }
  };

  const handleJoinMeeting = (event) => {
    event.preventDefault();
    const meetingCode = event.target.meetingCode.value.trim();

    if (!meetingCode) {
      alert("Please enter a valid code or link.");
      return;
    }

    try {
      const url = new URL(meetingCode);

      // Check if the URL is an internal meeting URL
      const isInternalMeetingURL =
        url.hostname === window.location.hostname && url.pathname.startsWith("/meeting/");

      if (isInternalMeetingURL) {
        // Redirect to the internal meeting URL
        window.location.href = url.href;
      } else {
        alert("Invalid meeting link. Please enter a valid meeting code or link.");
      }
    } catch (e) {
      // If it's not a URL, treat it as a meeting code
      navigate(`/meeting/${meetingCode}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <h1 className="text-3xl font-semibold mb-2">Video calls and meetings for everyone</h1>
      <p className="text-lg text-gray-600 mb-6">
        Connect, collaborate, and celebrate from anywhere with Zoom Tuition App
      </p>

      {/* Actions */}
      <div className="flex flex-col items-center space-y-4">
        {/* New Meeting Button */}
        <button
          onClick={handleNewMeeting}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
        >
          + New Meeting
        </button>

        {/* Join Meeting Form */}
        <form
          onSubmit={handleJoinMeeting}
          className="flex items-center space-x-2 w-full max-w-md"
        >
          <input
            type="text"
            name="meetingCode"
            placeholder="Enter a code or link"
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;

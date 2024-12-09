import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { joinMeetingAPI } from "../api/api";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [meetingId, setMeetingId] = useState("");
  const [guestName, setGuestName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    // Clear the token and update state
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleJoinMeeting = async () => {
    if (!meetingId || !guestName) {
      alert("Please enter both meeting ID and guest name.");
      return;
    }

    try {
      // Post the details to the backend
      const response = await joinMeetingAPI(meetingId, { guest_name: guestName });
      console.log("Successfully joined the meeting:", response.data);

      // Navigate to the meeting room after successful join
      navigate(`/meetings/${meetingId}?guestName=${encodeURIComponent(guestName)}`);
      setShowModal(false); // Close the modal after navigating
    } catch (error) {
      console.error("Error joining meeting:", error);
      alert("Failed to join the meeting. Please check the meeting ID and try again.");
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">Zoom Tuition</Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Join Meeting
          </button>
          <Link to="/meetings" className="px-4">Meetings</Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="px-4">Logout</button>
          ) : (
            <Link to="/login" className="px-4">Login</Link>
          )}
        </div>
      </nav>

      {/* Modal for joining a meeting */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Join Meeting</h2>
            <input
              type="text"
              placeholder="Meeting ID"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="text"
              placeholder="Guest Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinMeeting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

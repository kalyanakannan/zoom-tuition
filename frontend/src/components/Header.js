import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/api";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [meetingId, setMeetingId] = useState("");
  const [guestName, setGuestName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token); // Set the token in headers
      setIsAuthenticated(true);
    }
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
      // Navigate to the meeting room after successful join
      navigate(`/meeting/${meetingId}?guestName=${encodeURIComponent(guestName)}`);
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
          <Link to="/meetings" className="px-4">Meetings</Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="px-4">Logout</button>
          ) : (
            <Link to="/login" className="px-4">Login</Link>
          )}
        </div>
      </nav>

      
    </header>
  );
};

export default Header;

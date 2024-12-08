import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">Zoom Clone</Link>
        <div>
          <Link to="/meetings" className="px-4">Meetings</Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="px-4">
              Logout
            </button>
          ) : (
            <Link to="/login" className="px-4">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

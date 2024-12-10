import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import MeetingPage from "./pages/MeetingPage";
import LoginPage from "./pages/LoginPage";
import MeetingRoom from "./pages/MeetingRoom";
import MeetingEnd from "./pages/MeetingEnd";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/meetings" element={<MeetingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/meeting/:meetingId"
        element={
          <ProtectedRoute>
            <MeetingRoom />
          </ProtectedRoute>
        }
      />
      <Route path="/meeting-end" element={<MeetingEnd />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
);

export default App;

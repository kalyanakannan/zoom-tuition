import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import MeetingPage from "./pages/MeetingPage";
import LoginPage from "./pages/LoginPage";
import MeetingRoom from "./pages/MeetingRoom";

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/meetings" element={<MeetingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/meeting/:meetingId" element={<MeetingRoom />} />
    </Routes>
  </Router>
);

export default App;

import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8000/api",
// });

const API = axios.create({
  baseURL: "https://zoom-tuition-app-7bcd79679676.herokuapp.com/api" || "http://localhost:8000/api",
});


export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export const login = (data) => API.post("/token/", data);
export const register = (data) => API.post("/register/", data);
export const getUserProfile = () => API.get("/profile/me/");
export const getMeetings = () => API.get("/meetings/");
export const createMeeting = (data) => API.post("/meetings/", data);
export const joinMeetingAPI = (meetingId, data) =>
  API.post(`/meetings/${meetingId}/join/`, data);

export const fetchParticipants = (meetingId) =>
  API.get(`/participants/${meetingId}/`);





export default API;

import axios from "axios";

// Dynamically determine the base URL
const baseURL =
  window.location.hostname === "localhost"
    ? process.env.REACT_APP_API_URL_LOCAL || "http://localhost:8000/api"
    :  (process.env.REACT_APP_API_URL_PRODUCTION || window.location.origin) + "/api";

  console.log("baseurl:" , process.env.REACT_APP_API_URL_PRODUCTION)

const API = axios.create({
  baseURL: baseURL,
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

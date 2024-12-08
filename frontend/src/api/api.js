import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});


export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export const login = (data) => API.post("/token/", data);
export const getMeetings = () => API.get("/meetings/");
export const createMeeting = (data) => API.post("/meetings/", data);

export default API;

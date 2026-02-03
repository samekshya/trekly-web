import axios from "axios";

const api = axios.create({
  baseURL: "/api",        // ✅ IMPORTANT: same-origin
  withCredentials: true,  // keep this
});

export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5050/api",
//   withCredentials: true, // allows HttpOnly cookie
// });

// export default api;


// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5050/api",
//   withCredentials: true, // IMPORTANT: allows cookies
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;

import axiosClient from "./axiosClient";
const authApi = {
  findMe: (params) => axiosClient.get("auth/user", params),
  signup: (params) => axiosClient.post("auth/signup", params),
  login: (params) => axiosClient.post("auth/login", params),
  verifyToken: () => axiosClient.post("auth/verify-token"),
  sendOtp: (params) => axiosClient.post("auth/send-otp", params),
  verifyOtp: (params) => axiosClient.post("auth/verify-otp", params),
  updatePomodoro: (params) => axiosClient.put("auth/app/pomodoroUpdate", params),
//   getPomodoro:params=>axiosClient.get('/auth/app/getPomodoro', params)
};
export default authApi;
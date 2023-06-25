import axiosClient from "./axiosClient";
const authApi = {
      signup:params=>axiosClient.post("auth/signup",params),
      login:params=>axiosClient.post("auth/login",params),
      verifyToken:()=>axiosClient.post("auth/verify-token"),
      sendOtp:params=>axiosClient.post("auth/send-otp", params), 
      verifyOtp:params=>axiosClient.post("auth/verify-otp", params)
}
export default authApi;
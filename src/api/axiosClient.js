import axios from "axios"
import queryString from "query-string"
const baseUrl =
  "https://task-backend-lkxl0zoud-aayush-kumar-bhats-projects.vercel.app";
const getToken = (req,res)=>localStorage.getItem('token')

const axiosClient = axios.create({
      baseURL:baseUrl,
      paramsSerializer:params=>queryString.stringify({params})
})
axiosClient.interceptors.request.use(async config=>{
      return {
            ...config,
            headers:{
                  "content-type": "application/json", 
                  "authorization":`Bearer ${getToken()} `
            }
      }
})
axiosClient.interceptors.response.use(response=>{
      if (response && response.data) {
            return response.data
      }
            return response;

}, err=>{
      if(!err.response){
            return alert(err)
      }
      throw err.response
})
export default axiosClient
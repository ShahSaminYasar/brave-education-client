import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const instance = axios.create({
  baseURL: "https://server-brave-education.vercel.app/api/v1",
  withCredentials: true,
});

const useAxios = () => {
  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 403) {
        // console.log("Received Unauthorized")
        localStorage.removeItem("be_admin");
        window.location.replace("/admin");
      }
    }
  );
  return instance;
};
export default useAxios;

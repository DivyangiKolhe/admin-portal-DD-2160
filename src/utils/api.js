import { responsiveFontSizes } from "@mui/material";
import axios from "axios";

const api = axios.create({
  baseURL: "https://apidev.manastik.com/v1",
});

// Create an interceptor to check for expired tokens
api.interceptors.response.use((response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && originalRequest.url !== "/refresh")
    {
      const user=JSON.parse(localStorage.getItem("user"));

      if(user.refreshToken) 
      {
        try 
        {
          const refreshResponse = await api.post("/refresh", {
            token: user.refreshToken,
          });
          const { authToken, refreshToken } = refreshResponse.data.data;

          localStorage.setItem("user",JSON.stringify(refreshResponse.data.data));

          originalRequest.headers.Authorization = `Bearer ${authToken}`;
          return api(originalRequest);
        } 
        catch(refreshError) 
        {
          console.error("Failed to refresh token:", refreshError);
        }
      } 
      else 
      {
        // Refresh token not found, handle session expiration
        console.error("Refresh token not found, session expired");
        return Promise.reject({
          message: 'Session expired',
          status: 401
        });
        // Redirect user to login page or display a notification
      }
    }

    return Promise.reject(error);
  }
);

export default api;

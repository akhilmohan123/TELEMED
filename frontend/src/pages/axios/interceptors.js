import axios from "axios";

export const attachAuthInterceptors = (apiInstance) => {

  // REQUEST – nothing to attach
  apiInstance.interceptors.request.use(
    (config) => {
      config.withCredentials = true;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE – refresh on 401
  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          // Call refresh endpoint (cookie sent automatically)
          await axios.post(
            "/users/api/refresh",
            {},
            { withCredentials: true }
          );

          // Retry original request
          return apiInstance(originalRequest);
        } catch (err) {
          // Refresh token expired → logout
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};

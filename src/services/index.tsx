import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

// api no auth
export const ApiNoAuth = axios.create({
  baseURL,
});

ApiNoAuth.interceptors.request.use(
  (config) => {
    return { ...config };
  },
  (error) => {
    return Promise.reject(error);
  },
);

ApiNoAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

export default ApiNoAuth;

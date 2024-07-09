import axios from 'axios';

interface Credentials {
  email: string;
  password: string;
};

interface User {
  id: string;
  name: string;
  email: string;
}

const baseURL: string =
  import.meta.env.MODE !== "production"
    ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
    : `${import.meta.env.VITE_API_BASE_URL_PROD}/api/v1`;

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export const login = async (credentials: Credentials): Promise<User> => {
  const response = await apiClient.post<User>("/auth/login", credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.get("/auth/logout");
};
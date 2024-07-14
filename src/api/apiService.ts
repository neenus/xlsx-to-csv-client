import axios from 'axios';
import { Contractor } from '../types';

interface Credentials {
  email: string;
  password: string;
};

interface User {
  id: string;
  name: string;
  email: string;
};

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

// Auth API
export const login = async (credentials: Credentials): Promise<User> => {
  const response = await apiClient.post<User>("/auth/login", credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.get("/auth/logout");
};

// Contractors API
export const getContractors = async (): Promise<{ success: boolean, count: number, data: Contractor[] }> => {
  const response = await apiClient.get<{ success: boolean, count: number, data: Contractor[] }>("/contractors");
  return response.data;
};

export const addContractor = async (contractor: Contractor): Promise<{ success: boolean, data: Contractor }> => {
  const response = await apiClient.post<{ success: boolean, data: Contractor }>("/contractors", contractor);
  return response.data;
};

export const updateContractor = async (contractor: Contractor): Promise<{ success: boolean, data: Contractor }> => {
  const response = await apiClient.patch<{ success: boolean, data: Contractor }>(`/contractors/${contractor._id}`, contractor);
  return response.data;
};

export const deleteContractor = async (id: string): Promise<{ success: boolean, data: {} }> => {
  const response = await apiClient.delete<{ success: boolean, data: {} }>(`/contractors/${id}`);
  return response.data;
}
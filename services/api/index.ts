import { logout, useUserStore } from '@/store/userStore';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.etarath.ae';



const apiClient = axios.create({
  baseURL: BASE_URL,

});

const logOnDev = (
  message: string,
  log?: AxiosResponse | InternalAxiosRequestConfig | AxiosError,
) => {
  if (__DEV__) {
     
    console.log(message, log);
  }
};

apiClient.interceptors.request.use(
  async config => {
    const session = useUserStore.getState()?.accessToken;
    if (session) {
      config.headers.Authorization = `Bearer ${session}`;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  response => {
    const { method, url } = response.config;
    const { status } = response;

    logOnDev(`✨ [${method?.toUpperCase()}] ${url} | Response ${status}`, response.data);

    return response;
  },
  async error => {
    const { message } = error;
    // Safely access nested error property or provide a default
    const ERR = error.response?.data?.result?.error || error.response?.data?.message || 'Unknown error';
    const { method, url } = error.config || {};
    if (error.response?.status === 401) {
      logout();
    }

    logOnDev(
      `🚨 [${method?.toUpperCase()}] ${url} | Error ${Array.isArray(ERR) ? ERR[0] : ERR} ${error.response?.status}
       | ${message}`,
      error,
    );

    return Promise.reject(error);
  },
);

export default apiClient;

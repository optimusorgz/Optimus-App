import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your computer's local IP address for physical devices and emulators
const API_URL = 'http://10.42.180.144:8000/api';

const client: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error retrieving token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: any) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear storage
            try {
                await AsyncStorage.removeItem('authToken');
                await AsyncStorage.removeItem('user');
            } catch (e) {
                console.error('Error clearing storage:', e);
            }
        }
        return Promise.reject(error);
    }
);

export default client;

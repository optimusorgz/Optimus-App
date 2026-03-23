import axios from 'axios';
import { Platform } from 'react-native';

// Use your computer's local IP address for physical devices and emulators
const API_URL = 'http://192.168.1.31:8000/api';

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default client;

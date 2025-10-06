import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // WAJIB untuk mengirim cookie ke Laravel
    headers: {
        'Accept': 'application/json',
    }
});

export default api;

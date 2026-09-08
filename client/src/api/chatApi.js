import api from './axiosInstance';

export const sendMessage = (message) => api.post('/chat', { message });
export const getChatHistory = () => api.get('/chat/history');
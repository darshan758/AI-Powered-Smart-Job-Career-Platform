import api from './axiosInstance';

export const getMatchScore = (jobId) => api.get(`/match/${jobId}`);
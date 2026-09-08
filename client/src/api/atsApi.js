import api from './axiosInstance';

export const getAtsScore = (jobId) => api.get(jobId ? `/ats/score/${jobId}` : '/ats/score');
import api from './axiosInstance';

export const createJobPosting = (data) => api.post('/jobpostings', data);
export const getAllJobPostings = () => api.get('/jobpostings');
export const getJobPostingById = (id) => api.get(`/jobpostings/${id}`);
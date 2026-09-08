import api from './axiosInstance';

export const getAllUsers = () => api.get('/admin/users');
export const deleteJobPosting = (id) => api.delete(`/jobpostings/${id}`);
export const getAnalytics = () => api.get('/admin/analytics');
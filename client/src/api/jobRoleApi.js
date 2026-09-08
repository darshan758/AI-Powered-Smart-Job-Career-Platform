import api from './axiosInstance';

export const getAllJobRoles = () => api.get('/jobroles');
export const getSkillGap = (roleId) => api.get(`/jobroles/${roleId}/skill-gap`);
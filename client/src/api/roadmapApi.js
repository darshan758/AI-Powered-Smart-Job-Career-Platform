import api from './axiosInstance';

export const generateRoadmap = (roleId) => api.post(`/roadmap/generate/${roleId}`);
export const getMyRoadmaps = () => api.get('/roadmap');
export const toggleRoadmapItem = (roadmapId, itemId) =>
  api.patch(`/roadmap/${roadmapId}/item/${itemId}`);
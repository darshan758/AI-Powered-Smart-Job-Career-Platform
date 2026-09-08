import api from './axiosInstance';

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file); // must match the 'resume' field name from Step 6's upload.single('resume')
  return api.post('/resume/upload', formData);
};

export const analyzeResume = () => api.post('/resume/analyze');
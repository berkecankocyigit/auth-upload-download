import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Update this with your actual API URL
const FRONTEND_MASTER_KEY = 'your-frontend-master-key'; // Update this with your actual key

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'frontend_master_key': FRONTEND_MASTER_KEY
  }
});

export const authenticate = async () => {
  try {
    const response = await api.post('/auth');
    return response.data;
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post(`/upload/${file.name}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log(`Upload Progress: ${percentCompleted}%`);
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Upload failed');
  }
};

export const listFiles = async () => {
  try {
    const response = await api.get('/files');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch files');
  }
};

export const downloadFile = async (fileName: string) => {
  try {
    const response = await api.get(`/download/${fileName}`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    throw new Error('Download failed');
  }
};
import axios from 'axios';

/**
 * Your FastAPI is at http://localhost:8000 by default.
 * Adjust this if your server is elsewhere.
 */
const API_BASE_URL = 'http://20.199.72.234:8000';

/**
 * Create a base Axios instance with default settings.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // This is important for CORS
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

export const authenticate = async (frontendKey: string) => {
  console.log(frontendKey);
  try {
    const response = await api.post('/auth', null, {
      headers: {
        'Frontend-Key': frontendKey,
        'Access-Control-Allow-Origin': '*',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Authentication failed');
  }
};

export const getAvailableRaspberry = async () => {
  try {
    const response = await api.get('/available-raspberry', {
      headers: {
        'Frontend-Key': localStorage.getItem('frontendMasterKey'),
        'Access-Control-Allow-Origin': '*',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch files');
  }
}

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  let filaName = file.name;
  console.log(filaName);

  try {
    const frontendKey = localStorage.getItem('frontendMasterKey');
    if (!frontendKey) {
      throw new Error('No frontend key found. Please login again.');
    }

    // Wait for the getAvailableRaspberry promise to resolve
    const { raspberry_url, raspberry_key } = await getAvailableRaspberry();
    console.log(raspberry_url);
    console.log(raspberry_key);
    
    // Create the axios instance with the resolved values
    const newapi = axios.create({
      baseURL: raspberry_url,
      withCredentials: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

    // Make the POST request
    const response = await newapi.post(`/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Secure-Key': raspberry_key,
        "File-Name": filaName,
        'Access-Control-Allow-Origin': '*',
      },
      onUploadProgress: (progressEvent) => {
        const total = progressEvent.total ?? 1;
        const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
        console.log(`Upload Progress: ${percentCompleted}%`);
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Upload failed');
  }
};

export const listFiles = async () => {
  try {
    const response = await api.get('/files', {
      headers: {
        'Frontend-Key': localStorage.getItem('frontendMasterKey'),
        'Access-Control-Allow-Origin': '*',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch files');
  }
};

export const deleteFile = async (fileName: string, raspberryId: string) => {
  try {
    const { raspberry_url, raspberry_key } = await getRaspberryURL(raspberryId);
    
    const newapi = axios.create({
      baseURL: raspberry_url,
      withCredentials: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

    const response = await newapi.delete(`/delete`, {
      headers: {
        'X-Secure-Key': raspberry_key,
        'File-Name': fileName,
        'Access-Control-Allow-Origin': '*',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Delete failed');
  }
};

export const getRaspberryURL = async (raspberryId: string) => {
  console.log(raspberryId);
  try {
    const response = await api.get(`/get_raspberry`, {
      headers: {
        'Frontend-Key': localStorage.getItem('frontendMasterKey'),
        'Raspberry-Id': raspberryId,
        'Access-Control-Allow-Origin': '*',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch files');
  }
}

export const downloadFile = async (
  fileName: string,
  xRaspberryId: string,
) => {
  try {
    const { raspberry_url, raspberry_key } = await getRaspberryURL(xRaspberryId);

    const newapi = axios.create({
      baseURL: raspberry_url,
      withCredentials: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

    const response = await newapi.get(`/download`, {
      headers: {
        'X-Secure-Key': raspberry_key,
        'File-Name': fileName,
        'Access-Control-Allow-Origin': '*',
      },
      responseType: 'blob',
    });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

  } catch (error) {
    console.error(error);
    throw new Error('Download failed');
  }
};
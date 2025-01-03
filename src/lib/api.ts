import axios from 'axios';

/**
 * Your FastAPI is at http://localhost:8000 by default.
 * Adjust this if your server is elsewhere.
 */
const API_BASE_URL = 'http://13.50.49.40:8000';

/**
 * This is the key your frontend uses to authenticate to routes expecting `frontend_key`.
 * In Python, your route definitions look like:
 *   @app.post("/auth")
 *   async def frontend_auth(frontend_key: str = Header(...)):
 * which expects the header name "Frontend-Key".
 */
const FRONTEND_MASTER_KEY = 'palpatine-somehow-returned';

/**
 * Create a base Axios instance with default settings.
 * We won't set headers globally here because
 * different endpoints need different headers.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * 1. FRONTEND AUTHENTICATION
 * 
 *   - FastAPI route:  /auth
 *   - Python expects: `frontend_key: str = Header(...)`
 *   => You must send `Frontend-Key: ...`
 */
export const authenticate = async () => {
 /* try {
    const response = await api.post('/auth', null, {
      headers: {
        'Frontend-Key': FRONTEND_MASTER_KEY,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Authentication failed');
  }*/
  return {message: "Authenticated"};
  };

/**
 * 2. UPLOAD FILE
 * 
 *   - FastAPI route:  /upload/{file_name}
 *   - Python expects: x_raspberry_id & x_secure_key in headers
 *   => You must send:
 *        X-Raspberry-Id: <somePiId>
 *        X-Secure-Key:   <theUniqueKeyReturnedAtRegistration>
 */
export const uploadFile = async (
  file: File,
  xRaspberryId: string,
  xSecureKey: string
) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post(`/upload/${file.name}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Raspberry-Id': xRaspberryId,
        'X-Secure-Key': xSecureKey,
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

/**
 * 3. LIST FILES
 * 
 *   - FastAPI route:  /files
 *   - Python expects: frontend_key in the header
 *   => Send `Frontend-Key: <FRONTEND_MASTER_KEY>`
 */
export const listFiles = async () => {
  try {
    const response = await api.get('/files', {
      headers: {
        'Frontend-Key': FRONTEND_MASTER_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch files');
  }
};

/**
 * 4. DOWNLOAD FILE
 * 
 *   - FastAPI route:  /download/{file_name}
 *   - Python expects: x_raspberry_id & x_secure_key in headers
 */
export const downloadFile = async (
  fileName: string,
  xRaspberryId: string,
  xSecureKey: string
) => {
  try {
    const response = await api.get(`/download/${fileName}`, {
      responseType: 'blob',
      headers: {
        'X-Raspberry-Id': xRaspberryId,
        'X-Secure-Key': xSecureKey,
      },
    });
    // Create a blob URL and auto-click for download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error(error);
    throw new Error('Download failed');
  }
};

import axios from 'axios';

/**
 * Your FastAPI is at http://localhost:8000 by default.
 * Adjust this if your server is elsewhere.
 */
const API_BASE_URL = 'http://20.199.72.234:8000';

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
 * 
 
 */

const api = axios.create({
  baseURL: API_BASE_URL,
});


export const authenticate = async () => {
  try {
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
  }
};


export const getAvailableRaspberry = async () => {
  try {
    const response = await api.get('/available-raspberry', {
      headers: {
        'Frontend-Key': FRONTEND_MASTER_KEY,
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
    // Wait for the getAvailableRaspberry promise to resolve
    const { raspberry_url, raspberry_key } = await getAvailableRaspberry();
    console.log(raspberry_url);
    console.log(raspberry_key);
    // Create the axios instance with the resolved values
    const newapi = axios.create({
      baseURL: raspberry_url,
    });

    // Make the POST request
    const response = await newapi.post(`/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Secure-Key': raspberry_key,
        "File-Name": filaName,
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

export const getRaspberryURL = async (raspberryId: string) => {
  console.log(raspberryId);
  try {
    const response = await api.get(`/get_raspberry`, {
      headers: {
        'Frontend-Key': FRONTEND_MASTER_KEY,
        'Raspberry-Id': raspberryId,
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
    });

    const response = await newapi.get(`/download`, {
      headers: {
        'X-Secure-Key': raspberry_key,
        'File-Name': fileName,
      },
      responseType: 'blob',
    });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a link element
    const link = document.createElement('a');
    link.href = url; // Set the href to the blob URL
    link.download = fileName; // Set the download attribute to the file name
    document.body.appendChild(link); // Append the link to the DOM (required for Firefox)
    link.click(); // Trigger the download

    // Clean up by revoking the object URL and removing the link
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

  } catch (error) {
    console.error(error);
    throw new Error('Download failed');
  }
};
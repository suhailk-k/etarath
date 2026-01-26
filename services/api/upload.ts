import { ENDPOINTS } from "./endpoints";
import apiClient from "./index";

export const uploadApi = {
  uploadFile: async (fileUri: string): Promise<string> => {
    const formData = new FormData();
    const filename = fileUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('file', { uri: fileUri, name: filename, type } as any);

    const response = await apiClient.post(ENDPOINTS.SALES_AGENT.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, headers) => {
        return formData; // Axios transformRequest workaround for FormData in React Native
      },
    });

    return response.data.data.url; // Adjust based on actual server response structure
  }
};

import api from './api';

export const uploadService = {
  uploadCover: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('cover', file);

    const response = await api.post('/upload/cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { url: response.data.data.url };
  },
};

import router from '@/router';
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const imageUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/admin/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.imageUrl;
  } catch (error) {
    alertError('Image Upload Error, Please try again!');
    return '';
  }
};

export const imagesUpload = async (files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await api.post('/admin/image/all', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.imageUrlList;
  } catch (error) {
    alertError('Images Upload Error, Please try again!');
    return [];
  }
};

export const alertError = (errorMessage) => {
  alert(`${errorMessage}, 관리자에게 문의하세요.`);
  if (router.currentRoute.value.path !== '/' || router.currentRoute.value.path !== '/login') {
    router.push('/');
  }
};

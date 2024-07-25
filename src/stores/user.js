import { alertError, api } from '@/utils/api';
import { isUUID } from '@/utils/utils';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUser = defineStore('user', () => {
  const isError = ref(false);
  const errorMessage = ref('');

  const userId = ref('');
  const password = ref('');

  const userOwnBoothId = ref('');

  const isValidate = ref(false);
  const isAdmin = ref(false);

  const setUserId = (id) => {
    isError.value = false;
    userId.value = id;
  };

  const setPassword = (pw) => {
    isError.value = false;
    password.value = pw;
  };

  const setIsError = (error) => {
    isError.value = error;
  };

  const setErrorMessage = (message) => {
    errorMessage.value = message;
  };

  const isUserVaild = async () => {
    try {
      const response = await api.post('/admin/user/role');
      isAdmin.value = response.data.role;
      isValidate.value = response.data.success;
      return {
        isAdmin: isAdmin.value,
        isValidate: isValidate.value,
      };
    } catch (e) {
      alertError('User Validate Error, Please try Login again!', false);
      isAdmin.value = false;
      isValidate.value = false;
      return {
        isAdmin: isAdmin.value,
        isValidate: isValidate.value,
      };
    }
  };

  const getUserOwnBoothId = async () => {
    try {
      const response = await api.get('/admin/user/booth');
      const data = response.data;

      if (data.success) {
        userOwnBoothId.value = data.boothId;
        console.log(userOwnBoothId.value);
        return userOwnBoothId.value;
      } else {
        userOwnBoothId.value = '';
        return '';
      }
    } catch (e) {
      userOwnBoothId.value = '';
      console.error(e);
      return '';
    }
  };

  const isUserOwnBooth = async (boothId) => {
    if (!isUUID(boothId)) return false;

    if (isAdmin.value) return true;

    try {
      const response = await api.get('/admin/user/booth');
      const data = response.data;

      if (data.success) {
        userOwnBoothId.value = data.boothId;
        console.log(userOwnBoothId.value);
        return boothId === userOwnBoothId.value;
      } else {
        userOwnBoothId.value = '';
        return false;
      }
    } catch (e) {
      userOwnBoothId.value = '';
      console.error(e);
      return false;
    }
  };

  const login = async () => {
    try {
      const response = await api.post('/admin/user/login', {
        adminId: userId.value,
        passWord: password.value,
      });

      const isSuccess = response.data.success;
      const message = response.data.message;

      if (isSuccess) {
        isError.value = false;
        errorMessage.value = '';
        await isUserVaild();
      } else {
        isError.value = true;
        errorMessage.value = message;
        isAdmin.value = false;
        isValidate.value = false;
        userOwnBoothId.value = '';
      }
      return isSuccess;
    } catch (error) {
      console.log(error);
      isError.value = true;
      errorMessage.value = error;

      isAdmin.value = false;
      isValidate.value = false;
      userOwnBoothId.value = '';
      logout();
      return false;
    }
  };

  const logout = async () => {
    try {
      const response = await api.post('/admin/user/logout');
      isAdmin.value = false;
      isValidate.value = false;
      userOwnBoothId.value = '';
    } catch (error) {
      isAdmin.value = false;
      isValidate.value = false;
      userOwnBoothId.value = '';
      alertError(error, false);
    }
  };

  return {
    login,
    logout,
    isError,
    errorMessage,
    userId,
    password,
    isValidate,
    isAdmin,
    userOwnBoothId,
    isUserVaild,
    isUserOwnBooth,
    setUserId,
    setPassword,
    setIsError,
    setErrorMessage,
    getUserOwnBoothId,
  };
});

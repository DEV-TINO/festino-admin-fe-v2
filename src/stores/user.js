import { alertError, api, isUserVaild } from '@/utils/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUser = defineStore('user', () => {
  const isError = ref(false);
  const errorMessage = ref('');

  const userId = ref('');
  const password = ref('');

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
      alertError('User Validate Error, Please try Login again!');
      isAdmin.value = false;
      isValidate.value = false;
      return {
        isAdmin: isAdmin.value,
        isValidate: isValidate.value,
      };
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
      }
      return isSuccess;
    } catch (error) {
      console.log(error);
      isError.value = true;
      errorMessage.value = error;

      isAdmin.value = false;
      isValidate.value = false;
      logout();
      // alertError('Login Error, Please try Login again');
      // alertError(error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const response = await api.post('/admin/user/logout');
      console.log(response.data);
      isAdmin.value = false;
      isValidate.value = false;
    } catch (error) {
      isAdmin.value = false;
      isValidate.value = false;
      alertError(error);
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
    isUserVaild,
    setUserId,
    setPassword,
    setIsError,
    setErrorMessage,
  };
});

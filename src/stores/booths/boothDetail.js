import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

import { useBoothList } from './boothList';
import { alertError, api } from '@/utils/api';
import { ADMIN_CATEGORY } from '@/utils/constants';

export const useBoothDetail = defineStore('boothDetail', () => {
  const useBoothListStore = useBoothList();
  const { getAllBoothList } = useBoothListStore;
  const { boothList } = storeToRefs(useBoothListStore);

  const boothInfo = ref({
    boothId: '',
    boothName: '',
    adminName: '',
    adminCategory: '주간부스',
    openTime: '',
    closeTime: '',
    boothIntro: '',
    boothImage: [],
    location: '',
    isOpen: true,
    isOrder: true,
    isReservation: true,
    totalReservationNum: 0,
  });
  const boothType = ref('');

  const menuList = ref([]);
  const originalMenuList = ref([]);

  const deleteMenuList = ref([]);
  const createMenuList = ref([]);
  const patchMenuList = ref([]);

  const addDeleteMenu = (menuId) => {
    deleteMenuList.value = deleteMenuList.value.filter((id) => id !== menuId);
    deleteMenuList.value.push(menuId);
  };

  const addCreateMenu = (menu) => {
    createMenuList.value = createMenuList.value.filter((m) => m.menuName !== menu.menuName);
    createMenuList.value.push(menu);
  };

  const addPatchMenu = (menu) => {
    patchMenuList.value = patchMenuList.value.filter((m) => m.menuId !== menu.menuId);
    patchMenuList.value.push(menu);
  };

  const addMenuList = (menu) => {
    menuList.value = menuList.value.filter((m) => m.menuName !== menu.menuName);
    menuList.value.push(menu);
  };

  const patchCurrentMenu = (menu) => {
    const index = menuList.value.findIndex((m) => m.menuId === menu.menuId);
    if (index !== -1) {
      menuList.value[index] = { ...menu };
    }
  };
  const init = async (boothId) => {
    console.log('[INFO] boothDetail.js - init()', boothId);
    if (!boothId) return;
    boothType.value = await findBoothType(boothId);
    return await getBoothDetail({ boothId: boothId, type: boothType.value });
  };

  const getBoothInfo = async (boothId) => {
    await getAllBoothList();
    const booth = boothList.value.find((booth) => booth.boothId === boothId);
    boothInfo.value = booth;
    boothType.value = ADMIN_CATEGORY[booth.adminCategory];
    if (ADMIN_CATEGORY[booth.adminCategory] === 'night') {
      const res = await api.get(`/admin/booth/night/${boothId}`);
      if (res.data.success) {
        boothInfo.value = res.data.boothInfo;
      } else {
        //데이터 가져오기 실패
      }
    }

    console.log('[INFO] boothUser.js - getBoothInfo', booth);
  };

  const reset = () => {
    boothInfo.value = {
      boothId: '',
      boothName: '',
      adminName: '',
      adminCategory: '주간부스',
      openTime: '',
      closeTime: '',
      boothIntro: '',
      boothImage: [],
      location: '',
      isOpen: true,
      isOrder: true,
      isReservation: true,
      totalReservationNum: 0,
    };
    boothType.value = '';
    menuList.value = [];
    deleteMenuList.value = [];
    createMenuList.value = [];
    patchMenuList.value = [];
  };

  const findBoothType = async (boothId) => {
    await getAllBoothList();

    const booth = boothList.value.find((booth) => booth.boothId === boothId);

    console.log('[INFO] boothDetail.js - findBoothType()', booth);

    return ADMIN_CATEGORY?.[booth?.adminCategory ?? ''] ?? '';
  };

  const getBoothDetail = async ({ boothId, type }) => {
    if (!boothId || !type) {
      return false;
    }

    try {
      const [boothResponse, menuResponse] = await Promise.all([
        api.get(`/admin/booth/${type}/${boothId}`),
        api.get(`/admin/menu/all/booth/${boothId}`),
      ]);
      const boothData = boothResponse.data;
      const menuData = menuResponse.data;

      console.log('[INFO] boothDetail.js - getBoothDetail()', boothData, menuData);

      if (boothData.success && menuData.success) {
        boothInfo.value = boothData.boothInfo;
        menuList.value = menuData.menuList;
        originalMenuList.value = JSON.parse(JSON.stringify(menuData.menuList));
        return true;
      } else {
        alertError(boothData.message + menuData.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      alertError(error);
      return false;
    }
  };

  const deleteMenu = async (menuId) => {
    if (!menuId) {
      alertError('메뉴 정보가 없습니다.');
      return false;
    } else if (!boothInfo.value.boothId) {
      alertError('부스 정보가 없습니다.');
      return false;
    }

    try {
      const response = await api.delete(`/admin/menu`, {
        data: {
          menuId: menuId,
          boothId: boothInfo.value.boothId,
        },
      });

      const data = response.data;

      return data.success;
    } catch (error) {
      alertError(error);
      return false;
    }
  };

  const createMenu = async (menu) => {
    if (!menu) {
      alertError('메뉴 정보가 없습니다.');
      return false;
    } else if (!boothInfo.value.boothId) {
      alertError('부스 정보가 없습니다.');
      return false;
    }

    try {
      const response = await api.post(`/admin/menu`, {
        ...menu,
        boothId: boothInfo.value.boothId,
      });
      const data = response.data;

      return data.success;
    } catch (error) {
      console.error(error);
      alertError(error);
      return false;
    }
  };

  const patchMenu = async (menu) => {
    if (!menu) {
      alertError('메뉴 정보가 없습니다.');
      return false;
    } else if (!boothInfo.value.boothId) {
      alertError('부스 정보가 없습니다.');
      return false;
    }

    try {
      const response = await api.put(`/admin/menu`, {
        ...menu,
        boothId: boothInfo.value.boothId,
      });
      const data = response.data;

      return data.success;
    } catch (error) {
      console.error(error);
      alertError(error);
      return false;
    }
  };

  return {
    init,
    getBoothInfo,
    reset,
    deleteMenu,
    createMenu,
    patchMenu,
    patchCurrentMenu,
    addDeleteMenu,
    addCreateMenu,
    addPatchMenu,
    addMenuList,
    originalMenuList,
    createMenuList,
    deleteMenuList,
    patchMenuList,
    boothInfo,
    menuList,
    boothType,
  };
});

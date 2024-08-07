import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useBaseModal } from '../baseModal';
import { useBoothDetail } from '../booths/boothDetail';

export const useMenuModal = defineStore('menuModal', () => {
  const baseModalStore = useBaseModal();
  const { addCreateMenu, addPatchMenu, addMenuList, patchCurrentMenu, menuList } = useBoothDetail();

  const menuInfo = ref({
    menuName: '',
    menuPrice: 0,
    menuDescription: '',
    menuImage: '',
    menuType: 'MAINMENU',
    isSoldOut: false,
  });

  const reset = () => {
    menuInfo.value = {
      menuName: '',
      menuPrice: '',
      menuDescription: '',
      menuImage: '',
      menuType: 'MAINMENU',
      isSoldOut: false,
      menuIndex: menuList.length,
    };
  };

  const openModal = (menu) => {
    reset();
    if (menu?.menuName) {
      menuInfo.value = { ...menu };
    }
    baseModalStore.setModalType('menuModal');
    baseModalStore.openModal();
  };

  const openMobileModal = (menu) => {
    reset();
    if (menu?.menuName) {
      menuInfo.value = { ...menu };
    }
    baseModalStore.setModalType('mobileMenu');
    baseModalStore.openMobileModal();
  };

  const submitModal = () => {
    if (menuInfo.value?.menuId) {
      addPatchMenu(menuInfo.value);
      patchCurrentMenu(menuInfo.value);
    } else {
      addCreateMenu(menuInfo.value);
      addMenuList(menuInfo.value);
    }
    baseModalStore.closeModal();
    baseModalStore.closeMobileModal();
  };

  const closeModal = () => {
    baseModalStore.closeModal();
  };

  const closeMobileModal = () => {
    baseModalStore.closeMobileModal();
  };

  return {
    openModal,
    submitModal,
    closeModal,
    reset,
    openMobileModal,
    closeMobileModal,
    menuInfo,
  };
});

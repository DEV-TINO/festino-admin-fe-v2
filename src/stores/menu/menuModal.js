import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useBaseModal } from '../baseModal';
import { useBoothDetail } from '../booths/boothDetail';

export const useMenuModal = defineStore('menuModal', () => {
  const baseModalStore = useBaseModal();
  const { addCreateMenu, addPatchMenu, addMenuList, patchCurrentMenu } = useBoothDetail();

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
    };
  };

  const openModal = (menu) => {
    reset();
    if (menu?.menuName) {
      menuInfo.value = { ...menu };
    }
    console.log('[menuModal] openModal', menuInfo.value);
    baseModalStore.setModalType('menuModal');
    baseModalStore.openModal();
  };

  const submitModal = () => {
    console.log('[menuModal] submitModal', menuInfo.value);
    if (menuInfo.value?.menuId) {
      addPatchMenu(menuInfo.value);
      patchCurrentMenu(menuInfo.value);
    } else {
      addCreateMenu(menuInfo.value);
      addMenuList(menuInfo.value);
    }
    baseModalStore.closeModal();
  };

  const closeModal = () => {
    baseModalStore.closeModal();
  };

  return {
    openModal,
    submitModal,
    closeModal,
    reset,
    menuInfo,
  };
});

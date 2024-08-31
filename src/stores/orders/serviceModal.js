import { alertError, api } from '@/utils/api';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useBaseModal } from '@/stores/baseModal';
import { useBaseOrder } from './baseOrder';

export const useServiceModal = defineStore('serviceModal', () => {
  const useBaseModalStore = useBaseModal();
  const useBaseOrderStore = useBaseOrder();

  const { setModalType, openModal, closeModal } = useBaseModalStore;

  const { boothId } = storeToRefs(useBaseOrderStore);

  const menuList = ref([]);

  const openServiceModal = () => {
    setModalType('serviceModal');
    openModal();
  };

  const getMenuList = async () => {
    try {
      const response = await api.get(`/admin/menu/all/booth/${boothId.value}`);
      if (response.data.success) {
        menuList.value = response.data.menuList;
      } else {
        menuList.value = [];
        alertError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alertError(error, false);
    }
  };

  const saveServiceByTableNum = async (tableNum, orders) => {
    const totalPrice = orders.reduce((acc, cur) => acc + cur.menuPrice * cur.menuCount, 0);
    const menus = orders.map((order) => {
      const { tableNum, ...menuInfo } = order;
      return { ...menuInfo };
    });

    const response = await api.post(`/admin/booth/${boothId.value}/order/service`, {
      tableNum,
      menuInfo: menus,
      totalPrice,
      isCoupon: false,
    });
  };

  const saveService = (orderList) => {
    try {
      Promise.all(
        orderList.map((order) => {
          saveServiceByTableNum(order.tableNum, order.orders);
        }),
      );
    } catch (error) {
      console.error(error);
      alertError(error, false);
    }
  };

  return { menuList, openServiceModal, getMenuList, saveService };
});

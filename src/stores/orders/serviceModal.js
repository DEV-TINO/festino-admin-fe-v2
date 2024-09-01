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
  const memo = ref('');

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

  const saveServiceByTableNum = async (tableNum, orders, isService) => {
    const totalPrice = orders.reduce((acc, cur) => acc + cur.menuPrice * cur.menuCount, 0);
    const menus = orders.map((order) => {
      const { tableNum, isService, ...menuInfo } = order;
      return { ...menuInfo };
    });

    try {
      const response = await api.post(`/admin/booth/${boothId.value}/order/service`, {
        tableNum,
        menuInfo: menus,
        totalPrice,
        isCoupon: false,
        note: memo.value,
        isService,
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const saveService = async (orderList) => {
    const orderListArray = Object.entries(orderList).map(([tableNum, orders]) => ({
      tableNum,
      orders,
    }));

    const serviceOrder = orderListArray
      .map(({ tableNum, orders }) => ({
        tableNum,
        orders: orders.filter((order) => order.isService),
      }))
      .filter(({ orders }) => orders.length > 0);

    const generalOrder = orderListArray
      .map(({ tableNum, orders }) => ({
        tableNum,
        orders: orders.filter((order) => !order.isService),
      }))
      .filter(({ orders }) => orders.length > 0);

    try {
      await Promise.all([
        ...serviceOrder.map(({ tableNum, orders }) => saveServiceByTableNum(tableNum, orders, true)),
        ...generalOrder.map(({ tableNum, orders }) => saveServiceByTableNum(tableNum, orders, false)),
      ]);
      alert('주문이 완료되었습니다.');
      closeModal();
    } catch (error) {
      console.error(error);
      alertError(error, false);
      closeModal();
    }
  };

  return { menuList, memo, openServiceModal, getMenuList, saveService };
});

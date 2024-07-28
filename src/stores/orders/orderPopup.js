import { defineStore, storeToRefs } from 'pinia';
import { useBaseModal } from '../baseModal';
import { ref } from 'vue';
import { api } from '@/utils/api';
import { useBaseOrder } from './baseOrder';
import { useCookingOrder } from '@/stores/orders/cookingOrder';
import { useDepositOrder } from '@/stores/orders/depositOrder';
import { useFinishOrder } from '@/stores/orders/finishOrder';

export const useOrderPopup = defineStore('orderPopup', () => {
  const baseModalStore = useBaseModal();
  const baseOrderStore = useBaseOrder();

  const useDepositOrderStore = useDepositOrder();
  const useCookingOrderStore = useCookingOrder();
  const useFinishOrderStore = useFinishOrder();

  const { getAllTableOrders } = baseOrderStore;
  const { getWaitDepositOrderList } = useDepositOrderStore;
  const { getCookingOrderList } = useCookingOrderStore;
  const { getFinishOrderList } = useFinishOrderStore;

  const { boothId } = storeToRefs(baseOrderStore);

  const menuInfoList = ref([]);
  const orderInfo = ref({});
  const cookingInfo = ref({});

  const selectType = ref(''); // ready, cooking, finish

  const deleteOrder = async ({ orderId }) => {
    try {
      const response = await api.delete(`/admin/booth/${boothId.value}/order/cancel`, {
        data: {
          orderId: orderId,
        },
      });
      console.log('response', response);
      const data = response.data;
      return data.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const patchOrderRestore = async ({ orderId, orderType }) => {
    try {
      const response = await api.put(`/admin/booth/${boothId.value}/order/${String(orderType).toLowerCase()}/restore`, {
        orderId: orderId,
        orderType: orderType,
      });
      console.log('response', response);
      const data = response.data;
      return data.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const patchOrderDeposit = async ({ orderId }) => {
    try {
      const response = await api.put(`/admin/booth/${boothId.value}/order/deposit`, {
        orderId: orderId,
      });
      console.log('response', response);
      const data = response.data;
      return data.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const patchOrderComplete = async ({ orderId, orderType }) => {
    try {
      const response = await api.put(`/admin/booth/${boothId.value}/order/finish`, {
        orderId: orderId,
        orderType: orderType,
      });
      console.log('response', response);
      const data = response.data;
      return data.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const patchCookingComplete = async ({ cookId }) => {
    try {
      const response = await api.put(`/admin/booth/${boothId.value}/order/cook/finish`, {
        cookId: cookId,
      });
      console.log('response', response);
      const data = response.data;
      return data.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const submitPopup = async ({ type }) => {
    baseModalStore.setModalType('loadingModal');
    if (type === 'cancel') {
      const success = await deleteOrder({ orderId: orderInfo.value.orderId });
      if (!success) {
        console.error('주문 취소 실패');
      } else {
        await getWaitDepositOrderList({
          boothId: boothId.value,
          date: 0,
        });
      }
    } else if (type === 'deposit') {
      const success = await patchOrderDeposit({ orderId: orderInfo.value.orderId });
      if (!success) {
        console.error('입금 완료 실패');
      } else {
        await Promise.allSettled([
          getWaitDepositOrderList({
            boothId: boothId.value,
            date: 0,
          }),
          getCookingOrderList({
            boothId: boothId.value,
            date: 0,
          }),
          getAllTableOrders({
            boothId: boothId.value,
            date: 0,
          }),
        ]);
      }
    } else if (type === 'restore') {
      const success = await patchOrderRestore({
        orderId: orderInfo.value.orderId,
        orderType: orderInfo.value.orderType,
      });
      if (!success) {
        console.error('주문 복구 실패');
      } else {
        await Promise.allSettled([
          getCookingOrderList({
            boothId: boothId.value,
            date: 0,
          }),
          getFinishOrderList({
            boothId: boothId.value,
            date: 0,
          }),
        ]);
      }
    } else if (type === 'complete') {
      let success = false;
      if (selectType.value === 'cooking') {
        success = await patchCookingComplete({ cookId: cookingInfo.value.cook.cookId });
        await Promise.allSettled([
          getCookingOrderList({
            boothId: boothId.value,
            date: 0,
          }),
          getAllTableOrders({
            boothId: boothId.value,
            date: 0,
          }),
        ]);
      } else {
        success = await patchOrderComplete({
          orderId: orderInfo.value.orderId,
          orderType: orderInfo.value.orderType,
        });
        await Promise.allSettled([
          getFinishOrderList({
            boothId: boothId.value,
            date: 0,
          }),
          getAllTableOrders({
            boothId: boothId.value,
            date: 0,
          }),
        ]);
      }
      if (!success) {
        console.error('주문 완료 실패');
      }
    }
    baseModalStore.closeModal();
  };

  const openPopup = ({ type, selectOrderInfo, selectMenuInfoList, selectCookingInfo }) => {
    selectType.value = type;
    if (type === 'cooking') {
      cookingInfo.value = selectCookingInfo;
    } else {
      menuInfoList.value = selectMenuInfoList;
      orderInfo.value = selectOrderInfo;
    }

    baseModalStore.setModalType('orderPopup');
    baseModalStore.openModal();
  };

  const closePopup = () => {
    baseModalStore.closeModal();
  };

  return {
    menuInfoList,
    orderInfo,
    cookingInfo,
    selectType,
    submitPopup,
    openPopup,
    closePopup,
    deleteOrder,
    patchOrderRestore,
    patchOrderDeposit,
    patchOrderComplete,
    patchCookingComplete,
  };
});

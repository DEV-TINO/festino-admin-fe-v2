<script setup>
import IconOrder from '@/components/icons/IconOrder.vue';
import IconOrderCheck from '@/components/icons/IconOrderCheck.vue';
import IconOrderDetail from '@/components/icons/IconOrderDetail.vue';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useBoothList } from '@/stores/booths/boothList';
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { useDepositOrder } from '@/stores/orders/depositOrder';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { useUser } from '@/stores/user';
import { api } from '@/utils/api';
import { ORDER_CATEGORY, ORDER_URL } from '@/utils/constants';
import { chunkArray } from '@/utils/utils';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { cloneDeep } from 'lodash';
import IconRefresh from '@/components/icons/IconRefresh.vue';

const useUserStore = useUser();
const useBoothListStore = useBoothList();
const useBaseOrderStore = useBaseOrder();
const useOrderPopupStore = useOrderPopup();
const useDepositOrderStore = useDepositOrder();
const useTableDetailStore = useTableDetail();

const { getAllBoothList } = useBoothListStore;
const { setOrderStatus, getAllTableOrders, initBaseOrder } = useBaseOrderStore;
const { openPopup } = useOrderPopupStore;
const { getWaitDepositOrderList } = useDepositOrderStore;
const { getTableList, getCustomTableNum } = useTableDetailStore;

const { userOwnBoothId, isAdmin } = storeToRefs(useUserStore);
const { boothList } = storeToRefs(useBoothListStore);
const { orderCategories, orderStatus, allTableOrders, boothId } = storeToRefs(useBaseOrderStore);
const { waitDepositOrderList } = storeToRefs(useDepositOrderStore);

const orderBoothList = ref([]);
const chunkedAllTableOrders = ref([]);
const interval = ref(null);
const waitDepositInterval = ref(null);
const route = useRoute();
const router = useRouter();
const isNewOrderExist = ref(false);
const prevOrderList = ref([]);
const isFirstLoad = ref(true);
const isStatistics = ref(false);

const { width } = useWindowSize();

const orderPerRow = computed(() => {
  if (width.value < 760) {
    return 1;
  } else if (width.value < 1080) {
    return 2;
  } else if (width.value < 1380) {
    return 3;
  } else if (width.value < 1680) {
    return 4;
  } else {
    return 5;
  }
});

const getDetailOrder = async (orderId) => {
  try {
    const response = await api.get(`/admin/booth/${boothId.value}/order/${orderId}`);
    const data = response.data;

    if (data.success) {
      return data.orderInfo;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const isFinish = (tableOrder) => {
  return tableOrder.servedCount === tableOrder.totalCount;
};

const refreshAllTableOrders = async () => {
  interval.value = setInterval(async () => {
    if (boothId.value) {
      await getAllTableOrders({
        boothId: boothId.value,
        date: 0,
      });
    }
  }, 3000);
};

const clearIntervalAllTableOrders = () => {
  if (!interval.value) return;
  clearInterval(interval.value);
};

const refreshWaitDepositOrderList = async () => {
  waitDepositInterval.value = setInterval(async () => {
    if (boothId.value) {
      await getWaitDepositOrderList({
        boothId: boothId.value,
        date: 0,
      });
    }
  }, 3000);
};

const clearIntervalWaitDepositOrderList = () => {
  if (!waitDepositInterval.value) return;
  clearInterval(waitDepositInterval.value);
};

const handleClickOrderDetail = async (orderId, orderType) => {
  const orderInfo = await getDetailOrder(orderId);
  if (orderInfo) {
    openPopup({
      type: 'detail',
      selectOrderInfo: {
        orderId: orderInfo.orderId,
        orderNum: orderInfo.orderNum,
        orderType: orderType,
        phoneNum: orderInfo.phoneNum,
        tableNum: orderInfo.tableNum,
        totalPrice: orderInfo.totalPrice,
        userName: orderInfo.userName,
      },
      selectMenuInfoList: orderInfo.menuList,
    });
  }
};

const handleClickOrderFinish = async (tableOrder, orderId, orderType) => {
  if (!isFinish(tableOrder)) return;
  const orderInfo = await getDetailOrder(orderId);
  if (orderInfo) {
    openPopup({
      type: 'complete',
      selectOrderInfo: {
        orderId: orderInfo.orderId,
        orderNum: orderInfo.orderNum,
        orderType: orderType,
        phoneNum: orderInfo.phoneNum,
        tableNum: orderInfo.tableNum,
        totalPrice: orderInfo.totalPrice,
        userName: orderInfo.userName,
      },
      selectMenuInfoList: orderInfo.menuList,
    });
  }
};

const handleClickTableRefresh = async () => {
  clearIntervalAllTableOrders();
  await getAllTableOrders({
    boothId: boothId.value,
    date: 0,
  });
  refreshAllTableOrders();
};

watchEffect(async () => {
  if (boothId.value) {
    await getAllTableOrders({
      boothId: boothId.value,
      date: 0,
    });
  }
});

watchEffect(() => {
  chunkedAllTableOrders.value = chunkArray(allTableOrders.value, 7);
});

watchEffect(() => {
  if (orderStatus.value === 'statistics') {
    isStatistics.value = true;
  } else {
    isStatistics.value = false;
  }

  router.push(`/order/${ORDER_URL[orderStatus.value]}`);
});

watchEffect(() => {
  if (waitDepositOrderList.value.length > prevOrderList.value.length) {
    prevOrderList.value = cloneDeep(waitDepositOrderList.value);
    if (isFirstLoad.value) return (isFirstLoad.value = false);
    isNewOrderExist.value = true;
  }
});

watchEffect(() => {
  if (orderStatus.value === 'realTime') {
    isNewOrderExist.value = false;
  }
});

onMounted(async () => {
  isNewOrderExist.value = false;
  isFirstLoad.value = true;
  isStatistics.value = false;
  initBaseOrder();
  if (isAdmin.value) {
    await getAllBoothList();
    orderBoothList.value = boothList.value.filter((booth) => booth?.isOrder);
    boothId.value = orderBoothList.value[0]?.boothId;
  } else {
    boothId.value = userOwnBoothId.value;
  }
  await getTableList(boothId.value);
  refreshAllTableOrders();
  refreshWaitDepositOrderList();
});

onUnmounted(() => {
  clearIntervalAllTableOrders();
  clearIntervalWaitDepositOrderList();
});
</script>

<template>
  <div class="flex flex-col px-4 gap-[40px] min-w-[630px] pb-20">
    <!-- Order Header -->
    <div class="flex justify-between pt-[50px] lg:pt-[100px] min-w-[670px] gap-4">
      <div class="flex items-center gap-4">
        <IconOrder />
        <div class="text-primary-900 text-4xl font-semibold">주문 조회</div>
      </div>

      <!-- For Admin -->
      <div v-if="isAdmin" class="flex justify-between min-w-[420px] items-center gap-4">
        <div class="flex-shrink-0 text-xl font-semibold">학과 선택:</div>
        <select
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          v-model="boothId"
        >
          <option v-for="(booth, boothIndex) in boothList" :key="boothIndex" :value="booth.boothId">
            {{ booth.adminName }} - {{ booth.boothName }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex gap-[10px] overflow-x-auto pb-[40px]">
      <button
        type="button"
        class="min-w-[120px] w-[200px] h-[50px] is-button no-scroll"
        :class="{
          'is-outlined': orderStatus !== orderCategory,
        }"
        @click="setOrderStatus(orderCategory)"
        v-for="(orderCategory, orderCategoryIndex) in orderCategories"
        :key="orderCategoryIndex"
      >
        <div class="relative">
          {{ ORDER_CATEGORY[orderCategory] }}
          <!-- 실시간 빨간 점 -->
          <div
            v-if="orderCategory === 'realTime' && orderStatus != 'realTime' && isNewOrderExist"
            class="absolute bg-secondary-200 w-4 h-4 rounded-full top-[6px] right-3"
          ></div>
        </div>
      </button>
    </div>

    <!-- 테이블 주문 현황 -->
    <div v-if="!isStatistics" class="flex flex-col relative">
      <div class="flex w-full justify-end" @click="handleClickTableRefresh()">
        <IconRefresh class="mb-3 cursor-pointer" />
      </div>
      <div
        class="flex flex-col w-full rounded-2xl shadow-secondary relative outline outline-1 outline-primary-500 bg-white"
      >
        <!-- Thead -->
        <div
          class="w-full h-[50px] bg-secondary-500 flex items-center justify-center rounded-t-2xl border-b-1 border-primary-500"
        >
          테이블 주문 현황
        </div>
        <!-- Tbody -->
        <div class="w-full flex flex-wrap rounded-b-2xl relative h-[370px] divide-x-2 mb-4 px-5">
          <div v-for="(per, perIndex) in orderPerRow" class="min-w-[300px] shrink-0 relative grow" :per>
            <table class="w-full">
              <thead class="text-sm align-middle border-b-2">
                <tr class="h-[47px]">
                  <th>테이블 번호</th>
                  <th>서빙 현황</th>
                  <th>주문 내역</th>
                  <th>완료</th>
                </tr>
              </thead>
              <tbody class="text-sm align-middle text-center">
                <tr
                  v-for="(tableOrder, tableOrderIndex) in chunkedAllTableOrders[perIndex]"
                  class="border-b h-[47px] last:border-none hover:bg-slate-50 shrink-0"
                  :tableOrderIndex
                >
                  <td>{{ getCustomTableNum(tableOrder.tableNum) }}번</td>
                  <td>{{ tableOrder.servedCount }}/{{ tableOrder.totalCount }}</td>
                  <td>
                    <div class="flex justify-center items-center">
                      <IconOrderDetail @click="handleClickOrderDetail(tableOrder.orderId, tableOrder.orderType)" />
                    </div>
                  </td>
                  <td>
                    <div class="flex justify-center items-center">
                      <IconOrderCheck
                        :is-active="isFinish(tableOrder)"
                        :class="{ 'cursor-not-allowed': !isFinish(tableOrder) }"
                        @click="handleClickOrderFinish(tableOrder, tableOrder.orderId, tableOrder.orderType)"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="absolute bottom-[-36px] right-0 text-xl text-secondary-700-light font-semibold">
          {{ allTableOrders.length }}/{{ 7 * orderPerRow }}
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped></style>

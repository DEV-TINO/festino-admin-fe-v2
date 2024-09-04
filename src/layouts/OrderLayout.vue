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
import { useServiceModal } from '@/stores/orders/serviceModal';
import { useUser } from '@/stores/user';
import { api } from '@/utils/api';
import { ORDER_CATEGORY, ORDER_URL, TABLE_FILTER } from '@/utils/constants';
import { chunkArray, getHourandMinute } from '@/utils/utils';
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
const useServiceModalStore = useServiceModal();

const { getAllBoothList } = useBoothListStore;
const { setOrderStatus, getAllTableOrders, initBaseOrder } = useBaseOrderStore;
const { openPopup } = useOrderPopupStore;
const { getWaitDepositOrderList } = useDepositOrderStore;
const { getTableList, getCustomTableNum } = useTableDetailStore;
const { openServiceModal } = useServiceModalStore;

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
const selectedFilterMenu = ref(TABLE_FILTER['timeAsc']);
const pageIndex = ref(1);

const { width } = useWindowSize();

const orderPerCol = computed(() => {
  if (width.value < 950) return 2;
  else if (width.value < 1550) return 3;
  else if (width.value < 1800) return 4;
  else if (width.value < 2050) return 5;
  else return 6;
});

const gridColumnStyle = computed(() => {
  return {
    'grid-template-columns': `repeat(${orderPerCol.value}, 1fr)`,
  };
});

const maxPageIndex = computed(() => {
  return Math.ceil(allTableOrders.value.length / (orderPerCol.value * 2));
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
        createAt: orderInfo.createAt,
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
        createAt: orderInfo.createAt,
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

watchEffect(() => {
  if (selectedFilterMenu.value === TABLE_FILTER['timeAsc']) {
    allTableOrders.value.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
  } else if (selectedFilterMenu.value === TABLE_FILTER['timeDesc']) {
    allTableOrders.value.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
  }
});

watchEffect(async () => {
  if (boothId.value) {
    await getAllTableOrders({
      boothId: boothId.value,
      date: 0,
    });
  }
});

watchEffect(() => {
  chunkedAllTableOrders.value = chunkArray(allTableOrders.value, orderPerCol.value * 2);
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
        <div class="text-primary-900 text-xl md:text-2xl font-semibold">주문 조회</div>
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
        class="is-button w-[120px] h-[40px] relative text-sm rounded-[16px]"
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
            class="absolute bg-secondary-200 w-3 h-3 rounded-full top-[4px] right-4"
          ></div>
        </div>
      </button>
    </div>

    <!-- 테이블 주문 현황 -->
    <div v-if="!isStatistics" class="flex flex-col relative">
      <!-- Header -->
      <div class="flex justify-between items-center pb-[10px]">
        <div class="flex gap-[14px]">
          <div
            v-for="(filter, filterIndex) in TABLE_FILTER"
            :key="filterIndex"
            class="cursor-pointer"
            :class="selectedFilterMenu === filter ? 'font-bold text-secondary-700' : 'text-secondary-700-light'"
            @click="selectedFilterMenu = filter"
          >
            {{ filter }}
          </div>
        </div>
        <!-- Table Header -->
        <div class="flex gap-[14px] justify-center items-center">
          <button type="button" class="is-button w-[100px] h-[40px] rounded-[16px] text-sm" @click="openServiceModal()">
            주문 추가
          </button>
          <IconRefresh class="w-6 h-6 cursor-pointer" @click="handleClickTableRefresh()" />
        </div>
      </div>
      <!-- Orders -->
      <div class="bg-primary-700-light rounded-2xl p-8">
        <div class="flex justify-between items-center">
          <div class="xl:w-[207px] w-[160px]"></div>
          <div class="font-bold text-primary-800 xl:text-2xl text-xl">테이블 주문 현황</div>
          <div
            class="xl:w-[207px] w-[160px] h-[54px] bg-white rounded-2xl flex justify-center items-center cursor-pointer gap-3"
          >
            <div class="text-secondary-700-lighter font-bold">현재 주문 수</div>
            <div class="text-[22px] font-bold text-primary-800">{{ allTableOrders.length }}개</div>
          </div>
        </div>
        <div class="py-7 grid gap-x-[22px] gap-y-4 place-items-center grid-rows-2" :style="gridColumnStyle">
          <!-- Order -->
          <div
            v-for="(tableOrder, tableOrderIndex) in chunkedAllTableOrders[pageIndex - 1]"
            :key="tableOrderIndex"
            class="w-[240px] h-[124px] bg-white rounded-2xl p-[18px] flex justify-between font-bold"
          >
            <div class="flex flex-col justify-between">
              <div class="flex-col">
                <div class="text-2xs text-secondary-700-lighter">테이블</div>
                <div class="text-xl text-primary-900-lighter -translate-y-1">
                  {{ getCustomTableNum(tableOrder.tableNum) }}번
                </div>
              </div>
              <div class="flex-col">
                <div class="text-2xs text-secondary-700-lighter translate-y-1">주문시간</div>
                <div class="text-xl text-primary-900-lighter">
                  <!-- {{ tableOrder }} -->
                  {{ getHourandMinute(tableOrder.createAt) }}
                </div>
              </div>
            </div>
            <div class="grid grid-rows-3 text-secondary-700-light text-sm w-[100px]">
              <!-- 서빙현황 -->
              <div class="flex items-start justify-between">
                <div class="text-left">서빙현황</div>
                <div class="text-right font-normal">{{ tableOrder.servedCount }}/{{ tableOrder.totalCount }}</div>
              </div>
              <!-- 주문내역 -->
              <div class="flex items-center justify-between">
                <div class="text-left">주문내역</div>
                <IconOrderDetail
                  class="justify-self-end -translate-x-[3px]"
                  @click="handleClickOrderDetail(tableOrder.orderId, tableOrder.orderType)"
                />
              </div>
              <!-- 완료 -->
              <div class="flex items-end justify-between">
                <div class="text-left">완료</div>
                <IconOrderCheck
                  class="justify-self-end"
                  :is-active="isFinish(tableOrder)"
                  :class="{ 'cursor-not-allowed': !isFinish(tableOrder) }"
                  @click="handleClickOrderFinish(tableOrder, tableOrder.orderId, tableOrder.orderType)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center items-center text-xl font-medium text-secondary-900">
          <div
            v-for="(page, index) in maxPageIndex"
            @click="pageIndex = page"
            class="w-10 h-10 flex justify-center items-center cursor-pointer"
            :class="pageIndex === page ? 'bg-primary-900-light rounded-full text-white' : ''"
          >
            {{ page }}
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useDepositOrder } from '@/stores/orders/depositOrder';
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { storeToRefs } from 'pinia';
import IconNotFound from '@/components/icons/IconNotFound.vue';
import OrderReadyCard from '@/components/orders/OrderReadyCard.vue';
import { ORDER_FILTER } from '@/utils/constants';
import IconRefreshVector from '@/components/icons/IconRefreshVector.vue';
import IconSearch from '@/components/icons/IconSearch.vue';
import { useDate } from '@/stores/date';

const useDepositOrderStore = useDepositOrder();
const useBaseOrderStore = useBaseOrder();
const useDateStore = useDate();

const { getWaitDepositOrderList, initDepositOrder } = useDepositOrderStore;

const { waitDepositOrderList } = storeToRefs(useDepositOrderStore);
const { boothId } = storeToRefs(useBaseOrderStore);
const { nowDate } = storeToRefs(useDateStore);

const selectedFilterMenu = ref(ORDER_FILTER['all']);
const searchMenu = ref('');

const isFocus = ref(false);
const filteredMenuList = ref([]);

const updateFilteredMenuList = () => {
  let filteredList = [...waitDepositOrderList.value];

  if (searchMenu.value) {
    filteredList = filteredList.filter((order) => {
      const basicInfo = `${order.tableNum}${order.userName}${order.phoneNum}`;
      const menuNames = order.menuList.map((menu) => menu.menuName).join('');
      return basicInfo.includes(searchMenu.value) || menuNames.includes(searchMenu.value);
    });
  }

  if (selectedFilterMenu.value === ORDER_FILTER.table) {
    filteredList.sort((a, b) => b.tableNum - a.tableNum);
  } else if (selectedFilterMenu.value === ORDER_FILTER.price) {
    filteredList.sort((a, b) => b.totalPrice - a.totalPrice);
  } else if (selectedFilterMenu.value === ORDER_FILTER.recent) {
    filteredList.sort((a, b) => b.createAt.localeCompare(a.createAt));
  }

  filteredMenuList.value = filteredList;
};

const handleClickRefreshButton = async () => {
  await getWaitDepositOrderList({
    boothId: boothId.value,
    date: nowDate.value,
  });
};

watch([waitDepositOrderList, selectedFilterMenu, searchMenu], () => {
  updateFilteredMenuList();
});

watchEffect(async () => {
  if (boothId.value) {
    await getWaitDepositOrderList({
      boothId: boothId.value,
      date: nowDate.value,
    });
  }
});

onMounted(async () => {
  await initDepositOrder();
  await getWaitDepositOrderList({
    boothId: boothId.value,
    date: nowDate.value,
  });
});
</script>

<template>
  <div class="w-full flex justify-between">
    <div class="min-w-[320px] flex items-center mr-5">
      <div class="flex gap-[13px] px-5">
        <div
          v-for="(orderMenu, index) in ORDER_FILTER"
          :key="index"
          class="cursor-pointer text-sm"
          :class="selectedFilterMenu === orderMenu ? 'font-bold' : ''"
          @click="selectedFilterMenu = orderMenu"
        >
          {{ orderMenu }}
        </div>
      </div>
      <div
        class="is-button w-[90px] h-[30px] gap-1 text-xs flex justify-center items-center cursor-pointer"
        @click="handleClickRefreshButton()"
      >
        <IconRefreshVector class="w-4 h-4 p-[2px]" />
        새로고침
      </div>
    </div>
    <div
      class="w-[350px] h-[40px] rounded-xl flex items-center px-[11px] bg-white gap-1 outline"
      :class="{ 'outline-primary-900 outline-2': isFocus, 'outline-gray-300 outline-1': !isFocus }"
      @focusin="isFocus = true"
      @focusout="isFocus = false"
    >
      <IconSearch />
      <input v-model="searchMenu" placeholder="주문 검색" class="grow focus:outline-none focus:border-none text-sm" />
      <button class="w-[75px] h-[30px] rounded-xl text-sm bg-primary-900 text-white">Search</button>
    </div>
  </div>
  <div class="grid 2xl:grid-cols-3 lg:grid-cols-2 place-items-center gap-10">
    <OrderReadyCard
      v-for="(waitDepositOrder, waitDepositOrderIndex) in filteredMenuList"
      :key="waitDepositOrderIndex"
      v-bind="waitDepositOrder"
    />

    <div v-if="filteredMenuList.length < 1" class="flex flex-col justify-center items-center">
      <IconNotFound :width="200" />
      <div class="text-lg text-gray-500 pt-3">입금 대기중인 주문이 없어요...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

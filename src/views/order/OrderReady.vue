<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import { useDepositOrder } from '@/stores/orders/depositOrder';
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { storeToRefs } from 'pinia';
import IconNotFound from '@/components/icons/IconNotFound.vue';
import OrderReadyCard from '@/components/orders/OrderReadyCard.vue';
import { ORDER_FILTER } from '@/utils/constants';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import IconRefreshVector from '@/components/icons/IconRefreshVector.vue';
import IconSearch from '@/components/icons/IconSearch.vue';

const useDepositOrderStore = useDepositOrder();
const useBaseOrderStore = useBaseOrder();

const { getWaitDepositOrderList, initDepositOrder } = useDepositOrderStore;

const { waitDepositOrderList } = storeToRefs(useDepositOrderStore);
const { boothId } = storeToRefs(useBaseOrderStore);

const selectedFilterMenu = ref(ORDER_FILTER['all']);
const searchMenu = ref('');

const filteredMenuList = computed(() => {
  let sortedList = [...waitDepositOrderList.value];
  if (selectedFilterMenu.value === ORDER_FILTER.table) {
    sortedList.sort((a, b) => a.tableNum - b.tableNum);
  } else if (selectedFilterMenu.value === ORDER_FILTER.price) {
    sortedList.sort((a, b) => a.totalPrice - b.totalPrice);
  }
  return sortedList;
});

const handleClickFilterMenu = (orderMenu) => {
  selectedFilterMenu.value = orderMenu;
};

onMounted(async () => {
  initDepositOrder();
  await getWaitDepositOrderList({
    boothId: boothId.value,
    date: 0,
  });
});
</script>

<template>
  <div class="w-full flex justify-between">
    <div class="flex items-center">
      <div class="flex gap-[13px] px-5">
        <div
          v-for="(orderMenu, index) in ORDER_FILTER"
          :key="index"
          class="cursor-pointer text-xl"
          :class="selectedFilterMenu === orderMenu ? 'font-bold' : ''"
          @click="handleClickFilterMenu(orderMenu)"
        >
          {{ orderMenu }}
        </div>
      </div>
      <div class="is-button w-[94px] h-[30px] gap-1 text-sm flex justify-center items-center cursor-pointer">
        <IconRefreshVector />
        새로고침
      </div>
    </div>
    <div
      class="w-[410px] h-[40px] rounded-xl outline outline-1 outline-primary-900 flex items-center px-[11px] bg-white gap-1"
    >
      <IconSearch />
      <input :value="searchMenu" @input="searchMenu = $event.target.value" placeholder="주문 검색" class="grow" />
      <button class="w-[75px] h-[30px] rounded-[4px] bg-primary-900 text-white">Search</button>
    </div>
  </div>
  <div class="grid 2xl:grid-cols-3 lg:grid-cols-2 place-items-center gap-10">
    <OrderReadyCard
      v-for="(waitDepositOrder, waitDepositOrderIndex) in filteredMenuList"
      :key="waitDepositOrderIndex"
      v-bind="waitDepositOrder"
    />

    <div v-if="waitDepositOrderList.length < 1" class="flex flex-col justify-center items-center">
      <IconNotFound :width="200" />
      <div class="text-lg text-gray-500">입금 대기중인 주문이 없어요...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

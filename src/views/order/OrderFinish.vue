<script setup>
import { onMounted, ref, watch } from 'vue';
import { useFinishOrder } from '@/stores/orders/finishOrder';
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { storeToRefs } from 'pinia';
import IconNotFound from '@/components/icons/IconNotFound.vue';
import OrderFinishCard from '@/components/orders/OrderFinishCard.vue';
import IconRefreshVector from '@/components/icons/IconRefreshVector.vue';
import IconSearch from '@/components/icons/IconSearch.vue';
import { ORDER_FILTER } from '@/utils/constants';

const useFinishOrderStore = useFinishOrder();
const useBaseOrderStore = useBaseOrder();

const { getFinishOrderList, initFinishOrderList } = useFinishOrderStore;

const { finishOrderList } = storeToRefs(useFinishOrderStore);
const { boothId } = storeToRefs(useBaseOrderStore);

const selectedFilterMenu = ref(ORDER_FILTER['all']);
const searchMenu = ref('');

const isFocus = ref(false);
const filteredMenuList = ref([]);

const updateFilteredMenuList = () => {
  let filteredList = [...finishOrderList.value];

  if (searchMenu.value) {
    filteredList = filteredList.filter((order) => {
      const basicInfo = `${order.tableNum}${order.userName}${order.phoneNum}`;
      const menuNames = order.menuList.map((menu) => menu.menuName).join('');
      return basicInfo.includes(searchMenu.value) || menuNames.includes(searchMenu.value);
    });
  }

  if (selectedFilterMenu.value === ORDER_FILTER.table) {
    filteredList.sort((a, b) => a.tableNum - b.tableNum);
  } else if (selectedFilterMenu.value === ORDER_FILTER.price) {
    filteredList.sort((a, b) => a.totalPrice - b.totalPrice);
  }

  filteredMenuList.value = filteredList;
};

const handleClickRefreshButton = async () => {
  await getFinishOrderList({
    boothId: boothId.value,
    date: 0,
  });
};

watch([finishOrderList, selectedFilterMenu, searchMenu], () => {
  updateFilteredMenuList();
});

onMounted(async () => {
  initFinishOrderList();
  await getFinishOrderList({
    boothId: boothId.value,
    date: 0,
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
      class="w-[410px] h-[40px] rounded-xl flex items-center px-[11px] bg-white gap-1 outline"
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
    <OrderFinishCard
      v-for="(finishOrder, finishOrderIndex) in filteredMenuList"
      :key="finishOrderIndex"
      v-bind="finishOrder"
    />

    <div v-if="filteredMenuList.length < 1" class="flex flex-col justify-center items-center">
      <IconNotFound :width="200" />
      <div class="text-lg text-gray-500">조리 완료된 주문이 없어요...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

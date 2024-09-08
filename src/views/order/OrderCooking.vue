<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useCookingOrder } from '@/stores/orders/cookingOrder';
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { storeToRefs } from 'pinia';
import IconNotFound from '@/components/icons/IconNotFound.vue';
import OrderCookingCard from '@/components/orders/OrderCookingCard.vue';
import { useDate } from '@/stores/date';

const useCookingOrderStore = useCookingOrder();
const useBaseOrderStore = useBaseOrder();
const useDateStore = useDate();

const { getCookingOrderList, initCookingOrderList } = useCookingOrderStore;

const { cookingOrderList } = storeToRefs(useCookingOrderStore);
const { boothId } = storeToRefs(useBaseOrderStore);
const { nowDate } = storeToRefs(useDateStore);

const interval = ref(null);

const refreshCookingOrderList = async () => {
  interval.value = setInterval(async () => {
    await getCookingOrderList({
      boothId: boothId.value,
      date: nowDate.value,
    });
  }, 3000);
};

const clearCookingOrderListInterval = () => {
  if (!interval.value) return;
  clearInterval(interval.value);
};

onMounted(async () => {
  initCookingOrderList();
  await getCookingOrderList({
    boothId: boothId.value,
    date: nowDate.value,
  });
  refreshCookingOrderList();
});

onUnmounted(() => {
  clearCookingOrderListInterval();
});
</script>

<template>
  <div class="flex gap-4 items-center">
    <div class="w-[14px] h-[14px] rounded-full bg-primary-900"></div>
    <div class="text-md font-semibold">조리 중</div>
  </div>
  <div class="grid 2xl:grid-cols-3 lg:grid-cols-2 place-items-center gap-10">
    <OrderCookingCard
      v-for="(cookingOrder, cookingOrderIndex) in cookingOrderList"
      :key="cookingOrderIndex"
      v-bind="cookingOrder"
      class="shrink-0"
    />

    <div v-if="cookingOrderList.length < 1" class="flex flex-col justify-center items-center">
      <IconNotFound :width="200" />
      <div class="text-lg text-gray-500">조리할 메뉴가 없어요...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

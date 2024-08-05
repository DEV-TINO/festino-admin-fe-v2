<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useCookingOrder } from '@/stores/orders/cookingOrder';
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { storeToRefs } from 'pinia';
import IconNotFound from '@/components/icons/IconNotFound.vue';
import OrderCookingCard from '@/components/orders/OrderCookingCard.vue';

const useCookingOrderStore = useCookingOrder();
const useBaseOrderStore = useBaseOrder();

const { getCookingOrderList, initCookingOrderList } = useCookingOrderStore;

const { cookingOrderList } = storeToRefs(useCookingOrderStore);
const { boothId } = storeToRefs(useBaseOrderStore);

const interval = ref(null);

const refreshCookingOrderList = async () => {
  interval.value = setInterval(async () => {
    await getCookingOrderList({
      boothId: boothId.value,
      date: 0,
    });
  }, 5000);
};

const clearCookingOrderListInterval = () => {
  if (!interval.value) return;
  clearInterval(interval.value);
};

onMounted(async () => {
  initCookingOrderList();
  await getCookingOrderList({
    boothId: boothId.value,
    date: 0,
  });
  refreshCookingOrderList();
});

onUnmounted(() => {
  clearCookingOrderListInterval();
});
</script>

<template>
  <div class="flex gap-4 items-center">
    <div class="w-[20px] h-[20px] rounded-full bg-primary-900"></div>
    <div class="text-lg">조리 중</div>
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

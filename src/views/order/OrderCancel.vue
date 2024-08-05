<script setup>
import { onMounted } from 'vue';
import { useCancelOrder } from '@/stores/orders/cancelOrder';
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { storeToRefs } from 'pinia';
import IconNotFound from '@/components/icons/IconNotFound.vue';
import OrderCancelCard from '@/components/orders/OrderCancelCard.vue';

const useCancelOrderStore = useCancelOrder();
const useBaseOrderStore = useBaseOrder();

const { getCancelOrderList, initCancelOrderList } = useCancelOrderStore;

const { cancelOrderList } = storeToRefs(useCancelOrderStore);
const { boothId } = storeToRefs(useBaseOrderStore);

onMounted(async () => {
  initCancelOrderList();
  await getCancelOrderList({
    boothId: boothId.value,
    date: 0,
  });
});
</script>

<template>
  <div class="flex gap-4 items-center">
    <div class="w-[20px] h-[20px] rounded-full bg-cancel-light"></div>
    <div class="text-lg">주문 취소</div>
  </div>
  <div class="grid 2xl:grid-cols-3 lg:grid-cols-2 place-items-center gap-10">
    <OrderCancelCard
      v-for="(cancelOrder, cancelOrderIndex) in cancelOrderList"
      :key="cancelOrderIndex"
      v-bind="cancelOrder"
    />

    <div v-if="cancelOrderList.length < 1" class="flex flex-col justify-center items-center">
      <IconNotFound :width="200" />
      <div class="text-lg text-gray-500">주문 취소된 주문이 없어요...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

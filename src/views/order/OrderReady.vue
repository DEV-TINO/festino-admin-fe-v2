<script setup>
import { onMounted } from 'vue';
import { useDepositOrder } from '@/stores/orders/depositOrder';
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { storeToRefs } from 'pinia';
import IconNotFound from '@/components/icons/IconNotFound.vue';
import OrderReadyCard from '@/components/orders/OrderReadyCard.vue';

const useDepositOrderStore = useDepositOrder();
const useBaseOrderStore = useBaseOrder();

const { getWaitDepositOrderList, initDepositOrder } = useDepositOrderStore;

const { waitDepositOrderList } = storeToRefs(useDepositOrderStore);
const { boothId } = storeToRefs(useBaseOrderStore);

onMounted(async () => {
  console.log('OrderReady onMounted');
  initDepositOrder();
  await getWaitDepositOrderList({
    boothId: boothId.value,
    date: 0,
  });
});
</script>

<template>
  <div class="flex gap-4 items-center">
    <div class="w-[20px] h-[20px] rounded-full bg-danger"></div>
    <div class="text-lg">입금 대기</div>
  </div>
  <div class="grid 2xl:grid-cols-3 lg:grid-cols-2 place-items-center gap-10">
    <OrderReadyCard
      v-for="(waitDepositOrder, waitDepositOrderIndex) in waitDepositOrderList"
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

<script setup>
import { onMounted } from 'vue';
import { useFinishOrder } from '@/stores/orders/finishOrder';
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { storeToRefs } from 'pinia';
import IconNotFound from '@/components/icons/IconNotFound.vue';
import OrderFinishCard from '@/components/orders/OrderFinishCard.vue';

const useFinishOrderStore = useFinishOrder();
const useBaseOrderStore = useBaseOrder();

const { getFinishOrderList, initFinishOrderList } = useFinishOrderStore;

const { finishOrderList } = storeToRefs(useFinishOrderStore);
const { boothId } = storeToRefs(useBaseOrderStore);

onMounted(async () => {
  initFinishOrderList();
  await getFinishOrderList({
    boothId: boothId.value,
    date: 0,
  });
});
</script>

<template>
  <div class="flex gap-4 items-center">
    <div class="w-[20px] h-[20px] rounded-full bg-success"></div>
    <div class="text-lg">조리 완료</div>
  </div>
  <div class="grid 2xl:grid-cols-3 lg:grid-cols-2 place-items-center gap-10">
    <OrderFinishCard
      v-for="(finishOrder, finishOrderIndex) in finishOrderList"
      :key="finishOrderIndex"
      v-bind="finishOrder"
    />

    <div v-if="finishOrderList.length < 1" class="flex flex-col justify-center items-center">
      <IconNotFound :width="200" />
      <div class="text-lg text-gray-500">조리 완료된 주문이 없어요...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

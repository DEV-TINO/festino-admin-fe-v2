<script setup>
import IconNotFound from '@/components/icons/IconNotFound.vue';
import OrderCard from '@/components/orders/OrderCard.vue';
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { useCookingOrder } from '@/stores/orders/cookingOrder';
import { useDepositOrder } from '@/stores/orders/depositOrder';
import { useFinishOrder } from '@/stores/orders/finishOrder';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';

const useBaseOrderStore = useBaseOrder();
const useDepositOrderStore = useDepositOrder();
const useCookingOrderStore = useCookingOrder();
const useFinishOrderStore = useFinishOrder();

const { getWaitDepositOrderList, initDepositOrder } = useDepositOrderStore;
const { getCookingOrderList, initCookingOrderList } = useCookingOrderStore;
const { getFinishOrderList, initFinishOrderList } = useFinishOrderStore;

const { waitDepositOrderList } = storeToRefs(useDepositOrderStore);
const { cookingOrderList } = storeToRefs(useCookingOrderStore);
const { finishOrderList } = storeToRefs(useFinishOrderStore);
const { boothId } = storeToRefs(useBaseOrderStore);

const interval = ref(null);

const getAllOrderList = async () => {
  await Promise.allSettled([
    getCookingOrderList({
      boothId: boothId.value,
      date: 0,
    }),
    getWaitDepositOrderList({
      boothId: boothId.value,
      date: 0,
    }),
    getFinishOrderList({
      boothId: boothId.value,
      date: 0,
    }),
  ]);
};

const refreshOrderList = () => {
  interval.value = setInterval(async () => {
    if (boothId.value) {
      await getAllOrderList();
    }
  }, 5000);
};

const clearRefereshOrderList = () => {
  if (!interval.value) return;
  clearInterval(interval.value);
};

watchEffect(async () => {
  if (boothId.value) {
    await getAllOrderList();
    refreshOrderList();
  }
});

onMounted(async () => {
  console.log('OrderRealTime onMounted');
  initDepositOrder();
  initCookingOrderList();
  initFinishOrderList();
});

onUnmounted(() => {
  console.log('OrderRealTime onUnmounted');
  clearRefereshOrderList();
});
</script>

<template>
  <div class="w-full flex justify-between gap-[20px] flex-wrap">
    <div class="flex flex-col grow gap-4 w-full 2xl:w-fit">
      <div class="flex gap-4 items-center">
        <div class="w-[20px] h-[20px] rounded-full bg-danger"></div>
        <div class="text-lg">입금 대기</div>
      </div>
      <div
        class="min-w-[478px] flex 2xl:flex-col rounded-xl bg-danger-lighter gap-[40px] py-[40px] px-[24px] 2xl:justify-center 2xl:items-center overflow-x-auto"
      >
        <OrderCard
          type="ready"
          :card-data="waitDepositOrder"
          v-for="(waitDepositOrder, waitDepositOrderIndex) in waitDepositOrderList"
          :key="waitDepositOrderIndex"
        ></OrderCard>
        <div v-if="waitDepositOrderList.length < 1" class="flex flex-col justify-center items-center">
          <IconNotFound :width="200" />
          <div class="text-lg text-gray-500">입금 대기중인 주문이 없어요...</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col grow gap-4 w-full 2xl:w-fit">
      <div class="flex gap-4 items-center">
        <div class="w-[20px] h-[20px] rounded-full bg-primary-900"></div>
        <div class="text-lg">조리중</div>
      </div>
      <div
        class="min-w-[478px] flex 2xl:flex-col rounded-xl bg-primary-500 gap-[40px] py-[40px] px-[24px] 2xl:justify-center 2xl:items-center overflow-x-auto"
      >
        <OrderCard
          type="cooking"
          :card-data="cookingOrder"
          v-for="(cookingOrder, cookingOrderIndex) in cookingOrderList"
          :key="cookingOrderIndex"
        ></OrderCard>
        <div v-if="cookingOrderList.length < 1" class="flex flex-col justify-center items-center">
          <IconNotFound :width="200" />
          <div class="text-lg text-gray-500">조리할 메뉴가 없어요...</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col grow gap-4 w-full 2xl:w-fit">
      <div class="flex gap-4 items-center">
        <div class="w-[20px] h-[20px] rounded-full bg-success"></div>
        <div class="text-lg">조리 완료</div>
      </div>
      <div
        class="min-w-[478px] flex 2xl:flex-col rounded-xl bg-success-500 gap-[40px] py-[40px] px-[24px] 2xl:justify-center 2xl:items-center overflow-x-auto"
      >
        <OrderCard
          type="finish"
          :card-data="finishOrder"
          v-for="(finishOrder, finishOrderIndex) in finishOrderList"
          :key="finishOrderIndex"
        ></OrderCard>
        <div v-if="finishOrderList.length < 1" class="flex flex-col justify-center items-center">
          <IconNotFound :width="200" />
          <div class="text-lg text-gray-500">조리 완료된 주문이 없어요...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

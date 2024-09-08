<script setup>
import IconNotFound from '@/components/icons/IconNotFound.vue';
import OrderCard from '@/components/orders/OrderCard.vue';
import { useDate } from '@/stores/date';
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { useCookingOrder } from '@/stores/orders/cookingOrder';
import { useDepositOrder } from '@/stores/orders/depositOrder';
import { useFinishOrder } from '@/stores/orders/finishOrder';
import { cloneDeep } from 'lodash';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';

const useBaseOrderStore = useBaseOrder();
const useDepositOrderStore = useDepositOrder();
const useCookingOrderStore = useCookingOrder();
const useFinishOrderStore = useFinishOrder();
const useDateStore = useDate();

const { getWaitDepositOrderList, initDepositOrder } = useDepositOrderStore;
const { getCookingOrderList, initCookingOrderList } = useCookingOrderStore;
const { getFinishOrderList, initFinishOrderList } = useFinishOrderStore;

const { waitDepositOrderList } = storeToRefs(useDepositOrderStore);
const { cookingOrderList } = storeToRefs(useCookingOrderStore);
const { finishOrderList } = storeToRefs(useFinishOrderStore);
const { boothId } = storeToRefs(useBaseOrderStore);
const { nowDate } = storeToRefs(useDateStore);

const interval = ref(null);
const isFirstLoad = ref(true);
const isNewWaitDepositExist = ref(false);
const prevWaitDepositList = ref([]);

const getAllOrderList = async () => {
  await Promise.allSettled([
    getCookingOrderList({
      boothId: boothId.value,
      date: nowDate.value,
    }),
    getWaitDepositOrderList({
      boothId: boothId.value,
      date: nowDate.value,
    }),
    getFinishOrderList({
      boothId: boothId.value,
      date: nowDate.value,
    }),
  ]);
};

const refreshOrderList = () => {
  interval.value = setInterval(async () => {
    if (boothId.value) {
      await getAllOrderList();
    }
  }, 3000);
};

const clearRefereshOrderList = () => {
  if (!interval.value) return;
  clearInterval(interval.value);
};

const initExistStatus = () => {
  prevWaitDepositList.value = [];
  isNewWaitDepositExist.value = false;
  isFirstLoad.value = true;
};

watchEffect(async () => {
  if (boothId.value) {
    await getAllOrderList();
  }
});

watchEffect(() => {
  if (prevWaitDepositList.value.length < waitDepositOrderList.value.length) {
    prevWaitDepositList.value = cloneDeep(waitDepositOrderList.value);
    if (isFirstLoad.value) return (isFirstLoad.value = false);
    isNewWaitDepositExist.value = true;
  }
});

onMounted(async () => {
  initExistStatus();
  initDepositOrder();
  initCookingOrderList();
  initFinishOrderList();
  refreshOrderList();
});

onUnmounted(() => {
  clearRefereshOrderList();
});
</script>

<template>
  <div class="w-full flex justify-between gap-[20px] max-3xl:flex-col">
    <div class="flex flex-col grow gap-4 w-full 2xl:w-fit">
      <div class="flex gap-2 items-center">
        <div class="w-[14px] h-[14px] rounded-full bg-danger"></div>
        <div class="text-md font-semibold">입금 대기</div>
        <div v-if="isNewWaitDepositExist" class="text-sm text-danger pl-5">새로운 입금 대기가 들어왔어요!</div>
      </div>
      <div
        class="min-w-full flex 3xl:flex-col rounded-xl bg-danger-lighter gap-[40px] py-[30px] px-[20px] 3xl:justify-center 3xl:items-center overflow-x-auto 3xl:w-[420px]"
      >
        <OrderCard
          type="ready"
          :card-data="waitDepositOrder"
          v-for="(waitDepositOrder, waitDepositOrderIndex) in waitDepositOrderList"
          :key="waitDepositOrderIndex"
        ></OrderCard>
        <div v-if="waitDepositOrderList.length < 1" class="flex flex-col justify-center items-center">
          <IconNotFound :width="200" />
          <div class="text-md text-gray-500 pt-3">입금 대기중인 주문이 없어요...</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col grow gap-4 w-full 2xl:w-fit">
      <div class="flex gap-2 items-center">
        <div class="w-[14px] h-[14px] rounded-full bg-primary-900"></div>
        <div class="text-md font-semibold">조리중</div>
      </div>
      <div
        class="min-w-full flex 3xl:flex-col rounded-xl bg-primary-500 gap-[40px] py-[30px] px-[20px] 3xl:justify-center 3xl:items-center overflow-x-auto 3xl:w-[420px]"
      >
        <OrderCard
          type="cooking"
          :card-data="cookingOrder"
          v-for="(cookingOrder, cookingOrderIndex) in cookingOrderList"
          :key="cookingOrderIndex"
        ></OrderCard>
        <div v-if="cookingOrderList.length < 1" class="flex flex-col justify-center items-center">
          <IconNotFound :width="200" />
          <div class="text-md text-gray-500 pt-3">조리할 메뉴가 없어요...</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col grow gap-4 w-full 2xl:w-fit">
      <div class="flex gap-4 items-center">
        <div class="w-[20px] h-[20px] rounded-full bg-success"></div>
        <div class="text-md font-semibold">조리 완료</div>
      </div>
      <div
        class="min-w-full flex 3xl:flex-col rounded-xl bg-success-500 gap-[40px] py-[30px] px-[20px] 3xl:justify-center 3xl:items-center overflow-x-auto 3xl:w-[420px]"
      >
        <OrderCard
          type="finish"
          :card-data="finishOrder"
          v-for="(finishOrder, finishOrderIndex) in finishOrderList"
          :key="finishOrderIndex"
        ></OrderCard>
        <div v-if="finishOrderList.length < 1" class="flex flex-col justify-center items-center">
          <IconNotFound :width="200" />
          <div class="text-md text-gray-500 pt-3">조리 완료된 주문이 없어요...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

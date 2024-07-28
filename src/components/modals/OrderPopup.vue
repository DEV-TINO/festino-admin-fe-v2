<script setup>
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { ORDER_STATUS } from '@/utils/constants';
import { prettyMenuNum, prettyPhoneNumber, prettyPrice } from '@/utils/utils';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watchEffect } from 'vue';

const useOrderPopupStore = useOrderPopup();
const { submitPopup, closePopup } = useOrderPopupStore;
const { selectType, menuInfoList, orderInfo, cookingInfo } = storeToRefs(useOrderPopupStore);

const isSubmit = ref(false);
const submit = ref(null);

const handleSubmit = async (event) => {
  console.log('[OrderPopup] handleSubmit');
  const submitType = event.submitter.value;
  console.log('[OrderPopup] submitType:', submitType, 'isSubmit:', isSubmit.value);
  if (isSubmit.value) return;
  submit.value = true;
  await submitPopup({
    type: submitType,
  });
  isSubmit.value = false;
};

watchEffect(() => {
  console.log('[OrderPopup] selectType:', selectType.value);
  console.log('[OrderPopup] menuInfoList:', menuInfoList.value);
  console.log('[OrderPopup] orderInfo:', orderInfo.value);
  console.log('[OrderPopup] cookingInfo:', cookingInfo.value);
});

onMounted(() => {
  submit.value?.focus();
});
</script>
<template>
  <form @submit.prevent="handleSubmit($event)">
    <div
      class="w-[880px] min-h-[350px] bg-white shadow-primary rounded-2xl flex flex-col justify-between gap-[20px] px-[40px] py-[32px]"
    >
      <!-- Header -->
      <div class="flex w-full items-center justify-center text-primary-900 text-3xl font-semibold">
        {{ ORDER_STATUS?.[selectType] ?? ORDER_STATUS.ready }}
      </div>

      <!-- completeInfo -->
      <div v-if="selectType === 'cooking'" class="w-full flex flex-col gap-4">
        <div class="text-secondary-700-light text-xl">조리 완료 확인</div>
        <div class="relative w-full rounded-2xl border-primary-700 border shadow-primary">
          <table class="w-full">
            <thead class="bg-primary-700-light text-secondary-900 h-[50px] rounded-t-2xl">
              <tr>
                <th>테이블 번호</th>
                <th>메뉴</th>
                <th>수량</th>
                <th>조리현황</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-center h-[50px] last:rounded-b-2xl">
                <td>{{ cookingInfo.cook.tableNum }}번</td>
                <td>{{ cookingInfo.menuName }}</td>
                <td>{{ cookingInfo.cook.servedCount }}개</td>
                <td>{{ cookingInfo.cook.totalCount }}개</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- OrderInfo -->
      <div v-if="selectType !== 'cooking'" class="w-full flex flex-col gap-4">
        <div class="text-secondary-700-light text-xl">예약자 정보</div>
        <div class="relative w-full rounded-2xl border-primary-700 border shadow-primary">
          <table class="w-full">
            <thead class="bg-primary-700-light text-secondary-900 h-[50px] rounded-t-2xl">
              <tr>
                <th>No.</th>
                <th>테이블 번호</th>
                <th>입금자명</th>
                <th>전화번호</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-center h-[50px] last:rounded-b-2xl">
                <td>{{ orderInfo.orderNum }}</td>
                <td>{{ orderInfo.tableNum }}번</td>
                <td>{{ orderInfo.userName }}</td>
                <td>{{ prettyPhoneNumber(orderInfo.phoneNum) }}</td>
                <td>{{ prettyPrice(orderInfo.totalPrice) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MenuList -->
      <div v-if="selectType !== 'cooking'" class="w-full flex flex-col gap-4">
        <div class="text-secondary-700-light text-xl">상세 메뉴</div>
        <div class="relative w-full rounded-2xl border-primary-700 border shadow-primary">
          <table class="w-full">
            <thead class="text-secondary-900 h-[50px]">
              <tr class="bg-primary-700-light rounded-t-2xl">
                <th class="min-w-[400px] text-start align-middle pl-[26px]">메뉴</th>
                <th class="text-center align-middle">수량</th>
                <th class="min-w-[100px] text-end align-middle pr-[40px]">가격</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(menu, menuIndex) in menuInfoList"
                class="text-center h-[50px] last:rounded-b-2xl"
                :key="menuIndex"
              >
                <td class="min-w-[400px] text-start align-middle pl-[26px]">{{ menu.menuName }}</td>
                <td class="text-center align-middle">{{ prettyMenuNum(menu.menuCount) }}</td>
                <td class="min-w-[100px] text-end align-middle pr-[26px]">{{ prettyPrice(menu.menuPrice) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Button Group -->
      <div v-if="selectType === 'ready'" class="flex justify-between items-end gap-[20px] h-[72px]">
        <button type="submit" class="is-button is-outlined w-[390px] h-[48px]" value="cancel">주문 취소</button>
        <button type="submit" class="is-button w-[390px] h-[48px]" ref="submit" value="deposit">입금 확인</button>
      </div>
      <div v-if="selectType === 'finish'" class="flex justify-between items-end gap-[20px] h-[72px]">
        <button type="submit" class="is-button w-full h-[48px]" ref="submit" value="restore">주문 복구</button>
      </div>
      <div
        v-if="selectType === 'complete' || selectType === 'cooking'"
        class="flex justify-between items-end gap-[20px] h-[72px]"
      >
        <button type="submit" class="is-button w-full h-[48px]" ref="submit" value="complete">조리 완료</button>
      </div>
      <div v-if="selectType === 'cancel'" class="flex justify-between items-end gap-[20px] h-[72px]">
        <button type="submit" class="is-button w-full h-[48px]" ref="submit" value="cancel">주문 취소 복구</button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>

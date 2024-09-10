<script setup>
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { ORDER_STATUS } from '@/utils/constants';
import { getHourandMinute, prettyMenuNum, prettyPhoneNumber, prettyPrice } from '@/utils/utils';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useTableDetail } from '@/stores/booths/tableDetail';
import IconClock from '../icons/IconClock.vue';
import IconOrderCheck from '../icons/IconOrderCheck.vue';
import IconRecipe from '../icons/IconRecipe.vue';

const useOrderPopupStore = useOrderPopup();
const { submitPopup, closePopup, getNote } = useOrderPopupStore;
const useTableDetailStore = useTableDetail();

const { selectType, menuInfoList, orderInfo, cookingInfo, note } = storeToRefs(useOrderPopupStore);
const { getCustomTableNum } = useTableDetailStore;

const isSubmit = ref(false);
const submit = ref(null);

const handleSubmit = async (event) => {
  const submitType = event.submitter.value;
  if (isSubmit.value) return;
  submit.value = true;
  await submitPopup({
    type: submitType,
  });
  isSubmit.value = false;
};

onMounted(async () => {
  submit.value?.focus();
  await getNote();
});
</script>
<template>
  <form @submit.prevent="handleSubmit($event)">
    <div
      class="w-[600px] min-h-[350px] bg-white shadow-primary rounded-2xl flex flex-col justify-between gap-[20px] px-[40px] py-[32px]"
    >
      <!-- Header -->
      <div class="flex w-full items-center justify-center text-primary-900 text-xl font-semibold relative">
        {{ ORDER_STATUS?.[selectType] ?? ORDER_STATUS.ready }}

        <button
          type="button"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white absolute right-0"
          @click="closePopup()"
        >
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>

      <!-- completeInfo -->
      <div v-if="selectType === 'cooking'" class="w-full flex flex-col gap-4">
        <div class="text-secondary-700-light text-sm">조리 완료 확인</div>
        <div class="flex gap-[5px] items-center text-secondary-700-light">
          <IconClock class="w-4 h-4 p-[1px]" />
          <div class="text-xs">{{ getHourandMinute(orderInfo.createAt) }}</div>
        </div>
        <div class="relative w-full rounded-2xl border-primary-700 border shadow-primary text-xs">
          <table class="w-full">
            <thead class="bg-primary-700-light text-secondary-900 h-[50px]">
              <tr>
                <th class="rounded-tl-2xl">테이블 번호</th>
                <th>메뉴</th>
                <th>수량</th>
                <th class="rounded-tr-2xl">조리현황</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-center h-[50px]">
                <td>{{ getCustomTableNum(cookingInfo.cook.tableNum) }}번</td>
                <td>{{ cookingInfo.menuName }}</td>
                <td>{{ cookingInfo.cook.servedCount }}개</td>
                <td>{{ cookingInfo.cook.totalCount }}개</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- OrderInfo -->
      <div v-if="selectType !== 'cooking'" class="w-full flex flex-col gap-4 text-sm">
        <div class="text-secondary-700-light">예약자 정보</div>
        <div class="flex gap-1 items-center text-secondary-700-light text-xs">
          <IconClock class="w-4 h-4 p-[1px]" />
          <div>{{ getHourandMinute(orderInfo.createAt) }}</div>
          <IconOrderCheck v-if="selectType === 'finish'" class="ml-2 p-[1px]" />
          <div v-if="selectType === 'finish'">
            {{ getHourandMinute(orderInfo.finishAt) }}
          </div>
        </div>

        <div class="relative w-full rounded-2xl outline outline-primary-900-light outline-1">
          <table class="w-full text-xs">
            <thead class="bg-primary-800-light text-secondary-900 h-[50px] font-semibold">
              <tr>
                <th class="rounded-tl-2xl pl-2">No.</th>
                <th>테이블 번호</th>
                <th>입금자명</th>
                <th>전화번호</th>
                <th class="rounded-tr-2xl pr-2">가격</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-center h-[50px]">
                <td class="pl-2">{{ orderInfo.orderNum }}</td>
                <td>{{ getCustomTableNum(orderInfo.tableNum) }}번</td>
                <td>{{ orderInfo.userName }}</td>
                <td>{{ prettyPhoneNumber(orderInfo.phoneNum) }}</td>
                <td class="pr-2">{{ prettyPrice(orderInfo.totalPrice) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MenuList -->
      <div v-if="selectType !== 'cooking'" class="w-full flex flex-col gap-4 text-sm">
        <div class="text-secondary-700-light">상세 메뉴</div>
        <div class="w-full">
          <div
            class="overflow-y-scroll max-h-[225px] w-full text-xs outline outline-1 outline-primary-900-light rounded-2xl"
            id="menuContainer"
          >
            <table class="w-full table-fixed">
              <thead class="sticky top-0 bg-primary-800-light text-secondary-900 h-[50px]">
                <tr class="w-full">
                  <th class="w-full text-start align-middle pl-[26px] rounded-tl-2xl">메뉴</th>
                  <th class="text-center align-middle w-[50px]">수량</th>
                  <th class="w-[100px] align-middle pr-2 rounded-tr-2xl">가격</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(menu, menuIndex) in menuInfoList" class="text-center h-[50px]" :key="menuIndex">
                  <td class="w-full text-start align-middle pl-[26px]">{{ menu.menuName }}</td>
                  <td class="text-center align-middle w-[50px]">{{ prettyMenuNum(menu.menuCount) }}</td>
                  <td class="w-[100px] align-middle pr-2">{{ prettyPrice(menu.menuPrice) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="note" class="flex flex-col gap-4">
        <div class="text-secondary-700-light text-sm">메모</div>
        <div class="w-full h-24 border-primary-700 border rounded-2xl">
          <p class="text-secondary-700-light p-4 text-sm">{{ note }}</p>
        </div>
      </div>

      <!-- Button Group -->
      <div v-if="selectType === 'ready'" class="flex justify-between items-end gap-[20px] pt-3">
        <button
          type="submit"
          class="is-button is-outlined font-semibold w-1/2 h-[35px] rounded-2xl text-sm flex items-center justify-center text-primary-900 lg:text-md bg-primary-900cursor-pointer select-none"
          value="cancel"
        >
          주문 취소
        </button>
        <button
          type="submit"
          class="is-button font-semibold w-1/2 h-[35px] rounded-2xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-900cursor-pointer select-none"
          ref="submit"
          value="deposit"
        >
          입금 확인
        </button>
      </div>
      <div v-if="selectType === 'finish'" class="flex justify-between items-end gap-[20px] pt-3">
        <button
          type="submit"
          class="is-button font-semibold w-full h-[35px] rounded-2xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-900cursor-pointer select-none"
          ref="submit"
          value="restore"
        >
          주문 복구
        </button>
      </div>
      <div
        v-if="selectType === 'complete' || selectType === 'cooking'"
        class="flex justify-between items-end gap-[20px] pt-3"
      >
        <button
          type="submit"
          class="is-button font-semibold w-full h-[35px] rounded2xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-900cursor-pointer select-none"
          ref="submit"
          value="complete"
        >
          조리 완료
        </button>
      </div>
      <div v-if="selectType === 'cancel'" class="flex justify-between items-end gap-[20px] pt-3">
        <button
          type="submit"
          class="is-button font-semibold w-full h-[35px] rounded-2xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-900cursor-pointer select-none"
          ref="submit"
          value="cancel"
        >
          주문 취소 복구
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="css" scoped>
#menuContainer {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

#menuContainer::-webkit-scrollbar {
  display: none;
}
</style>

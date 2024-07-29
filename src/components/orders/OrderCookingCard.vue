<script setup>
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { api } from '@/utils/api';
import { storeToRefs } from 'pinia';
import _ from 'lodash';
import { ref } from 'vue';

const props = defineProps({
  menuId: {
    type: String,
    required: true,
  },
  menuName: {
    type: String,
    required: true,
  },
  tableCount: {
    type: Number,
    required: true,
  },
  totalRemainCount: {
    type: Number,
    required: true,
  },
  cookList: {
    type: Array,
    required: true,
  },
});

const useBaseOrderStore = useBaseOrder();
const useOrderPopupStore = useOrderPopup();
const { openPopup } = useOrderPopupStore;

const { boothId } = storeToRefs(useBaseOrderStore);

const isComplete = (cook) => {
  return cook.servedCount === cook.totalCount;
};

const patchCookServeCount = async ({ cookId, servedCount, cook }) => {
  try {
    const response = await api.put(`/admin/booth/${boothId.value}/order/cook/count`, {
      cookId: cookId,
      servedCount: servedCount,
    });
    const data = response.data;
    if (data.success) {
      cook.servedCount = data.countInfo.servedCount;
      return;
    } else {
      return;
    }
  } catch (error) {
    console.error('[OrderCookingCard] patchCookServeCount', error);
    return;
  }
};

const handleClickMenuComplete = (cook) => {
  if (!isComplete(cook)) return;
  openPopup({
    type: 'cooking',
    selectCookingInfo: {
      menuId: props.menuId,
      menuName: props.menuName,
      tableCount: props.tableCount,
      totalRemainCount: props.totalRemainCount,
      cook: cook,
    },
  });
};

const debouncedPatchCookServeCount = _.debounce(async (cookId, servedCount, cook) => {
  await patchCookServeCount({
    cookId: cookId,
    servedCount: servedCount,
    cook: cook,
  });
}, 300);

const handleClickMenuPlus = _.throttle(async (cook) => {
  if (cook.servedCount < cook.totalCount) {
    await patchCookServeCount({
      cookId: cook.cookId,
      servedCount: cook.servedCount + 1,
      cook: cook,
    });
  }
}, 300);

const handleClickMenuMinus = _.throttle(async (cook) => {
  if (cook.servedCount > 0) {
    await patchCookServeCount({
      cookId: cook.cookId,
      servedCount: cook.servedCount - 1,
      cook: cook,
    });
  }
}, 300);

const handleInputServeCount = async (cook, event) => {
  let value = event.target.value.replace(/[^0-9]/g, '');

  if (value === '') {
    value = '0';
  }

  value = parseInt(value, 10);

  if (value >= 0 && value <= cook.totalCount) {
    event.target.value = value;
    debouncedPatchCookServeCount(cook.cookId, value, cook);
  } else {
    event.target.value = cook.servedCount;
  }
};
</script>

<template>
  <div class="w-full min-w-[430px] max-w-[552px] h-[500px] rounded-2xl flex flex-col justify-between">
    <div
      class="flex justify-center w-full h-[73px] items-center rounded-t-xl border-x-1 border-t-1 border-primary-900 px-[28px] text-2xl font-semibold bg-primary-500"
    >
      {{ menuName }}
    </div>
    <div
      class="relative h-[353px] w-full border-x-1 border-primary-900 overflow-y-auto"
      :class="{
        'overflow-y-hidden': cookList.length < 6,
      }"
    >
      <table class="w-full bg-white relative">
        <thead>
          <tr class="h-[43px] border-1 border-b">
            <th class="text-center align-middle pl-[28px] min-w-[70px]">테이블 번호</th>
            <th class="min-w-[30px] text-center align-middle">수량</th>
            <th class="min-w-[120px] text-center align-middle">조리 현황</th>
            <th class="min-w-[80px] text-center align-middle pr-[28px]">완료</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(cook, cookIndex) in cookList"
            class="h-[57px] border-1 border-b last:border-none hover:bg-slate-50"
            :key="cookIndex"
          >
            <td class="text-center align-middle pl-[28px] min-w-[70px]">{{ cook.tableNum }}번</td>
            <td class="min-w-[30px] text-center align-middle">{{ cook.totalCount }}개</td>
            <td class="min-w-[80px] text-center align-middle">
              <div class="w-full gap-[10px] flex justify-center items-center">
                <button
                  class="is-button w-5 h-5 font-normal flex items-center justify-center"
                  @click="handleClickMenuMinus(cook)"
                  :class="{
                    'cursor-not-allowed': cook.servedCount === 0,
                    'bg-gray-400': cook.servedCount === 0,
                  }"
                  type="button"
                >
                  -
                </button>
                <input
                  type="text"
                  class="is-button font-normal is-outlined w-[60px] h-[27px] text-center text-black"
                  :value="cook.servedCount"
                  @input="($event) => handleInputServeCount(cook, $event)"
                />
                <button
                  class="is-button w-5 h-5 font-normal flex items-center justify-center"
                  @click="handleClickMenuPlus(cook)"
                  :class="{
                    'cursor-not-allowed': cook.servedCount === cook.totalCount,
                    'bg-gray-400': cook.servedCount === cook.totalCount,
                  }"
                  type="button"
                >
                  +
                </button>
              </div>
            </td>
            <td class="min-w-[80px] text-center align-middle pr-[28px]">
              <button
                class="is-button w-[60px] h-[27px] rounded-full font-normal"
                :class="{
                  'bg-gray-400 text-white': !isComplete(cook),
                }"
                type="button"
                @click="handleClickMenuComplete(cook)"
              >
                완료
              </button>
            </td>
          </tr>
          <tr v-if="cookList.length < 6" v-for="item in 6 - cookList.length">
            <td class="h-[57px]" colspan="4"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="flex justify-between items-center h-[73px] w-full border-x-1 border-b-1 border-primary-900 rounded-b-xl px-[28px] bg-primary-500"
    >
      <div class="text-2xl">현재 주문 테이블: {{ tableCount }}</div>
      <div class="text-2xl">총 주문 수량: {{ totalRemainCount }}</div>
    </div>
  </div>
  <!-- <div class="w-full min-w-[430px] max-w-[500px] flex justify-end pt-[20px] text-transparent select-none">
    주문 내역 상세보기
  </div> -->
</template>

<style lang="scss" scoped></style>

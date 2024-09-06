<script setup>
import { ref } from 'vue';
import { getHourandMinute, prettyDate, prettyMenuNum, prettyPhoneNumber, prettyPrice } from '@/utils/utils';
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { useBaseOrder } from '@/stores/orders/baseOrder';
import IconClock from '@/components/icons/IconClock.vue';
import IconRecipe from '../icons/IconRecipe.vue';
import IconOrderCheck from '../icons/IconOrderCheck.vue';

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
  orderNum: {
    type: Number,
    required: true,
  },

  tableNum: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  menuList: {
    type: Array,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  createAt: {
    type: String,
    required: true,
  },
  phoneNum: {
    type: String,
    required: true,
  },
  finishAt: {
    type: String,
    required: false,
  },
});

const useOrderPopupStore = useOrderPopup();
const { openPopup } = useOrderPopupStore;

const useTableDetailStore = useTableDetail();
const { getCustomTableNum } = useTableDetailStore;

const useBaseOrderStore = useBaseOrder();
const { orderStatus } = useBaseOrderStore;

const handleClickOrderRestore = () => {
  openPopup({
    type: 'finish',
    selectOrderInfo: {
      orderId: props.orderId,
      orderNum: props.orderNum,
      orderType: 'FINISH',
      phoneNum: props.phoneNum,
      tableNum: props.tableNum,
      totalPrice: props.totalPrice,
      userName: props.userName,
      createAt: props.createAt,
      finishAt: props.finishAt,
    },
    selectMenuInfoList: props.menuList,
  });
};
</script>

<template>
  <div
    v-if="orderStatus != 'realTime'"
    class="w-full min-w-[350px] max-w-[400px] h-[400px] rounded-3xl flex flex-col justify-between outline outline-1 outline-primary-700"
  >
    <div
      class="flex justify-between w-full h-[73px] items-center px-[28px] text-sm font-semibold bg-success-700 flex-wrap gap-x-2 rounded-t-3xl border-b-1 border-success-700-light"
    >
      <div>No.{{ orderNum }}</div>
      <div>{{ getCustomTableNum(tableNum) }}번</div>
      <div>{{ userName }}</div>
      <div class="text-sm">{{ prettyPhoneNumber(phoneNum) }}</div>
      <div class="flex items-center gap-2">
        <IconClock class="p-[1px]" />
        <div class="text-sm font-medium">{{ getHourandMinute(createAt) }}</div>
      </div>
    </div>
    <div
      class="relative h-[353px] w-full overflow-y-auto"
      :class="{
        'overflow-y-hidden': menuList.length < 7,
      }"
    >
      <table class="w-full bg-white relative">
        <thead>
          <tr class="h-[38px] border-b-1 border-primary-300 text-sm">
            <th class="text-start min-w-[230px] align-middle pl-[28px]">메뉴</th>
            <th class="min-w-[30px] text-center align-middle">수량</th>
            <th class="min-w-[80px] text-right align-middle pr-[28px]">가격</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(menu, menuIndex) in menuList"
            class="h-[40px] border-b-1 border-primary-300 last:border-none hover:bg-slate-50 text-sm"
            :key="menuIndex"
          >
            <td class="text-start align-middle pl-[28px]">{{ menu.menuName }}</td>
            <td class="min-w-[30px] text-center align-middle">{{ prettyMenuNum(menu.menuCount) }}</td>
            <td class="min-w-[80px] text-right align-middle pr-[28px]">{{ prettyPrice(menu.menuPrice) }}</td>
          </tr>
          <tr v-if="menuList.length < 7" v-for="item in 7 - menuList.length">
            <td colspan="3" class="h-[43px]"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-between items-center h-[73px] w-full rounded-b-3xl px-[28px] bg-success-700">
      <div
        class="flex justify-center items-center rounded-2xl w-[100px] h-9 bg-white shrink-0 text-success font-semibold text-sm cursor-pointer"
        @click="handleClickOrderRestore()"
      >
        주문 복구
      </div>
      <div class="font-bold text-md text-secondary-700-light">{{ prettyPrice(totalPrice) }}</div>
    </div>
  </div>

  <div
    v-if="orderStatus === 'realTime'"
    class="w-full min-w-[380px] max-w-[400px] h-[92px] rounded-3xl flex justify-between items-center outline outline-1 outline-primary-700 bg-success-700 px-6"
  >
    <div class="w-full flex flex-col justify-center text-secondary-700-light font-medium gap-[11px]">
      <div class="flex gap-[11px] items-center">
        <div class="flex items-center gap-[2px]">
          <IconRecipe />
          <div class="text-sm">{{ getHourandMinute(createAt) }}</div>
        </div>
        <div class="flex items-center gap-[2px]">
          <IconOrderCheck />
          <div class="text-sm">{{ getHourandMinute(finishAt) }}</div>
        </div>
      </div>
      <div class="flex text-sm items-center gap-[10px]">
        <div class="pl-[5px]">{{ tableNum }}번 테이블</div>
        <div>{{ userName }}</div>
        <div>{{ prettyPrice(totalPrice) }}</div>
      </div>
    </div>
    <div
      class="flex justify-center items-center rounded-2xl w-[100px] h-9 bg-white shrink-0 text-success font-semibold text-sm cursor-pointer"
      @click="handleClickOrderRestore()"
    >
      주문 복구
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

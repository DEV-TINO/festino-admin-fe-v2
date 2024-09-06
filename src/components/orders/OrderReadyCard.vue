<script setup>
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { getHourandMinute, prettyDate, prettyMenuNum, prettyPhoneNumber, prettyPrice } from '@/utils/utils';
import { useTableDetail } from '@/stores/booths/tableDetail';
import IconClock from '@/components/icons/IconClock.vue';

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
});

const useOrderPopupStore = useOrderPopup();
const { openPopup } = useOrderPopupStore;

const useTableDetailStore = useTableDetail();
const { getCustomTableNum } = useTableDetailStore;

const handleClickOrderDetail = () => {
  openPopup({
    type: 'ready',
    selectOrderInfo: {
      orderId: props.orderId,
      orderNum: props.orderNum,
      orderType: '',
      phoneNum: props.phoneNum,
      tableNum: props.tableNum,
      totalPrice: props.totalPrice,
      userName: props.userName,
      createAt: props.createAt,
    },
    selectMenuInfoList: props.menuList,
  });
};
</script>

<template>
  <div
    class="w-full min-w-[350px] max-w-[400px] h-[400px] flex flex-col justify-between outline outline-1 outline-primary-200 rounded-3xl"
  >
    <div
      class="flex justify-between w-full h-[65px] items-center px-[28px] text-[13px] font-semibold bg-danger-700 rounded-t-3xl border-b-1 border-secondary-200 flex-wrap gap-x-2"
    >
      <div>No.{{ orderNum }}</div>
      <div>{{ getCustomTableNum(tableNum) }}번</div>
      <div>{{ userName }}</div>
      <div>{{ prettyPhoneNumber(phoneNum) }}</div>

      <div class="flex items-center gap-2">
        <IconClock class="p-[1px]" />
        <div>{{ getHourandMinute(createAt) }}</div>
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
            <th class="text-start min-w-[240px] align-middle pl-[28px]">메뉴</th>
            <th class="min-w-[30px] text-center align-middle">수량</th>
            <th class="min-w-[100px] text-right align-middle pr-[28px]">가격</th>
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
            <td class="min-w-[100px] text-right align-middle pr-[28px]">{{ prettyPrice(menu.menuPrice) }}</td>
          </tr>
          <tr v-if="menuList.length < 7" v-for="item in 7 - menuList.length">
            <td colspan="3" class="h-[43px]"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-between items-center h-[65px] w-full rounded-b-3xl px-[28px] bg-danger-700">
      <div
        class="w-[100px] h-9 rounded-2xl flex items-center justify-center cursor-pointer bg-white text-danger font-semibold text-sm"
        @click="handleClickOrderDetail()"
      >
        입금 확인
      </div>
      <div class="font-bold text-md text-secondary-700-light">{{ prettyPrice(totalPrice) }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

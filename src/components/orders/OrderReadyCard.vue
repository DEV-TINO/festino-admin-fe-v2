<script setup>
import { useOrderPopup } from '@/stores/orders/orderPopup';
import { prettyMenuNum, prettyPhoneNumber, prettyPrice } from '@/utils/utils';

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
  orderNum: {
    type: Number,
    required: true,
  },
  phoneNum: {
    type: String,
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
});

const useOrderPopupStore = useOrderPopup();
const { openPopup } = useOrderPopupStore;

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
    },
    selectMenuInfoList: props.menuList,
  });
};
</script>

<template>
  <div class="w-full min-w-[430px] max-w-[552px] h-[500px] rounded-2xl flex flex-col justify-between">
    <div
      class="flex justify-between w-full h-[73px] items-center rounded-t-xl border-x-1 border-t-1 border-danger px-[28px] text-xl font-semibold bg-danger-700"
    >
      <div>No.{{ orderNum }}</div>
      <div>{{ tableNum }}번</div>
      <div>{{ userName }}</div>
      <div>{{ prettyPhoneNumber(phoneNum) }}</div>
    </div>
    <div
      class="relative h-[353px] w-full border-x-1 border-danger overflow-y-auto"
      :class="{
        'overflow-y-hidden': menuList.length < 7,
      }"
    >
      <table class="w-full bg-white relative">
        <thead>
          <tr class="h-[43px] border-1 border-b">
            <th class="text-start min-w-[250px] align-middle pl-[28px]">메뉴</th>
            <th class="min-w-[30px] text-center align-middle">수량</th>
            <th class="min-w-[80px] text-right align-middle pr-[28px]">가격</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(menu, menuIndex) in menuList"
            class="h-[57px] border-1 border-b last:border-none hover:bg-slate-50"
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

    <div
      class="flex justify-between items-center h-[73px] w-full border-x-1 border-b-1 border-danger rounded-b-xl px-[28px] bg-danger-700"
    >
      <div
        class="w-36 h-12 is-button is-danger is-outlined rounded-xl flex items-center justify-center cursor-pointer"
        @click="handleClickOrderDetail()"
      >
        입금 확인
      </div>
      <div class="font-bold text-2xl">{{ prettyPrice(totalPrice) }}</div>
    </div>
  </div>
  <!-- <div
    class="w-full min-w-[430px] max-w-[500px] flex justify-end pt-[20px] font-bold underline cursor-pointer"
    @click="handleClickOrderDetail()"
  >
    주문 내역 상세보기
  </div> -->
</template>

<style lang="scss" scoped></style>

<script setup>
import IconClose from '../icons/IconClose.vue';
import { useBaseModal } from '@/stores/baseModal';
import IconRadio from '../icons/IconRadio.vue';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { storeToRefs } from 'pinia';
import { useServiceModal } from '@/stores/orders/serviceModal';

const useBaseModalStore = useBaseModal();
const useTableDetailStore = useTableDetail();
const useServiceModalStore = useServiceModal();

const { closeModal } = useBaseModalStore;
const { getMenuList } = useServiceModalStore;

const { tableNumList } = storeToRefs(useTableDetailStore);
const { menuList } = storeToRefs(useServiceModalStore);

const isService = ref(false);
const selectedTableNum = ref('');
const selectedMenu = ref('');
const orderList = ref([]);
const totalPrice = ref(0);

const addOrderList = () => {
  if (!selectedTableNum.value || !selectedMenu.value) {
    alert('테이블 번호와 메뉴를 선택해주세요.');
    return;
  }

  const price = isService.value ? 0 : selectedMenu.value.menuPrice;
  const existingOrder = orderList.value.find(
    (order) =>
      order.menuId === selectedMenu.value.menuId &&
      order.tableNum === selectedTableNum.value &&
      order.menuPrice === price,
  );

  if (existingOrder) {
    existingOrder.menuCount += 1;
  } else {
    orderList.value.push({
      menuId: selectedMenu.value.menuId,
      menuName: selectedMenu.value.menuName,
      menuCount: 1,
      menuPrice: price,
      tableNum: selectedTableNum.value,
    });
  }
  totalPrice.value += price;
};

onMounted(() => {
  getMenuList();
});
</script>
<template>
  <div
    class="w-[730px] h-fit flex flex-col justify-start items-center bg-white rounded-2xl overflow-y-auto px-[52px] py-11 gap-[24px]"
  >
    <div class="w-full flex justify-between items-center gap-5 shrink-0 font-semibold text-[30px] text-primary-900 h-9">
      <div class="w-[25px]"></div>
      주문 추가
      <IconClose @click="closeModal()" class="cursor-pointer" />
    </div>
    <!-- 주문/서비스 -->
    <div class="flex items-center w-full">
      <div class="flex items-center gap-[28px]">
        <div class="w-[110px] flex gap-2 cursor-pointer" @click="isService = false">
          <IconRadio :is-active="!isService" />
          <div>일반 주문</div>
        </div>
      </div>
      <div class="flex items-center gap-[28px]">
        <div class="w-[110px] flex gap-2 cursor-pointer" @click="isService = true">
          <IconRadio :is-active="isService" />
          <div>서비스 주문</div>
        </div>
      </div>
    </div>
    <!-- 테이블 선택 -->
    <div class="flex flex-col w-full gap-[10px]">
      <div class="text-xl font-medium">테이블 선택</div>
      <select
        v-model="selectedTableNum"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        <option hidden="" disabled="disabled" value="">===== 테이블을 선택해주세요 =====</option>
        <option v-for="(table, tableIndex) in tableNumList" :key="tableIndex" :value="table.customTableNum">
          {{ table.customTableNum }}
        </option>
      </select>
    </div>
    <!-- 메뉴 선택 -->
    <div class="flex flex-col w-full gap-[10px]">
      <div class="text-xl font-medium">메뉴 선택</div>
      <select
        v-model="selectedMenu"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        <option hidden="" disabled="disabled" value="">====== 메뉴를 선택해주세요 ======</option>
        <option v-for="(menu, menuIndex) in menuList" :key="menuIndex" :value="menu">
          {{ menu.menuName }} {{ menu.menuPrice }}원
        </option>
      </select>
    </div>
    <!-- Buttons -->
    <div class="w-full flex justify-end items-center text-xl gap-5">
      <button class="is-button is-outlined w-[100px] h-[50px] font-semibold" type="button" @click="addOrderList()">
        추가
      </button>
    </div>

    <!-- 메뉴 리스트 -->
    <div class="flex flex-col w-full gap-[10px]" v-if="orderList.length > 0">
      <div class="text-xl font-medium">주문 목록</div>
      <div class="bg-primary-700 rounded-2xl p-4 overflow-auto max-h-[210px]" id="orderContainer">
        <div v-for="(order, orderIndex) in orderList" :key="orderIndex" class="grid grid-cols-4 pb-[12px]">
          <div class="text-left">{{ order.tableNum }}번 테이블</div>
          <div class="text-center">{{ order.menuName }}</div>
          <div class="text-center">{{ order.menuCount }}개</div>
          <div class="text-right">{{ order.menuPrice }}원</div>
        </div>
        <div class="w-full border-secondary-900 border-1"></div>
        <div class="pt-[10px] pb-[4px] flex justify-between text-secondary-700">
          <div>총 가격</div>
          <div class="font-bold">{{ totalPrice }}원</div>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="w-full flex justify-end items-center text-xl gap-5">
      <button class="is-button is-outlined w-[100px] h-[50px] font-semibold" type="button" @click="closeModal()">
        취소
      </button>
      <button @click="handleClickSaveButton()" class="is-button w-[100px] h-[50px] font-semibold">저장</button>
    </div>
  </div>
</template>

<style lang="css" scoped>
#orderContainer {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

#orderContainer::-webkit-scrollbar {
  display: none;
}
</style>

<script setup>
import IconClose from '../icons/IconClose.vue';
import { useBaseModal } from '@/stores/baseModal';
import IconRadio from '../icons/IconRadio.vue';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { storeToRefs } from 'pinia';
import { useServiceModal } from '@/stores/orders/serviceModal';
import { prettyPrice } from '@/utils/utils';

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
const isTableDropdownOpen = ref(false);
const isMenuDropdownOpen = ref(false);

const toggleDropdown = (type) => {
  if (type === 'table') {
    isMenuDropdownOpen.value = false;
    isTableDropdownOpen.value = !isTableDropdownOpen.value;
  } else {
    isTableDropdownOpen.value = false;
    isMenuDropdownOpen.value = !isMenuDropdownOpen.value;
  }
};

const selectTable = (tableNum) => {
  selectedTableNum.value = tableNum;
  isTableDropdownOpen.value = false;
};

const selectMenu = (menu) => {
  selectedMenu.value = menu;
  isMenuDropdownOpen.value = false;
};

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
    class="w-[730px] h-fit flex flex-col justify-start items-center bg-white rounded-2xl overflow-y-auto px-[52px] py-11 gap-5"
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
      <!-- <div class="text-xl font-medium">테이블 선택</div> -->
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        class="focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 justify-between"
        :class="selectedTableNum ? 'is-button text-white' : 'is-button is-outlined text-primary-900'"
        type="button"
        @click="toggleDropdown('table')"
      >
        {{ selectedTableNum ? `테이블 번호 - ${selectedTableNum}` : '테이블 번호를 선택해주세요.' }}
        <svg
          class="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div
        id="dropdown"
        class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 max-h-[135px] overflow-auto"
        :class="isTableDropdownOpen ? '' : 'hidden'"
      >
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li
            v-for="(table, tableIndex) in tableNumList"
            :key="tableIndex"
            :value="table.customTableNum"
            @click="selectTable(table.customTableNum)"
          >
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{{
              table.customTableNum
            }}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 메뉴 선택 -->
    <div class="flex flex-col w-full gap-[10px]">
      <!-- <div class="text-xl font-medium">메뉴 선택</div> -->
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        class="focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 justify-between"
        :class="selectedMenu ? 'is-button text-white' : 'is-button is-outlined text-primary-900'"
        type="button"
        @click="toggleDropdown('menu')"
      >
        {{
          selectedMenu ? `${selectedMenu.menuName} - ${prettyPrice(selectedMenu.menuPrice)} ` : '메뉴를 선택해주세요.'
        }}
        <svg
          class="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div
        id="dropdown"
        class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700"
        :class="isMenuDropdownOpen ? '' : 'hidden'"
      >
        <ul
          class="py-2 text-sm text-gray-700 dark:text-gray-200 max-h-[135px] overflow-auto"
          aria-labelledby="dropdownDefaultButton"
        >
          <li v-for="(menu, menuIndex) in menuList" :key="menuIndex" :value="menu" @click="selectMenu(menu)">
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >{{ menu.menuName }} - {{ prettyPrice(menu.menuPrice) }}</a
            >
          </li>
        </ul>
      </div>
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
      <div class="bg-primary-700 rounded-2xl p-4 overflow-auto max-h-[170px]" id="orderContainer">
        <div v-for="(order, orderIndex) in orderList" :key="orderIndex" class="grid grid-cols-4 pb-[12px]">
          <div class="text-left">{{ order.tableNum }}번 테이블</div>
          <div class="text-center">{{ order.menuName }}</div>
          <div class="text-center">{{ order.menuCount }}개</div>
          <div class="text-right">{{ prettyPrice(order.menuPrice) }}</div>
        </div>
        <div class="w-full border-secondary-900 border-1"></div>
        <div class="pt-[10px] pb-[4px] flex justify-between text-secondary-700">
          <div>총 가격</div>
          <div class="font-bold">{{ prettyPrice(totalPrice) }}</div>
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

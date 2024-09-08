<script setup>
import IconClose from '../icons/IconClose.vue';
import { useBaseModal } from '@/stores/baseModal';
import IconRadio from '../icons/IconRadio.vue';
import { computed, onMounted, ref } from 'vue';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { storeToRefs } from 'pinia';
import { useServiceModal } from '@/stores/orders/serviceModal';
import { prettyPrice } from '@/utils/utils';
import IconDelete from '../icons/IconDelete.vue';
import IconTrash from '../icons/IconTrash.vue';
import IconOrderPlus from '../icons/IconOrderPlus.vue';
import IconOrderMinus from '../icons/IconOrderMinus.vue';

const useBaseModalStore = useBaseModal();
const useTableDetailStore = useTableDetail();
const useServiceModalStore = useServiceModal();

const { closeModal } = useBaseModalStore;
const { getMenuList, saveService } = useServiceModalStore;

const { tableNumList } = storeToRefs(useTableDetailStore);
const { menuList } = storeToRefs(useServiceModalStore);
const { memo } = storeToRefs(useServiceModalStore);

const isService = ref(true);
const selectedTableNum = ref([]);
const selectedMenu = ref([]);
const orderList = ref({});

const totalPrice = ref(0);
const isTableDropdownOpen = ref(false);
const isMenuDropdownOpen = ref(false);
const searchTable = ref('');
const searchMenu = ref('');

const toggleDropdown = (type) => {
  if (type === 'table') {
    isMenuDropdownOpen.value = false;
    isTableDropdownOpen.value = !isTableDropdownOpen.value;
  } else {
    isTableDropdownOpen.value = false;
    isMenuDropdownOpen.value = !isMenuDropdownOpen.value;
  }
};

const selectTable = (tableNumIndex, customTableNum) => {
  const index = selectedTableNum.value.findIndex((table) => table.tableNumIndex === tableNumIndex);
  if (index === -1) selectedTableNum.value.push({ tableNumIndex, customTableNum });
  else selectedTableNum.value.splice(index, 1);
};

const selectMenu = (menu) => {
  const index = selectedMenu.value.indexOf(menu);
  if (index === -1) selectedMenu.value.push(menu);
  else selectedMenu.value.splice(index, 1);
};

const filteredTableList = computed(() => {
  if (!searchTable.value) return tableNumList.value;
  return tableNumList.value.filter(
    (table) => table.tableNumIndex.includes(searchTable.value) || table.customTableNum.includes(searchTable.value),
  );
});

const filteredMenuList = computed(() => {
  if (!searchMenu.value) return menuList.value;
  return menuList.value.filter((menu) => menu.menuName.includes(searchMenu.value));
});

const handleClickTotalDelete = (type) => {
  if (type === 'table') selectedTableNum.value = [];
  else selectedMenu.value = [];
};

const addOrderList = () => {
  if (!selectedTableNum.value.length || !selectedMenu.value.length) {
    alert('테이블 번호와 메뉴를 선택해주세요.');
    return;
  }

  selectedTableNum.value.forEach((table) => {
    selectedMenu.value.forEach((menu) => {
      const price = isService.value ? 0 : menu.menuPrice;

      const currentTableOrders = orderList.value[table.tableNumIndex] || [];

      const existingOrder = currentTableOrders.find(
        (order) => order.menuId === menu.menuId && order.menuPrice === price,
      );

      if (existingOrder) {
        existingOrder.menuCount += 1;
      } else {
        currentTableOrders.push({
          menuId: menu.menuId,
          menuName: menu.menuName,
          menuCount: 1,
          menuPrice: price,
          isService: isService.value,
        });
      }

      orderList.value[table.tableNumIndex] = currentTableOrders;

      totalPrice.value += price;
    });
  });
};

const handleClickMenuMinus = (tableNum, menu) => {
  const findOrder = orderList.value[tableNum]?.find(
    (order) => order.menuId === menu.menuId && order.menuPrice === menu.menuPrice,
  );

  if (!findOrder || findOrder.menuCount === 0) return;

  if (findOrder.menuCount > 0) {
    findOrder.menuCount -= 1;
    totalPrice.value -= findOrder.menuPrice;
  }
};

const handleClickMenuPlus = (tableNum, menu) => {
  const findOrder = orderList.value[tableNum]?.find(
    (order) => order.menuId === menu.menuId && order.menuPrice === menu.menuPrice,
  );
  if (!findOrder || findOrder.menuCount === 99) return;

  if (findOrder.menuCount < 99) {
    findOrder.menuCount += 1;
    totalPrice.value += findOrder.menuPrice;
  }
};

const handleInputOrderCount = (tableNum, menu, event) => {
  let value = event.target.value.replace(/[^0-9]/g, '');
  if (value === '') {
    value = '0';
  }

  value = parseInt(value, 10);
  event.target.value = value;

  const findOrder = orderList.value[tableNum]?.find(
    (order) => order.menuId === menu.menuId && order.menuPrice === menu.menuPrice,
  );
  if (findOrder === -1) return;
  findOrder.menuCount = value;
  totalPrice.value = Object.values(orderList.value).reduce((acc, orders) => {
    return acc + orders.reduce((sum, order) => sum + order.menuPrice * order.menuCount, 0);
  }, 0);
};

const handleClickDeleteOrder = (tableNum, menu) => {
  const orders = orderList.value[tableNum];
  if (!orders) return;

  const orderIndex = orders.findIndex((order) => order.menuId === menu.menuId && order.menuPrice === menu.menuPrice);
  if (orderIndex === -1) return;

  totalPrice.value -= orders[orderIndex].menuPrice * orders[orderIndex].menuCount;
  orders.splice(orderIndex, 1);

  if (orders.length === 0) {
    delete orderList.value[tableNum];
  }
};

const handleClickSaveButton = () => {
  if (Object.keys(orderList.value).length === 0) {
    alert('주문을 추가해주세요.');
    return;
  }
  saveService(orderList.value);
};

const getTableCustomNum = (tableNum) => {
  const tableInfo = tableNumList.value.find((table) => table.tableNumIndex === Number(tableNum));
  return tableInfo.customTableNum;
};

const getTableTotalPrice = (orders) => {
  return prettyPrice(orders.reduce((acc, cur) => acc + cur.menuPrice * cur.menuCount, 0));
};

onMounted(() => {
  getMenuList();
});
</script>
<template>
  <div
    class="w-[730px] h-fit flex flex-col justify-start items-center bg-white rounded-2xl px-[60px] py-[50px] gap-5 max-h-full overflow-auto"
  >
    <div class="w-full flex justify-between items-center gap-5 shrink-0 font-semibold text-xl text-primary-900 h-9">
      <div class="w-[25px]"></div>
      주문 추가
      <IconClose @click="closeModal()" class="cursor-pointer p-1 hover:bg-gray-100" />
    </div>
    <!-- 주문 타입 + 드롭다운 -->

    <div class="flex flex-col grow overflow-y-auto w-full gap-5" id="orderContainer">
      <div class="flex flex-col gap-3 px-1">
        <!-- 주문/서비스 -->
        <div class="flex items-center w-full gap-5">
          <div class="flex items-center gap-[28px]">
            <div class="flex gap-2 cursor-pointer items-center text-sm" @click="isService = true">
              <IconRadio :is-active="isService" />
              <div>서비스 주문</div>
            </div>
          </div>
          <div class="flex items-center gap-[28px]">
            <div class="flex gap-2 cursor-pointer items-center text-sm" @click="isService = false">
              <IconRadio :is-active="!isService" />
              <div>일반 주문</div>
            </div>
          </div>
        </div>

        <!-- 테이블 선택 -->
        <button
          id="dropdownSearchButton"
          data-dropdown-toggle="dropdownSearch"
          data-dropdown-placement="bottom"
          class="w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center inline-flex items-center justify-between"
          :class="selectedTableNum.length > 0 ? 'is-button ' : 'is-button is-outlined'"
          type="button"
          @click="toggleDropdown('table')"
        >
          테이블 번호를 선택해주세요.
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
          id="dropdownSearch"
          class="z-10 bg-white rounded-lg shadow w-full"
          :class="isTableDropdownOpen ? '' : 'hidden'"
        >
          <!-- <div class="p-3"> -->
          <label for="input-group-search" class="sr-only">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="input-group-search"
              class="block w-full p-2 ps-10 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="테이블 번호 검색"
              v-model="searchTable"
            />
            <!-- </div> -->
          </div>
          <ul class="py-2 text-xs" aria-labelledby="dropdownSearchButton">
            <li
              v-for="(table, tableIndex) in filteredTableList"
              :key="table.tableNumIndex"
              :value="table.tableNumIndex"
              @click="selectTable(table.tableNumIndex, table.customTableNum)"
              class="flex items-center ps-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <div class="flex items-center ps-2 rounded hover:bg-gray-100">
                <input
                  type="checkbox"
                  :value="table.tableNumIndex"
                  :checked="
                    selectedTableNum.find((selectedTable) => selectedTable.tableNumIndex === table.tableNumIndex)
                  "
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label class="w-full py-2 ms-2 text-xs font-medium text-gray-900 rounded"
                  >{{ table.tableNumIndex }} - {{ table.customTableNum }}번 테이블</label
                >
              </div>
            </li>
          </ul>
          <a
            href="#"
            class="flex items-center justify-center p-2 text-xs text-danger border-t border-gray-200 rounded-b-lg bg-gray-50 font-bold"
            @click="handleClickTotalDelete('table')"
          >
            전체 삭제
          </a>
        </div>

        <div v-if="selectedTableNum.length > 0" class="flex gap-3 w-full items-start flex-wrap mb-1">
          <div
            v-for="(table, tableIndex) in selectedTableNum"
            :key="table.tableNumIndex"
            class="is-button is-outlined px-[15px] text-base flex items-center place-items-center gap-1 h-[28px] flex-shrink-0"
          >
            {{ table.customTableNum }}
            <IconDelete @click="selectTable(table.tableNumIndex, table.customTableNum)" class="cursor-pointer" />
          </div>
        </div>

        <!-- 메뉴 선택 -->
        <button
          id="dropdownSearchButton"
          data-dropdown-toggle="dropdownSearch"
          data-dropdown-placement="bottom"
          class="w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center inline-flex items-center justify-between"
          :class="selectedMenu.length > 0 ? 'is-button ' : 'is-button is-outlined'"
          type="button"
          @click="toggleDropdown('menu')"
        >
          메뉴를 선택해주세요.
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
          id="dropdownSearch"
          class="z-10 bg-white rounded-lg shadow w-full"
          :class="isMenuDropdownOpen ? '' : 'hidden'"
        >
          <!-- <div class="p-3"> -->
          <label for="input-group-search" class="sr-only">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="input-group-search"
              class="block w-full p-2 ps-10 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="메뉴 검색"
              v-model="searchMenu"
            />
            <!-- </div> -->
          </div>
          <ul class="py-2 text-xs" aria-labelledby="dropdownSearchButton">
            <li
              v-for="(menu, menuIndex) in filteredMenuList"
              :key="menuIndex"
              :value="menu.menuName"
              @click="selectMenu(menu)"
              class="flex items-center ps-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <div class="flex items-center ps-2 rounded hover:bg-gray-100">
                <input
                  type="checkbox"
                  :value="menu.menuName"
                  :checked="selectedMenu.includes(menu)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label class="w-full py-2 ms-2 text-xs font-medium text-gray-900 rounded">{{ menu.menuName }}</label>
              </div>
            </li>
          </ul>
          <a
            href="#"
            class="flex items-center justify-center p-2 text-xs text-danger border-t border-gray-200 rounded-b-lg bg-gray-50 font-bold"
            @click="handleClickTotalDelete('menu')"
          >
            전체 삭제
          </a>
        </div>

        <div v-if="selectedMenu.length > 0" class="flex gap-3 w-full items-start flex-wrap">
          <div
            v-for="(menu, menuIndex) in selectedMenu"
            :key="menu.menuId"
            class="is-button is-outlined px-[15px] text-base flex items-center place-items-center gap-1 h-[28px] flex-shrink-0"
          >
            {{ menu.menuName }}
            <IconDelete @click="selectMenu(menu)" class="cursor-pointer" />
          </div>
        </div>
        <!-- Buttons -->
        <div class="w-full flex justify-end items-center gap-5">
          <button
            class="is-button is-outlined w-[58px] h-[28px] font-semibold rounded-full text-sm"
            type="button"
            @click="addOrderList()"
          >
            추가
          </button>
        </div>
      </div>

      <!-- 주문 목록 -->
      <div class="flex flex-col w-full gap-4" v-if="Object.keys(orderList).length != 0">
        <div class="text-xl font-medium">주문 목록</div>

        <div class="w-full bg-primary-800-light border-1 border-primary-700 rounded-xl text-secondary-700-light">
          <div v-for="(orders, tableNum) in orderList" :key="tableNum">
            <div class="flex justify-between border-b-1 border-primary-200 font-semibold px-3 h-10 items-center">
              <div class="text-left">{{ getTableCustomNum(tableNum) }}번 테이블</div>
              <div class="text-right">총 가격 : {{ getTableTotalPrice(orders) }}</div>
            </div>
            <div class="grid grid-cols-2 bg-white">
              <div
                v-for="(order, orderIndex) in orders"
                :key="orderIndex"
                class="flex justify-between border-b-1 border-primary-200 odd:border-r-1 px-3 min-h-16 h-fit items-center font-medium"
              >
                <div class="flex flex-col">
                  <div>{{ order.menuName }}</div>
                  <div>{{ prettyPrice(order.menuPrice) }}</div>
                </div>
                <div class="flex gap-3 justify-center items-center">
                  <div class="w-[100px] h-[30px] bg-primary-800-light flex items-center justify-around rounded-5xl">
                    <IconOrderMinus class="cursor-pointer" @click="handleClickMenuMinus(tableNum, order)" />
                    <div>{{ order.menuCount }}</div>
                    <IconOrderPlus class="cursor-pointer" @click="handleClickMenuPlus(tableNum, order)" />
                  </div>
                  <IconTrash class="cursor-pointer" @click="handleClickDeleteOrder(tableNum, order)" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-between h-[51px] items-center font-semibold px-3">
            <div class="text-left">총 가격</div>
            <div class="text-right">{{ prettyPrice(totalPrice) }}</div>
          </div>
        </div>
      </div>

      <!-- 메모 -->
      <div class="w-full flex flex-col gap-4 px-1">
        <div class="w-full text-xl">메모</div>
        <textarea
          maxlength="50"
          :value="memo"
          @input="($event) => (memo = $event.target.value)"
          placeholder="메모를 작성해주세요"
          class="w-full h-[70px] resize-none text-sm rounded-xl p-[10px] border-secondary-700 border-1"
          >{{ memo }}</textarea
        >
      </div>

      <!-- Buttons -->
      <div class="w-full flex justify-end items-center text-xl gap-3">
        <button class="is-button is-outlined w-[99px] h-12" type="button" @click="closeModal()">취소</button>
        <button @click="handleClickSaveButton()" class="is-button w-[134px] h-12">추가하기</button>
      </div>
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

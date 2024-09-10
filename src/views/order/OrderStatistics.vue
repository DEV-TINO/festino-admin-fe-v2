<script setup>
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { useOrderStatistics } from '@/stores/orders/orderStatistics';
import { useBoothList } from '@/stores/booths/boothList';
import { storeToRefs } from 'pinia';
import { ref, watchEffect, onMounted } from 'vue';
import StatisticsGraph from '@/views/order/OrderStatisticsGraph.vue';
import { prettyPrice } from '@/utils/utils';
import { DATES, STATISTICS_TYPE } from '@/utils/constants';
import IconDropDown from '@/components/icons/IconDropDown.vue';
import IconScroll from '@/components/icons/IconScroll.vue';

const useBaseOrderStore = useBaseOrder();
const useOrderStatisticsStore = useOrderStatistics();
const useBoothListStore = useBoothList();

const { getStatistics } = useOrderStatisticsStore;
const { getAllBoothList } = useBoothListStore;

const { boothId } = storeToRefs(useBaseOrderStore);
const { boothList } = storeToRefs(useBoothListStore);
const { allOrderStatistics } = storeToRefs(useOrderStatisticsStore);

const month = ref(9);
const isLoading = ref(false);
const day = ref(1);
const type = ref('all');  // 기본 토글 선택 값을 'all'로 설정

const myBooth = ref('');  // boothId와 일치하는 부스를 저장할 변수

function formattedMonth() {
  return month.value.toString().padStart(2, '0');
}

const formattedDateList = ref([]);

onMounted(() => {
  formattedDateList.value = Object.keys(DATES).map(key => ({
    day: key.padStart(2, '0'),
    dateName: DATES[key]
  }));
});

const currentMonth = new Date().getMonth() + 1;
const today = new Date().getDate();

const activeDateMap = {
  11: 1,
  12: 2,
  13: 3,
};

const determineActiveDate = () => {
  if (currentMonth < 9) {
    return 1;
  } else if (currentMonth > 9) {
    return 3;
  } else {
    if (activeDateMap[today] !== undefined) {
      return activeDateMap[today];
    } else if (today < 11) {
      return 1;
    } else {
      return 3;
    }
  }
};

const activeDate = ref(determineActiveDate());

const handleButtonClick = async (key) => {
  if (key !== activeDate.value) {
    activeDate.value = key;
    day.value = activeDateMap[key];
  }
  await fetchStatistics();
};

const sortStrategies = {
  nameAsc: (a, b) => a.menuName.localeCompare(b.menuName),
  nameDesc: (a, b) => b.menuName.localeCompare(a.menuName),
  priceAsc: (a, b) => a.menuPrice - b.menuPrice,
  priceDesc: (a, b) => b.menuPrice - a.menuPrice,
  countAsc: (a, b) => a.menuCount - b.menuCount,
  countDesc: (a, b) => b.menuCount - a.menuCount,
  saleAsc: (a, b) => a.menuSale - b.menuSale,
  saleDesc: (a, b) => b.menuSale - a.menuSale,
};

const handleStatisticsSort = (sort) => {
  const sortFunction = sortStrategies[sort];
  if (sortFunction) {
    allOrderStatistics.value.menuSaleList.sort(sortFunction);
  }
};

const fetchStatistics = async () => {
  isLoading.value = true;
  await getStatistics({
    boothId: boothId.value,
    date: day.value,
    type: type.value,
  });
  isLoading.value = false;
};

// type이 변경될 때마다 getStatistics 호출
watchEffect(async () => {
  await fetchStatistics();
});

onMounted(async () => {
  await getAllBoothList();

  // boothList에서 boothId와 일치하는 부스를 찾아서 myBooth에 저장
  myBooth.value = boothList.value.find(booth => booth.boothId === boothId.value);
  await fetchStatistics();
});
</script>

<template>
  <div class="flex flex-col">
    <!-- 정렬 기준 선택 -->
    <div class="flex justify-end gap-4 mb-4 mr-4">
      <div v-for="(toggle, index) in STATISTICS_TYPE" :key="index" class="flex">
        <div :id="index">
          <input
            v-model="type"
            :id="`toggle-${index}`"
            type="radio"
            :value="toggle.type"
            name="toggle"
            class="w-4 h-4 text-primary-900 bg-gray-100 border-gray-300 focus:ring-primary-900 checked:ring-primary-900 checked:bg-primary-900"
          />
          <label
            :for="`toggle-${index}`"
            class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 select-none"
          >
            {{ toggle.value }}
          </label>
        </div>
      </div>
    </div>

    <!-- 통계 영역 -->
    <div class="w-full h-[530px] flex overflow-x-scroll scrollbar-hide">
      <div class="w-1/2 min-w-[300px] pt-20 pl-10 h-full border border-primary-900 rounded-l-[20px]">
        <div v-if="isLoading" class="text-primary-900 font-semibold h-[500px] flex justify-center items-center">
          Loading...
        </div>
        <div v-if="!isLoading">
          <StatisticsGraph />
        </div>
        <div class="flex justify-end items-center pr-4 ">
          <IconScroll class="w-5 h-5 mr-1" />
          <p class="text-xs text-gray-500 font-semibold">스크롤</p>
        </div>
      </div>
      <div
        class="w-1/2 min-w-[490px] h-full overflow-hidden p-[40px] border-r border-y border-primary-900 rounded-r-[20px] flex flex-col justify-between items-center"
      >
        <div>
          <div
            class="min-w-[432px] font-semibold text-primary-900 text-xl flex justify-center select-none pb-5"
          >
            {{ myBooth?.adminName }} 야간부스 매출 통계
          </div>
          <div class="w-full flex justify-center gap-3">
            <button
              type="button"
              class="min-w-[110px] h-[35px] is-button relative rounded-[16px] text-sm"
              v-for="(dateInfo, key) in formattedDateList"
              :key="key"
              :class="{ 'is-outlined': activeDateMap[dateInfo.day] !== day }"
              @click="handleButtonClick(dateInfo.day)"
            >
              {{ formattedMonth(month) }}/{{ dateInfo.day }} ({{ dateInfo.dateName }})
            </button>
          </div>
        </div>
        <div
          class="max-w-[712px] w-full h-[330px] rounded-3xl flex flex-col text-secondary-500 outline outline-2 bg-white outline-[rgba(0,115,240,0.16)] relative"
        >
          <div
            class="h-[38px] flex flex-row justify-between bg-primary-800-light rounded-t-3xl font-semibold pl-7 border-b-1 border-primary-300 items-center shrink-0 text-[13px]"
          >
            <p class="basis-2/3 h-full flex items-center font-semibold select-none">
              메뉴
              <div>
                <IconDropDown
                  class="-scale-y-100"
                  @click="handleStatisticsSort('nameAsc')"
                />
                <IconDropDown @click="handleStatisticsSort('nameDesc')" />
              </div>
            </p>
            <p
              class="basis-1/4 h-full flex justify-center items-center font-semibold select-none"
            >
              가격
              <div>
                <IconDropDown
                  class="-scale-y-100"
                  @click="handleStatisticsSort('priceAsc')"
                />
                <IconDropDown @click="handleStatisticsSort('priceDesc')" />
              </div>
            </p>
            <p
              class="basis-1/6 min-w-fit text-center flex justify-center items-center font-semibold select-none"
            >
              수량
              <div>
                <IconDropDown
                  class="-scale-y-100"
                  @click="handleStatisticsSort('countAsc')"
                />
                <IconDropDown @click="handleStatisticsSort('countDesc')" />
              </div>
            </p>
            <p
              class="basis-1/4 min-w-[130px] text-right flex justify-end items-center font-semibold select-none pr-8"
            >
              판매액
              <div>
                <IconDropDown
                  class="-scale-y-100"
                  @click="handleStatisticsSort('saleAsc')"
                />
                <IconDropDown @click="handleStatisticsSort('saleDesc')" />
              </div>
            </p>
          </div>

          <div class="h-full overflow-y-scroll scrollbar-hide">
            <div
              class="flex flex-row justify-between font-normal pl-7 min-h-8 items-center border-b-1 border-primary-300 shrink-0 hover:bg-gray-200 text-[13px]"
              v-for="(menu, index) in allOrderStatistics.menuSaleList"
              :key="index"
            >
              <p class="basis-2/3 text-secondary-700-light truncate">
                {{ menu.menuName }}
              </p>
              <p
                class="basis-1/4 min-w-fit text-center text-secondary-700-light"
              >
                {{ prettyPrice(menu.menuPrice || 0) }}
              </p>
              <p class="basis-1/6 text-center text-secondary-700-light">
                {{ menu.menuCount }}개
              </p>
              <p
                class="basis-1/4 min-w-[130px] text-secondary-700-light text-right pr-8"
              >
                {{ prettyPrice(menu.menuSale || 0) }}
              </p>
            </div>
          </div>

          <div
            class="grid place-items-center text-primary-900 font-medium text-lg h-14 rounded-b-3xl bottom-0 shrink-0 bg-white border-secondary-600 shadow-[0px_-5px_6px_0px_rgba(0,0,0,0.1)]"
          >
            총액 : {{ prettyPrice(allOrderStatistics.totalSale || 0) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>
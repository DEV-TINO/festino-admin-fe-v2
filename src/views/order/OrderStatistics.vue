<script setup>
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { useOrderStatistics } from '@/stores/orders/orderStatistics';
import { useBoothList } from '@/stores/booths/boothList';
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect, watch, onMounted } from 'vue';
import StatisticsGraph from '@/views/order/OrderStatisticsGraph.vue';
import { prettyPrice } from '@/utils/utils';
import { DATES } from '@/utils/constants';
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
const selectBooth = ref({});
const selectBoothId = ref('');
const isLoading = ref(false);
const day = ref(1);

const selectedSort = ref({
  name: '',
  price: '',
  count: '',
  sale: '',
})

const formattedMonth = computed(() => month.value.toString().padStart(2, '0'));
const formattedDates = computed(() => {
  return Object.keys(DATES).reduce((acc, key) => {
    acc[key.padStart(2, '0')] = DATES[key];
    return acc;
  }, {});
});

const currentMonth = new Date().getMonth() + 1;
const today = new Date().getDate();

const activeDateMap = {
  11: 0,
  12: 1,
  13: 2
};

const determineActiveDate = () => {
  if (currentMonth < 9) {
    return 0;
  } else if (currentMonth > 9) {
    return 2;
  } else {
    if (activeDateMap[today] !== undefined) {
      return activeDateMap[today];
    } else if (today < 11) {
      return 0;
    } else {
      return 2;
    }
  }
};

const activeDate = ref(determineActiveDate());

const handleButtonClick = (key) => {
  if (key !== activeDate.value) {
    activeDate.value = key;
    day.value = key;
  }
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
  if (selectBoothId.value) {
    isLoading.value = true;
    day.value = activeDate.value;
    await getStatistics({
      boothId: selectBoothId.value,
      date: day.value,
    });
    isLoading.value = false;
  }
};

watchEffect(() => {
  selectBooth.value = boothList.value.find((booth) => booth.boothId === selectBoothId.value) || {};
});

watch(() => boothId.value, async (newBoothId) => {
  if (newBoothId) {
    activeDate.value = determineActiveDate();
    selectBoothId.value = newBoothId;
    await fetchStatistics();
  }
});

watch(() => activeDate.value, async (newActiveDate) => {
  await fetchStatistics();
});

onMounted(async () => {
  await getAllBoothList();
  if (boothList.value.length > 0) {
    selectBoothId.value = boothId.value || boothList.value[0]?.boothId;
    await fetchStatistics();
  }
});
</script>

<template>
  <div class="w-full h-[638px] flex overflow-x-scroll scrollbar-hide">
    <div class="w-1/2 min-w-[490px] pt-14 pl-10 h-full border border-primary-900 rounded-l-[20px]">
      <StatisticsGraph />
      <div class="flex justify-end items-center pr-4">
        <IconScroll class="w-5 h-5 mr-1" />
        <p class="text-xs text-gray-500 font-semibold">스크롤</p>
      </div>
    </div>
    <div class="w-1/2 min-w-[490px] h-full overflow-hidden p-[40px] border-r border-y border-primary-900 rounded-r-[20px] flex flex-col justify-between items-center">
      <div class="min-w-[432px] font-semibold text-primary-900 text-[28px] flex justify-center select-none">{{ selectBooth?.adminName }} 야간부스 매출 통계</div>
      <div class="w-full flex justify-center gap-4">
        <button
          type="button"
          class="min-w-[120px] w-[200px] h-[50px] is-button relative"
          v-for="(date, key, day) in formattedDates"
          :key="day"
          :class="{ 'is-outlined': day !== activeDate }"
          @click="handleButtonClick(day)"
        >
          {{ formattedMonth }}/{{ key }} ({{ date }})
        </button>
      </div>
      <div
        class="max-w-[712px] w-full h-[380px] rounded-3xl flex flex-col text-secondary-500 outline outline-2 bg-white outline-[rgba(0,115,240,0.16)] relative"
      >
        <div
          class="h-[50px] flex flex-row justify-between bg-primary-800-light rounded-t-3xl font-semibold pl-7 border-b-1 border-primary-300 items-center shrink-0"
        >
          <p class="basis-2/3 h-full flex items-center font-semibold select-none">
            메뉴
            <div>
              <IconDropDown 
                class="-scale-y-100"
                @click="handleStatisticsSort('nameAsc')"
              />
              <IconDropDown 
                @click="handleStatisticsSort('nameDesc')"
              />
            </div>
          </p>
          <p class="basis-1/4 h-full flex justify-center items-center font-semibold select-none">
            가격
            <div>
              <IconDropDown 
                class="-scale-y-100"
                @click="handleStatisticsSort('priceAsc')"
              />
              <IconDropDown 
                @click="handleStatisticsSort('priceDesc')"
              />
            </div>
          </p>
          <p class="basis-1/6 min-w-fit text-center flex justify-center items-center font-semibold select-none">
            수량
            <div>
              <IconDropDown 
                class="-scale-y-100"
                @click="handleStatisticsSort('countAsc')"
              />
              <IconDropDown
                @click="handleStatisticsSort('countDesc')"
              />
            </div>
          </p>
          <p class="basis-1/4 min-w-[130px] text-center flex justify-center items-center font-semibold select-none">
            판매액
            <div>
              <IconDropDown 
                class="-scale-y-100"
                @click="handleStatisticsSort('saleAsc')"
              />
              <IconDropDown
                @click="handleStatisticsSort('saleDesc')"
              />
            </div>
          </p>
        </div>
        <div class="h-full overflow-y-scroll scrollbar-hide">
          <div
            class="flex flex-row justify-between font-normal pl-7 min-h-10 items-center border-b-1 border-primary-300 shrink-0 hover:bg-gray-200"
            v-for="(menu, index) in allOrderStatistics.menuSaleList"
            :key="index"
          >
            <p class="basis-2/3 text-secondary-700-light truncate">{{ menu.menuName }}</p>
            <p class="basis-1/4 min-w-fit text-center text-secondary-700-light">{{ prettyPrice(menu.menuPrice || 0) }}</p>
            <p class="basis-1/6 text-center text-secondary-700-light">{{ menu.menuCount }}개</p>
            <p class="basis-1/4 min-w-[130px] text-center text-secondary-700-light">{{ prettyPrice(menu.menuSale || 0) }}</p>
          </div>
        </div>
        <div
          class="grid place-items-center text-primary-900 font-medium text-2xl h-[73px] rounded-b-3xl bottom-0 shrink-0 bg-white border-secondary-600 shadow-[0px_-5px_6px_0px_rgba(0,0,0,0.1)]"
        >
          총액 : {{ prettyPrice(allOrderStatistics.totalSale || 0) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>
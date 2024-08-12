<script setup>
import { useBaseOrder } from '@/stores/orders/baseOrder';
import { useOrderStatistics } from '@/stores/orders/orderStatistics';
import { useBoothList } from '@/stores/booths/boothList';
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect, watch, onMounted } from 'vue';
import StatisticsGraph from '@/views/order/OrderStatisticsGraph.vue';
import { prettyPrice } from '@/utils/utils';
import { DATES } from '@/utils/constants';

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

const formattedMonth = computed(() => month.value.toString().padStart(2, '0'));
const formattedDates = computed(() => {
  return Object.keys(DATES).reduce((acc, key) => {
    acc[key.padStart(2, '0')] = DATES[key];
    return acc;
  }, {});
});

const currentMonth = new Date().getMonth() + 1;
const today = new Date().getDate();

const determineActiveDate = () => {
  if (currentMonth < 9) {
    return 0;
  } else if (currentMonth > 9) {
    return 2;
  } else {
    if (today === 11) {
      return 0;
    } else if (today === 12) {
      return 1;
    } else if (today === 13) {
      return 2;
    } else if (today < 11) {
      return 0;
    } else if (today > 13) {
      return 2;
    } else {
      return 1;
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
  <div class="w-full h-[638px] flex overflow-x-hidden">
    <div class="w-1/2 pt-20 pb-10 pl-10 h-full border border-primary-900 rounded-l-[20px]">
      <StatisticsGraph />
    </div>
    <div class="w-1/2 min-w-[490px] h-full overflow-hidden p-[40px] border-r border-y border-primary-900 rounded-r-[20px] flex flex-col justify-between items-center">
      <div class="min-w-[432px] font-semibold text-primary-900 text-[28px]">{{ selectBooth?.adminName }} 야간부스 매출 통계</div>
      <div class="w-full flex justify-center gap-4">
        <button
          type="button"
          class="min-w-[120px] w-[200px] h-[50px] is-button relative"
          v-for="(day, key, index) in formattedDates"
          :key="index"
          :class="{ 'is-outlined': index !== activeDate }"
          @click="handleButtonClick(index)"
        >
          {{ formattedMonth }}/{{ key }} ({{ day }})
        </button>
      </div>
      <div
        class="max-w-[712px] w-full h-[380px] rounded-3xl flex flex-col text-secondary-500 border-2 border-[rgba(0,115,240,0.16)] relative"
      >
        <div
          class="flex flex-row justify-between bg-[#E6F0FB] rounded-t-3xl font-semibold pl-7 h-[43px] border-b-2 border-[#C7C7C7] items-center shrink-0"
        >
          <p class="basis-1/3">메뉴</p>
          <p class="basis-1/5 text-center">수량</p>
          <p class="basis-1/5 min-w-[130px] text-center">가격</p>
        </div>
        <div class="h-full overflow-y-scroll scrollbar-hide">
          <div
            class="flex flex-row justify-between font-normal pl-7 h-10 items-center border-b-2 border-[#C7C7C7] shrink-0 hover:bg-gray-200"
            v-for="(menu, index) in allOrderStatistics.menuSaleList"
            :key="index"
          >
            <p class="basis-1/3">{{ menu.menuName }}</p>
            <p class="basis-1/5 text-center">{{ menu.menuCount }}개</p>
            <p class="basis-1/5 min-w-[130px] text-center">{{ prettyPrice(menu.menuSale || 0) }}</p>
          </div>
        </div>
        <div
          class="grid place-items-center text-primary-900 font-medium text-2xl h-[73px] rounded-b-3xl aboslute bottom-0 shrink-0 bg-white border-secondary-600 shadow-[0px_-3px_12px_rgba(0,0,0,0.12)]"
        >
          총액 : {{ prettyPrice(allOrderStatistics.totalSale || 0) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>
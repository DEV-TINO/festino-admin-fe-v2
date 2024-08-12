<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import { useOrderStatistics } from '@/stores/orders/orderStatistics';
import { storeToRefs } from 'pinia';
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, registerables } from "chart.js";
import { prettyPrice } from '@/utils/utils';

ChartJS.register(...registerables);

const useOrderStatisticsStore = useOrderStatistics();
const { allOrderStatistics } = storeToRefs(useOrderStatisticsStore);

const menuData = ref([]);
const isDataReady = ref(false);
const isLoading = ref(false);
const chartInstance = ref('');

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "야간부스 매출 통계",
      data: [],
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 130, 0, 300);
        gradient.addColorStop(0, "rgba(0, 115, 240, 0.01)");
        gradient.addColorStop(1, "rgba(0, 115, 240, 0.34)");
        return gradient;
      },
      borderColor: "#0073F0",
      borderWidth: 1,
      hoverBackgroundColor: (ctx) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 130, 0, 300);
        gradient.addColorStop(0, "rgba(0, 115, 240, 0.03)");
        gradient.addColorStop(1, "rgba(0, 115, 240, 0.64)");
        return gradient;
      },
      hoverBorderColor: "#0073F0",
      borderRadius: 10,
    }
  ]
});

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1000 },
  plugins: {
    title: { display: false },
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (tooltipItems) => `${tooltipItems[0].label}`,
        label: (tooltipItem) => {
          const index = tooltipItem.dataIndex;
          return `총 판매 금액 : ${prettyPrice(menuData.value[index]?.menuSale || 0)}`;
        },
      },
      backgroundColor: "rgba(0, 0, 0, 0.58)",
      titleFont: { size: 14, weight: "bold" },
      bodyFont: { size: 14 },
      displayColors: false,
      padding: 20,
      titleAlign: "center",
      bodyAlign: "center",
      cornerRadius: 12,
      xAlign: "center",
      yAlign: "bottom",
    },
  },
  scales: {
    x: {
      grid: { display: true },
      title: {
        display: true,
        text: '메뉴'
      }
    },
    y: {
      min: 0,
      max: 100,
      ticks: { stepSize: 10 },
      grid: { display: true },
      title: {
        display: true,
        text: '판매량'
      }
    },
  },
});

const updateYScaleMax = () => {
  const maxValue = Math.max(...menuData.value.map(menu => menu.menuCount));
  options.value.scales.y.max = Math.ceil(maxValue / 10) * 10;
};

const initializeChart = () => {
  if (allOrderStatistics.value?.menuSaleList?.length) {
    menuData.value = allOrderStatistics.value.menuSaleList;

    chartData.value.labels = menuData.value.map(menu => menu.menuName);
    chartData.value.datasets[0].data = menuData.value.map(menu => menu.menuCount);

    updateYScaleMax();

    nextTick(() => {
      if (chartInstance.value?.chartInstance) {
        chartInstance.value.chartInstance.update({ lazy: false, duration: 1000 });
      }
    });

    isDataReady.value = true;
  } else {
    isDataReady.value = false;
  }
};

const fetchStatisticsData = async() => {
  isLoading.value = true;
  try {
    await initializeChart();
  } catch (error) {
    console.error('Error fetching statistics:', error);
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => allOrderStatistics.value,
  async () => {
    if (allOrderStatistics.value) {
      await fetchStatisticsData();
    } else {
      console.warn('No statistics data available');
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="relative h-full w-full overflow-x-scroll">
    <div v-if="isLoading" class="flex justify-center items-center h-full">Loading...</div>
    <Bar v-if="isDataReady && !isLoading" ref="chartInstance" :data="chartData" :options="options" />
    <div v-else-if="!isLoading && !isDataReady" class="flex justify-center items-center h-full">No data available</div>
  </div>
</template>

<style>
</style>
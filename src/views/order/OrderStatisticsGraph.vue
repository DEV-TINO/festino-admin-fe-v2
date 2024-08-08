<script setup>
import { ref, watchEffect, nextTick } from 'vue';
import { useOrderStatistics } from '@/stores/orders/orderStatistics';
import { storeToRefs } from 'pinia';
import { Line } from "vue-chartjs";
import { Chart as ChartJS, registerables } from "chart.js";
import { prettyPrice } from '@/utils/utils';

ChartJS.register(...registerables);

const useOrderStatisticsStore = useOrderStatistics();
const { allOrderStatistics } = storeToRefs(useOrderStatisticsStore);

const menuData = ref([]);
const isDataReady = ref(false);
let chartInstance = null;

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "야간부스 매출 통계",
      data: [],
      borderColor: "#0073F0",
      borderWidth: 1.5,
      pointStyle: "circle",
      pointRadius: 5,
      pointBorderWidth: 10,
      pointBorderColor: "rgba(0, 115, 240, 0.24)",
      pointHoverRadius: 5,
      pointHoverBorderWidth: 10,
      pointHoverBorderColor: "#0073F0",
      pointBackgroundColor: "#0073F0",
      fill: true,
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 130, 0, 300);
        gradient.addColorStop(0, "rgba(0, 115, 240, 0.01)");
        gradient.addColorStop(1, "rgba(0, 115, 240, 0.34)");
        return gradient;
      },
    }
  ]
});

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1000 }, // Ensure animation is always applied
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
      padding: 15,
      titleAlign: "center",
      bodyAlign: "center",
      cornerRadius: 12,
      xAlign: "center",
      yAlign: "bottom",
    },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      min: 0,
      max: 100,
      ticks: { stepSize: 10 },
      grid: { display: false },
    },
  },
});

const updateYScaleMax = () => {
  const maxValue = Math.max(...menuData.value.map(menu => menu.menuCount));
  options.value.scales.y.max = Math.ceil(maxValue / 10) * 10;
};

const initializeChart = () => {
  if (allOrderStatistics.value?.menuSaleList) {
    menuData.value = allOrderStatistics.value.menuSaleList;

    chartData.value = {
      ...chartData.value,
      labels: menuData.value.map(menu => menu.menuName),
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: menuData.value.map(menu => menu.menuCount),
        }
      ]
    };

    updateYScaleMax();
    isDataReady.value = true;

    nextTick(() => {
      if (chartInstance?.chartInstance) {
        chartInstance.chartInstance.update({ lazy: false, duration: 1000 });
      }
    });
  }
};

watchEffect(() => {
  isDataReady.value = false;
  initializeChart();
});
</script>

<template>
  <div class="relative h-full w-full overflow-x-scroll">
    <Line v-if="isDataReady" ref="chartInstance" :data="chartData" :options="options" />
  </div>
</template>

<style>
</style>
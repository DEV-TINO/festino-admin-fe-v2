<script setup>
import { ref, nextTick, watchEffect } from 'vue';
import { useOrderStatistics } from '@/stores/orders/orderStatistics';
import { storeToRefs } from 'pinia';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, registerables } from 'chart.js';
import { prettyPrice } from '@/utils/utils';

ChartJS.register(...registerables);

const useOrderStatisticsStore = useOrderStatistics();
const { allOrderStatistics } = storeToRefs(useOrderStatisticsStore);

const menuData = ref([]);
const isDataReady = ref(false);
const isLoading = ref(false);
const chartInstance = ref(null);

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "야간부스 매출 통계",
      data: [],
      backgroundColor: '#ADC9F5',
      borderColor: "#0073F0",
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(0, 115, 240, 0.64)',
      hoverBorderColor: "#0073F0",
      borderRadius: 10,
    }
  ]
});

const options = ref({
  responsive: false,
  maintainAspectRatio: false,
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
    },
  },
  scales: {
    x: {
      grid: { display: true },
      title: {
        display: true,
        text: '[ 메뉴 ]',
        font: { size: 14 }
      },
      ticks: {
        maxRotation: 30,
        minRotation: 0,
        autoSkip: false,
        font: {
          size: 12,
        },
      },
      barThickness: 60,
      categoryPercentage: 1.0,
      barPercentage: 1.0,
    },
    y: {
      grid: { display: true },
      title: {
        display: true,
        text: '[ 판매량 ]',
        font: { size: 14 }
      },
      ticks: {
        stepSize: 10,
      },
      min: 0,
      max: 1000,
      beginAtZero: true,
    }
  }
});

// 너비를 동적으로 계산하는 함수
const calculateContainerWidth = () => {
  const baseWidth = 700; // 기본 너비
  const labelWidth = 60; // 레이블 하나당 추가되는 너비
  const totalLabels = chartData.value.labels.length;

  return totalLabels <= 7 ? baseWidth : baseWidth + (totalLabels - 7) * labelWidth;
};

const updateYScaleMax = () => {
  const maxValue = Math.max(...menuData.value.map(menu => menu.menuCount), 0);
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
        // `containerBody`의 너비를 업데이트합니다.
        const container = document.querySelector('.containerBody');
        if (container) {
          container.style.width = `${calculateContainerWidth()}px`;
        }
      }
    });

    isDataReady.value = true;
  } else {
    isDataReady.value = false;
  }
};

const fetchStatisticsData = async () => {
  isLoading.value = true;
  try {
    await initializeChart();
  } catch (error) {
    console.error('Error fetching statistics:', error);
  } finally {
    isLoading.value = false;
  }
};

watchEffect(
  async () => {
    if (allOrderStatistics.value) {
      await fetchStatisticsData();
    } else {
      console.warn('No statistics data available');
    }
  }
);
</script>

<template>
  <div class="w-full flex flex-col justify-center">
    <div class="w-full overflow-x-auto scrollbar-hide">
      <div v-if="!isLoading && isDataReady" class="min-w-[700px] h-[500px]">
        <Bar 
          v-if="isDataReady && !isLoading"
          ref="chartInstance"
          :data="chartData"
          :options="options"
          class="h-[500px]"
        />
      </div>
    </div>
    <div v-if="isLoading" class="flex justify-center items-center h-full">Loading...</div>
    <div v-if="!isLoading && !isDataReady" class="flex justify-center items-center h-full">No data available</div>
  </div>
</template>

<style>
</style>
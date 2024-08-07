<script setup>
import { useOrderStatistics } from '@/stores/orders/orderStatistics';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const useOrderStatisticsStore = useOrderStatistics();

const { allOrderStatistics } = storeToRefs(useOrderStatisticsStore);

const menuData = ref([]);
const DATA_COUNT = ref(0);

function generateRandomNumbers(count, min, max) {
  const numbers = [];
  for (let i = 0; i < count; i++) {
    numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return numbers;
}

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "",
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

onMounted(() => {
  menuData.value = allOrderStatistics.menuSaleList;
  DATA_COUNT.value = menuData.value.length;
  chartData.value.labels = menuData.value.map((menu) => menu.menuName);
  chartData.value.datasets[0].data = generateRandomNumbers(DATA_COUNT.value, 0, 100);
});
</script>

<template>
  <div>
  </div>
</template>

<style>
</style>
<script setup>
import OrderCancel from '@/views/order/OrderCancel.vue';
import OrderCookingCard from './OrderCookingCard.vue';
import OrderFinishCard from './OrderFinishCard.vue';
import OrderReadyCard from './OrderReadyCard.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    default: 'ready',
  }, //
  cardData: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="w-full flex flex-col 2xl:items-center 2xl:px-8">
    <OrderReadyCard v-if="type === 'ready'" v-bind="cardData" />
    <OrderCookingCard v-if="type === 'cooking'" v-bind="cardData" />
    <OrderFinishCard v-if="type === 'finish'" v-bind="cardData" />
    <OrderCancel v-if="type === 'cancel'" v-bind="cardData" />
  </div>
</template>

<style lang="scss" scoped></style>

<template>
  <div>주문 메인 {{ boothId }}</div>
</template>

<script setup>
const props = defineProps({
  boothId: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>

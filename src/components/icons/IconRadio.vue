<script setup>
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div class="cursor-pointer">
    <svg
      v-if="isActive && !readOnly"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#0073F0" />
      <path
        d="M7.19922 11.9984L10.7992 15.5984L17.9992 8.39844"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
    <svg
      v-if="!isActive && !readOnly"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#CCCCCC" />
      <path
        d="M7.19922 11.9984L10.7992 15.5984L17.9992 8.39844"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
    <svg
      v-if="isActive && readOnly"
      width="20"
      height="20"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12.5" r="12" fill="#66CF55" />
      <path d="M7.19922 12.5L10.7992 16.1L17.9992 8.90002" stroke="white" stroke-width="2" stroke-linecap="round" />
    </svg>
    <svg
      v-if="!isActive && readOnly"
      width="20"
      height="20"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12.5" r="12" fill="#FF6D6D" />
      <path d="M7.19922 12.5L10.7992 16.1L17.9992 8.90002" stroke="white" stroke-width="2" stroke-linecap="round" />
    </svg>
  </div>
</template>

<style lang="scss" scoped></style>

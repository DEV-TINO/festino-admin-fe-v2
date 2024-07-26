<script setup>
import MobileHeader from '@/components/mobiles/MobileHeader.vue';
import { RouterView, useRouter } from 'vue-router';
import { ref, watchEffect, onMounted } from 'vue';
import { useBoothList } from '@/stores/booths/boothList';
import { useUser } from '@/stores/user';
import { storeToRefs } from "pinia";

const { getAllBoothList } = useBoothList();
const { boothList } = storeToRefs(useBoothList());
const { isAdmin, userOwnBoothId } = storeToRefs(useUser());
const { getUserOwnBoothId } = useUser();

const router = useRouter();
const isLoginPage = ref(false);
const isMainPage = ref(false);
const title = ref('');
const reserveBoothList = ref([]);
const selectBooth = ref('');
const selectBoothId = ref('');

watchEffect(() => {
  const currentRoute = router.currentRoute.value;
  const currentRouteName = currentRoute.name;
  isLoginPage.value = currentRouteName == 'mobileLogin';
  isMainPage.value = currentRouteName == 'mobileMain';
  if (currentRouteName == 'mobile-booth') {
    title.value = '부스 등록 및 수정';
  } else {
    title.value = `${selectBooth.value.adminName}`;
  }
});

watchEffect(() => {
  if (!selectBoothId.value) return;
  if (!reserveBoothList.value) return;
  selectBooth.value = reserveBoothList.value.find((booth) => booth.boothId === selectBoothId.value);
});

onMounted(async () => {
  await getUserOwnBoothId();
  await getAllBoothList();
  reserveBoothList.value = boothList.value.filter((booth) => booth?.isReservation);
  if (isAdmin.value) {
    selectBoothId.value = reserveBoothList.value[0].boothId;
  } else {
    if (userOwnBoothId.value) {
      selectBoothId.value = userOwnBoothId.value;
    } else {
      router.push('/');
    }
  }
});
</script>

<template>
  <div class="min-w-[375px] max-w-[500px] bg-white min-h-screen shadow-xs mx-auto">
    <MobileHeader v-if="!isLoginPage" :title="title" :isMainPage="isMainPage" />
    <RouterView />
  </div>
</template>

<style lang="css" scoped></style>

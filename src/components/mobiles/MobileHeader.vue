<script setup>
import router from '@/router';
import IconHeaderBack from '@/components/icons/mobiles/IconHeaderBack.vue';
import { useUser } from '@/stores/user';
import { ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useBoothDetail } from '@/stores/booths/boothDetail';

const useUserStore = useUser();
const useBoothDetailStore = useBoothDetail();

const { boothInfo } = storeToRefs(useBoothDetailStore);
const { isAdmin } = storeToRefs(useUserStore);
const routerName = ref('');

const handleClickBackButton = () => {
  router.push({ name: 'MobileMain' });
};
const handleClickLogoutButton = async () => {
  await useUserStore.logout();
  router.push({ name: 'MobileLogin' });
};

watchEffect(() => (routerName.value = router.currentRoute.value.name));
</script>

<template>
  <div
    class="w-full h-[60px] bg-white flex justify-between items-center px-6 shadow-xs"
    v-if="router.currentRoute.value.name != 'MobileLogin'"
  >
    <div class="w-[42px]">
      <IconHeaderBack @click="handleClickBackButton()" v-if="router.currentRoute.value.name != 'MobileMain'" />
    </div>
    <p class="font-medium text-xl text-secondary-700">
      {{ isAdmin ? '개발팀' : boothInfo.adminName }}
    </p>
    <div class="w-[42px] text-xs underline text-[#999999] underline-offset-4">
      <p
        @click="handleClickLogoutButton()"
        class="cursor-pointer"
        v-if="router.currentRoute.value.name === 'MobileMain'"
      >
        로그아웃
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

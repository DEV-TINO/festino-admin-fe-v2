<script setup>
import router from '@/router';
import IconHeaderBack from '@/components/icons/mobiles/IconHeaderBack.vue';
import { useUser } from '@/stores/user';
import { watch, ref } from 'vue';
import { useBoothUser } from '@/stores/mobiles/boothUser';
import { storeToRefs } from 'pinia';

const useUserStore = useUser();
const useBoothUserStore = useBoothUser();

const { userBoothInfo } = storeToRefs(useBoothUserStore);
const routerName = ref('');

const handleClickBackButton = () => {
  router.push({ name: 'MobileMain' });
};
const handleClickLogoutButton = async () => {
  await useUserStore.logout();
  router.push({ name: 'MobileLogin' });
};

watch(() => (routerName.value = router.currentRoute.value.name), { immediate: true });
</script>

<template>
  <div
    class="w-full h-[60px] bg-white flex justify-between items-center px-6 shadow-xs mb-7"
    v-if="router.currentRoute.value.name != 'MobileLogin'"
  >
    <div class="w-7">
      <IconHeaderBack @click="handleClickBackButton()" v-if="router.currentRoute.value.name != 'MobileMain'" />
    </div>
    <p class="font-medium text-xl">{{ userBoothInfo.adminName }}</p>
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

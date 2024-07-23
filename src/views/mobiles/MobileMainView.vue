<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import IconBoothTino from '@/components/icons/mobiles/IconBoothTino.vue';
import IconBannerArrow from '@/components/icons/mobiles/IconBannerArrow.vue';
import IconReserveTino from '@/components/icons/mobiles/IconReserveTino.vue';
import { useRouter } from 'vue-router';
import { useBoothUser } from '@/stores/mobiles/boothUser';
import { useBoothList } from '@/stores/booths/boothList';
import { useUser } from '@/stores/user';

const router = useRouter();
const useUserStore = useUser();
const useBoothUserStore = useBoothUser();

const { userOwnBoothId } = storeToRefs(useUserStore);
const { userBoothInfo } = storeToRefs(useBoothUserStore);

onMounted(async () => {
  await useBoothUserStore.getBoothId();
  useBoothUserStore.findUserBoothInfo(userOwnBoothId);
});

const handleClickAdminMenu = (type) => {
  if (type === 'booth') {
    router.push({ name: 'MobileBooth' });
  }
  if (type === 'reserve') {
    router.push({ name: '' });
  }
};
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full h-full gap-10 dynamic-padding">
    <div class="flex flex-col gap-[30px] text-secondary-700 w-full">
      <p class="font-semibold text-xl">부스 등록 및 수정</p>
      <div
        class="bg-primary-900 rounded-[20px] flex flex-col items-center w-full relative h-[190px] justify-end p-5 cursor-pointer"
        @click="handleClickAdminMenu('booth')"
      >
        <IconBoothTino class="absolute -top-7" />
        <div class="bg-white flex rounded-[20px] justify-between w-full h-[88px] p-5 items-center">
          <div class="flex flex-col gap-[6px]">
            <!-- TODO: 부스 아이디 가져오는 api 오류 해결되면 수정 -->
            <p class="font-semibold">메카트로닉스공학부</p>
            <p class="text-xs">부스 운영을 응원합니다!</p>
          </div>
          <IconBannerArrow />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-[30px] text-secondary-700 w-full">
      <p class="font-semibold text-xl">예약관리</p>
      <div
        class="bg-primary-900 rounded-[20px] flex flex-col items-center w-full relative h-[190px] justify-end p-5 cursor-pointer"
        @click="handleClickAdminMenu('reserve')"
      >
        <IconReserveTino class="absolute -top-7" />
        <div class="bg-white flex rounded-[20px] justify-between w-full h-[88px] p-5 items-center">
          <div class="flex flex-col gap-[6px]">
            <!-- TODO: 부스 아이디 가져오는 api 오류 해결되면 수정 -->
            <p class="font-semibold">25팀 대기 중</p>
            <p class="text-xs">예약 서비스 운영 시간 10:00 ~ 22:00</p>
          </div>
          <IconBannerArrow />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.dynamic-padding {
  padding-right: calc(40 / 430 * 100%);
  padding-left: calc(40 / 430 * 100%);
}
</style>

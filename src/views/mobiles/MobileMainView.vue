<script setup>
import IconBoothTino from '@/components/icons/mobiles/IconBoothTino.vue';
import IconBannerArrow from '@/components/icons/mobiles/IconBannerArrow.vue';
import { useRouter } from 'vue-router';
import IconReserveTino from '@/components/icons/mobiles/IconReserveTino.vue';

const router = useRouter();

const handleRouter = (page, id) => {
  router.push({ path: `/admin/${id}/${page}` });
};
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full h-full gap-10 dynamic-padding">
    <div class="flex flex-col gap-[30px] text-secondary-700 w-full">
      <p class="font-semibold text-xl">부스 등록 및 수정</p>
      <div class="bg-primary-900 rounded-[20px] flex flex-col items-center w-full relative h-[190px] justify-end p-5">
        <IconBoothTino class="absolute -top-7" />
        <div class="bg-white flex rounded-[20px] justify-between w-full h-[88px] p-5 items-center">
          <div class="flex flex-col gap-[6px]">
            <p class="font-semibold">메카트로닉스공학부</p>
            <p class="text-xs">부스 운영을 응원합니다!</p>
          </div>
          <IconBannerArrow />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-[30px] text-secondary-700 w-full">
      <p class="font-semibold text-xl">예약관리</p>
      <div class="bg-primary-900 rounded-[20px] flex flex-col items-center w-full relative h-[190px] justify-end p-5">
        <IconReserveTino class="absolute -top-7" />
        <div class="bg-white flex rounded-[20px] justify-between w-full h-[88px] p-5 items-center">
          <div class="flex flex-col gap-[6px]">
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

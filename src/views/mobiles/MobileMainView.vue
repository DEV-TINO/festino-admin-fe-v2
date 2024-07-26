<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import IconBoothTino from '@/components/icons/mobiles/IconBoothTino.vue';
import IconBannerArrow from '@/components/icons/mobiles/IconBannerArrow.vue';
import IconReserveTino from '@/components/icons/mobiles/IconReserveTino.vue';
import { useRouter } from 'vue-router';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useUser } from '@/stores/user';
import { useBoothList } from '@/stores/booths/boothList';

const router = useRouter();
const useBoothDetailStore = useBoothDetail();
const useUserStore = useUser();
const useBoothListStore = useBoothList();

const { userOwnBoothId, isAdmin } = storeToRefs(useUserStore);
const { boothInfo, boothType } = storeToRefs(useBoothDetailStore);

onMounted(async () => {
  await useUserStore.getUserOwnBoothId();
  useBoothDetailStore.getBoothInfo(userOwnBoothId.value);
});

const handleClickAdminMenu = (type) => {
  if (type === 'booth') {
    router.push({ name: 'MobileBooth' });
  }
  if (type === 'reserve') {
    router.push({ name: 'MobileReserve' });
  }
};
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full h-full gap-10 mobile-padding">
    <div class="flex flex-col gap-[30px] text-secondary-700 w-full">
      <p class="font-semibold text-xl">부스 등록 및 수정</p>
      <div
        class="bg-primary-900 rounded-[20px] flex flex-col items-center w-full relative h-[190px] justify-end p-5 cursor-pointer"
        @click="handleClickAdminMenu('booth')"
      >
        <IconBoothTino class="absolute -top-7" />
        <div class="bg-white flex rounded-[20px] justify-between w-full h-[88px] p-5 items-center">
          <div class="flex flex-col gap-[6px] font-semibold">
            {{ isAdmin ? '개발팀' : boothInfo.adminName }}
            <p class="text-xs">부스 운영을 응원합니다!</p>
          </div>
          <IconBannerArrow />
        </div>
      </div>
    </div>
    <div v-if="boothType === 'night' || isAdmin" class="flex flex-col gap-[30px] text-secondary-700 w-full">
      <p class="font-semibold text-xl">예약관리</p>
      <div
        class="bg-primary-900 rounded-[20px] flex flex-col items-center w-full relative h-[190px] justify-end p-5 cursor-pointer"
        @click="handleClickAdminMenu('reserve')"
      >
        <IconReserveTino class="absolute -top-7" />
        <div class="bg-white flex rounded-[20px] justify-between w-full h-[88px] p-5 items-center">
          <div class="flex flex-col gap-[6px]">
            <p class="font-semibold">
              {{ isAdmin ? '예약 서비스' : `${boothInfo.totalReservationNum}팀 대기 중` }}
            </p>
            <p class="text-xs" v-if="!isAdmin">예약 서비스 운영 시간 10:00 ~ 22:00</p>
          </div>
          <IconBannerArrow />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.mobile-padding {
  padding-right: calc(40 / 430 * 100%);
  padding-left: calc(40 / 430 * 100%);
}
</style>

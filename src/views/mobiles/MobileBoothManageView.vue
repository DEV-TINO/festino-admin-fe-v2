<script setup>
import IconBoothListToggle from '@/components/icons/IconBoothListToggle.vue';
import IconAdd from '@/components/icons/mobiles/IconAdd.vue';
import SelectOption from '@/components/mobiles/SelectOption.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { storeToRefs } from 'pinia';
import { useUser } from '@/stores/user';
import { api } from '@/utils/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const useBoothDetailStore = useBoothDetail();
const useUserStore = useUser();

const { boothInfo, menuList, boothType } = storeToRefs(useBoothDetailStore);

const isSubmit = ref(false);
const useReservation = ref(false);
const useCoupon = ref(false);
const useOrder = ref(false);

const characterCount = computed(() => boothInfo.value?.boothIntro?.length ?? 0);

const serviceHours = ref('');
const handleInputBoothName = (event) => {
  if (isSubmit.value) return;
  boothInfo.value.boothName = event.target.value;
};

const handleInputServiceHours = (event) => {
  if (isSubmit.value) return;
  serviceHours.value = event.target.value;
};

const handleInputBoothIntro = (event) => {
  if (isSubmit.value) return;
  boothInfo.value.boothIntro = event.target.value;
};
//TODO: ADD BOOTH IMAGE
//TODO: ADD MENU

const handleClickSumbit = async () => {
  if (isSubmit.value) return;
  isSubmit.value = true;

  if (
    !boothInfo.value.adminName.length ||
    !boothInfo.value.boothName.length ||
    !serviceHours.value.length ||
    !boothInfo.value.boothIntro.length
  ) {
    return;
  }
  const pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]\s*~\s*([01]?[0-9]|2[0-4]):([0-5][0-9]|60)$/;

  if (!pattern.test(serviceHours.value.trim())) {
    // alert('올바른 운영시간을 입력해주세요. 예: 00:00 ~ 24:00');
    return;
  }
  const [startTime, endTime] = serviceHours.value.split('~').map((time) => time.trim());

  boothInfo.value.openTime = startTime;
  boothInfo.value.closeTime = endTime;
  // boothInfo.value.boothImage = fileUrls.value;

  //nightbooth
  if (boothType.value === 'night') {
    boothInfo.value = {
      ...boothInfo.value,
      isReservation: useReservation.value,
      isOrder: useOrder.value,
    };
  }

  const saveBoothUrl = `/admin/booth/${boothType.value}`;
  const saveBoothResponse = await api.put(saveBoothUrl, boothInfo.value);

  isSubmit.value = false;
  router.push({ name: 'MobileMain' });
};

onMounted(async () => {
  useBoothDetailStore.reset();
  const userBoothId = await useUserStore.getUserOwnBoothId();
  const condition = await useBoothDetailStore.init(userBoothId);
  if (condition) {
    //TODO: ADD BOOTH IMAGE
    serviceHours.value = `${boothInfo.value.openTime} ~ ${boothInfo.value.closeTime}`;
    if (boothType.value === 'night') {
      useReservation.value = boothInfo.value.isReservation;
      useOrder.value = boothInfo.value.isOrder;
    }
  } else {
    //부스정보 불러오기 실패
  }
});
</script>
<template>
  <form class="w-full h-full" @submit.prevent="handleClickSumbit()">
    <div class="dynamic-padding flex flex-col gap-[20px]">
      <div class="flex gap-[10px] items-center">
        <div class="w-[90px] font-bold text-base shrink-0">학과</div>
        <div class="w-full h-11 px-5 py-3 bg-black bg-opacity-5 rounded-[10px] text-sm">{{ boothInfo?.adminName }}</div>
      </div>
      <div class="flex gap-[10px] items-center">
        <div class="w-[90px] font-bold text-base shrink-0">부스이름</div>
        <input
          type="text"
          placeholder="부스 이름을 작성해주세요."
          class="w-full px-5 py-3 bg-black bg-opacity-5 rounded-[10px] text-sm foucs:outline-none"
          maxlength="100"
          @input="handleInputBoothName($event)"
          :value="boothInfo?.boothName"
          :disabled="isSubmit"
        />
      </div>
      <div class="flex gap-[10px] items-center">
        <div class="w-[90px] font-bold text-base shrink-0">운영 시간</div>
        <input
          type="text"
          placeholder="예) 15:00 ~ 20:00"
          class="w-full px-5 py-3 bg-black bg-opacity-5 rounded-[10px] text-sm foucs:outline-none"
          maxlength="20"
          @input="handleInputServiceHours($event)"
          :value="serviceHours"
          :disabled="isSubmit"
        />
        <IconBoothListToggle :width="48" :is-active="boothInfo?.isOpen" @click="boothInfo.isOpen = !boothInfo.isOpen" />
      </div>
      <div class="relative flex flex-col gap-[10px] items-start">
        <div class="font-bold text-base">부스 소개</div>
        <textarea
          type="text"
          placeholder="부스 소개를 작성해주세요."
          class="resize-none w-full h-[97px] bg-black bg-opacity-5 rounded-3xl text-sm border-none p-5 pr-20 overflow-hidden"
          maxlength="100"
          @input="handleInputBoothIntro($event)"
          :value="boothInfo.boothIntro"
          :disabled="isSubmit"
        />
        <div class="absolute bottom-9 right-5 text-sm">{{ characterCount }}/100</div>
      </div>
      <div class="flex flex-col gap-[10px] items-start">
        <div class="font-bold text-base">부스 사진</div>
        <!-- ADD: BOOTH IMAGE -->
      </div>
      <div class="flex flex-col gap-[10px] items-start">
        <div class="font-bold text-base">메뉴 정보</div>
        <!-- <MobileMenuDetail /> -->
        <div class="w-full h-[150px] flex flex-col items-center justify-center border-dashed border-2 rounded-3xl">
          <IconAdd />
          <div class="pt-[10px] text-base">메뉴 추가하기</div>
        </div>
      </div>
      <!-- Show when night booth -->
      <div class="flex flex-col gap-[10px] items-start" v-if="boothType === 'night'">
        <div class="font-bold text-base shrink-0">예약 기능 사용 여부</div>
        <SelectOption v-model="useReservation" />
      </div>
      <div class="flex flex-col gap-[10px] items-start" v-if="boothType === 'night'">
        <div class="font-bold text-base shrink-0">쿠폰 진행 여부</div>
        <SelectOption v-model="useCoupon" />
      </div>
      <div class="flex flex-col gap-[10px] items-start" v-if="boothType === 'night'">
        <div class="font-bold text-base shrink-0">주문 기능 사용 여부</div>
        <SelectOption v-model="useOrder" />
      </div>
    </div>
    <div class="w-full dynamic-padding flex gap-[10px] py-20">
      <button class="w-full bg-[#CCCCCC] rounded-[50px] text-white font-bold h-[54px]">취소</button>
      <button class="w-full bg-[#CCCCCC] rounded-[50px] text-white font-bold h-[54px]" @click="handleClickSumbit()">
        등록
      </button>
    </div>
  </form>
</template>

<style lang="css" scoped>
.dynamic-padding {
  padding-left: calc(20 / 430 * 100%) !important;
  padding-right: calc(20 / 430 * 100%) !important;
}
</style>

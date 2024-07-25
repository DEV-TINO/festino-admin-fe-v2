<script setup>
import IconBoothListToggle from '@/components/icons/IconBoothListToggle.vue';
import IconAdd from '@/components/icons/mobiles/IconAdd.vue';
import SelectOption from '@/components/mobiles/SelectOption.vue';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { storeToRefs } from 'pinia';
import { useUser } from '@/stores/user';
import { api } from '@/utils/api';
import { useRouter } from 'vue-router';
import { useBoothList } from '@/stores/booths/boothList';
import { ADMIN_CATEGORY } from '@/utils/constants';

const router = useRouter();
const useBoothDetailStore = useBoothDetail();
const useUserStore = useUser();
const useBoothListStore = useBoothList();

const { boothInfo, menuList, boothType } = storeToRefs(useBoothDetailStore);
const { isAdmin } = storeToRefs(useUserStore);
const { boothList } = storeToRefs(useBoothListStore);

const isSubmit = ref(false);
const useReservation = ref(false);
const useCoupon = ref(false);
const useOrder = ref(false);
const selectedBoothId = ref('');

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
    alert('올바른 운영시간을 입력해주세요. 예: 00:00 ~ 24:00');
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
  // TODO: ADD ERROR HANDLING
  const saveBoothResponse = await api.put(saveBoothUrl, boothInfo.value);

  isSubmit.value = false;
  // TODO: 수정하고 모달 띄우기
};

const handleClickCancleButton = () => {
  router.push({ name: 'MobileMain' });
};

watch(selectedBoothId, async () => {
  useBoothDetailStore.reset();
  const selectedBoothInfo = boothList.value.find((booth) => booth.boothId === selectedBoothId.value);
  boothType.value = ADMIN_CATEGORY[selectedBoothInfo.adminCategory];
  serviceHours.value = `${selectedBoothInfo.openTime} ~ ${selectedBoothInfo.closeTime}`;
  if (boothType.value === 'night') {
    useReservation.value = selectedBoothInfo.isReservation;
    useOrder.value = selectedBoothInfo.isOrder;
  }
  const res = await useBoothDetailStore.getBoothDetail({ boothId: selectedBoothId.value, type: boothType.value });
});

onMounted(async () => {
  useBoothDetailStore.reset();
  if (!isAdmin.value) {
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
  }
  if (isAdmin.value) {
    console.log(isAdmin.value);
    await useBoothListStore.getAllBoothList();
    selectedBoothId.value = boothList.value[0].boothId;
  }
});
</script>
<template>
  <form class="w-full h-full" @submit.prevent="handleClickSumbit()">
    <div class="dynamic-padding flex flex-col gap-[20px] text-secondary-700-light">
      <div class="flex gap-[10px] items-center">
        <div class="w-[90px] font-bold text-base shrink-0">학과</div>
        <div
          v-if="!isAdmin"
          class="w-full h-11 px-5 py-3 bg-primary-300-light rounded-2lg text-sm text-secondary-900-light"
        >
          {{ boothInfo?.adminName }}
        </div>
        <select
          v-if="isAdmin"
          class="w-full h-11 px-5 py-3 bg-primary-300-light rounded-2lg text-sm border-none"
          v-model="selectedBoothId"
        >
          <option v-for="(booth, index) in boothList" :key="index" :value="booth.boothId">{{ booth.adminName }}</option>
        </select>
      </div>
      <div class="flex gap-[10px] items-center">
        <div class="w-[90px] font-bold text-base shrink-0">부스이름</div>
        <input
          type="text"
          placeholder="부스 이름을 작성해주세요."
          class="w-full px-5 py-3 bg-primary-300-light rounded-2lg text-sm border-none placeholder:text-secondary-900-light"
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
          class="w-full px-5 py-3 bg-primary-300-light rounded-2lg text-sm border-none placeholder:text-secondary-900-light"
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
          class="resize-none w-full h-[97px] bg-primary-300-light rounded-3xl text-sm border-none p-5 pr-20 overflow-hidden placeholder:text-secondary-900-light"
          maxlength="100"
          @input="handleInputBoothIntro($event)"
          :value="boothInfo.boothIntro"
          :disabled="isSubmit"
        />
        <div class="absolute bottom-4 right-5 text-sm">{{ characterCount }}/100</div>
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
          <div class="pt-[10px] text-sm text-secondary-900-light">메뉴 추가하기</div>
        </div>
      </div>
      <!-- Show when night booth -->
      <div v-if="boothType === 'night'" class="flex flex-col gap-[10px] items-start">
        <div class="font-bold text-base shrink-0">예약 기능 사용 여부</div>
        <SelectOption v-model="useReservation" />
      </div>
      <div v-if="boothType === 'night'" class="flex flex-col gap-[10px] items-start">
        <div class="font-bold text-base shrink-0">쿠폰 진행 여부</div>
        <SelectOption v-model="useCoupon" />
      </div>
      <div v-if="boothType === 'night'" class="flex flex-col gap-[10px] items-start">
        <div class="font-bold text-base shrink-0">주문 기능 사용 여부</div>
        <SelectOption v-model="useOrder" />
      </div>
    </div>
    <div class="w-full dynamic-padding flex gap-[10px] py-20">
      <button class="w-full rounded-[50px] h-[54px] is-button is-outlined" @click="handleClickCancleButton()">
        취소
      </button>
      <button class="w-full rounded-[50px] h-[54px] is-button" @click="handleClickSumbit()">등록</button>
    </div>
  </form>
</template>

<style lang="css" scoped>
.dynamic-padding {
  padding-left: calc(20 / 430 * 100%) !important;
  padding-right: calc(20 / 430 * 100%) !important;
}
</style>

<script setup>
import { BOOTH_POPUP_INFO, modalInfo } from '@/utils/constants';
import IconBoothInfo from '../icons/IconBoothInfo.vue';
import { useReservePopup } from '@/stores/reserve/reservePopup';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watchEffect } from 'vue';

const useReservePopupStore = useReservePopup();
const { submitBoothReservePopup, submitPopup, closePopup } = useReservePopupStore;
const { reservationInfo, boothInfo, popupType } = storeToRefs(useReservePopupStore);

const isSubmit = ref(false);

const submit = ref(null);

const handleSubmit = async () => {
  if (isSubmit.value) return;
  isSubmit.value = true;
  if (popupType.value === 'booth') {
    submitBoothReservePopup();
  } else {
    submitPopup();
  }
  isSubmit.value = false;
};

const title = ref('');
const subTitle = ref('');

watchEffect(() => {
  if (popupType.value === 'booth') {
    title.value = BOOTH_POPUP_INFO.booth[boothInfo.value.isReservation].title;
    subTitle.value = BOOTH_POPUP_INFO.booth[boothInfo.value.isReservation].subTitle;
  } else {
    title.value = BOOTH_POPUP_INFO[popupType.value].title;
    subTitle.value = BOOTH_POPUP_INFO[popupType.value].subTitle;
  }
});

onMounted(() => {
  submit.value?.focus();
});
</script>

<template>
  <form @submit.prevent="handleSubmit()">
    <div
      class="w-[400px] h-[260px] flex flex-col justify-between items-center bg-white rounded-2xl p-8"
    >
      <!-- Info -->
      <div class="flex flex-col justify-center items-center w-full">
        <IconBoothInfo :type="popupType === 'cancel' ? 'danger' : 'info'" />
        <p class="text-md font-bold text-secondary-700 pt-[20px]">
          {{ title }}
        </p>

        <!-- Table... Optional -->
        <div v-if="popupType === 'reserve'" class="w-full flex flex-col gap-[10px] py-[10px]">
          <div class="text-secondary-700-light text-xl font-medium">예약자 정보</div>
          <div class="relative rounded-xl border-primary-700 border w-full">
            <table class="w-full">
              <thead class="bg-primary-700-light text-secondary-900 h-[50px]">
                <tr class="">
                  <th class="font-light text-center">예약 번호</th>
                  <th class="font-light text-center">예약자</th>
                  <th class="font-light text-center">연락처</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center h-[50px]">
                  <td>{{ reservationInfo.reservationNum }}</td>
                  <td>{{ reservationInfo.userName }}</td>
                  <td>{{ reservationInfo.phoneNum }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p class="pt-[12px] text-secondary-700-light text-sm whitespace-pre-wrap text-center">
          {{ subTitle }}
        </p>
      </div>

      <!-- Button Row -->
      <div class="flex justify-between gap-[20px] w-full items-end">
        <button
          type="button"
          class="grow h-[40px] is-button is-outlined text-sm"
          :class="{
            'is-danger': popupType === 'cancel',
          }"
          @click="closePopup()"
        >
          취소
        </button>
        <button
          type="submit"
          class="grow h-[40px] is-button text-sm"
          :class="{
            'is-danger': popupType === 'cancel',
          }"
          autofocus
          ref="submit"
        >
          확인
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>

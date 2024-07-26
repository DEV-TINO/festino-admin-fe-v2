<script setup>
import IconBoothListToggle from '@/components/icons/IconBoothListToggle.vue';
import IconAdd from '@/components/icons/mobiles/IconAdd.vue';
import SelectOption from '@/components/mobiles/SelectOption.vue';
import IconFileUpload from '@/components/icons/IconFileUpload.vue';
import IconDelete from '@/components/icons/mobiles/IconDelete.vue';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { storeToRefs } from 'pinia';
import { useUser } from '@/stores/user';
import { api, imagesUpload } from '@/utils/api';
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

const isDragging = ref(false);
const dragIndex = ref(null);
const dropIndex = ref(null);
const fileUrls = ref([]);

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

const handleAddImages = (event) => {
  const imageLists = event.target.files;
  let imageUrlLists = [...fileUrls.value];

  for (let i = 0; i < imageLists.length; i++) {
    const currentImageUrl = URL.createObjectURL(imageLists[i]);
    imageUrlLists.push(currentImageUrl);
  }

  if (imageUrlLists.length > 10) {
    imageUrlLists = imageUrlLists.slice(0, 10);
  }

  fileUrls.value = imageUrlLists;
};

const handleDeleteImage = (id) => {
  fileUrls.value = fileUrls.value.filter((_, index) => index !== id);
};

const handleDragStart = (event, index) => {
  dragIndex.value = index;
  event.dataTransfer.effectAllowed = 'move';
};

const handleDragOver = (event) => {
  event.preventDefault();
};

const handleDragEnter = (event, index) => {
  dropIndex.value = index;
};

const handleDrop = () => {
  if (dragIndex.value !== null && dropIndex.value !== null && dragIndex.value !== dropIndex.value) {
    const draggedItem = fileUrls.value[dragIndex.value];
    fileUrls.value.splice(dragIndex.value, 1);
    fileUrls.value.splice(dropIndex.value, 0, draggedItem);
  }
  dragIndex.value = null;
  dropIndex.value = null;
};

const handleDragEnd = () => {
  isDragging.value = false;
};

const handleFileinput = (event) => {
  if (isSubmit.value) return;
  const files = event.target.files;
  handleFiles(files);
};

const handleFiles = async (files) => {
  if (files.length > 0) {
    const urls = await imagesUpload(files);
    fileUrls.value = [...fileUrls.value, ...urls];
  }
};

const setBackgroundImage = (url) => {
  return {
    backgroundImage: `url(${url})`,
  };
};
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
  boothInfo.value.boothImage = fileUrls.value;

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
  if(!isAdmin.value) {
    const userBoothId = await useUserStore.getUserOwnBoothId();
    const condition = await useBoothDetailStore.init(userBoothId);
    if (condition) {
      fileUrls.value = [...boothInfo.value.boothImage];
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
          <div
            class="w-full h-[150px] p-3.5 flex flex-row border-2 border-dashed cursor-pointer bg-primary-300-light rounded-3xl text-secondary-300-light mb-2 overflow-x-scroll overflow-y-hidden"
            @dragover="handleDragOver"
            @drop="handleDrop"
          >
            <label
              v-if="fileUrls.length === 0"
              for="dropzone-file"
              class="w-full flex flex-col items-center justify-center"
            >
              <div class="flex flex-col items-center justify-center">
                <IconFileUpload class="pb-1" />
                <p class="text-sm text-third-10 dark:text-third-10">부스사진을 등록해주세요.</p>
                <p class="text-sm text-third-10 dark:text-third-10">최대 10장까지 첨부 가능</p>
              </div>
              <input 
                id="dropzone-file"
                type="file"
                accept="image/*"
                class="hidden"
                multiple
                @input="handleFileinput($event)"
              />
            </label>
            <div
              v-for="(url, index) in fileUrls"
              :key="index"
              class="relative w-[120px] h-[120px] flex-shrink-0 mr-2"
              draggable="true"
              @dragstart="event => handleDragStart(event, index)"
              @dragenter="event => handleDragEnter(event, index)"
              @dragend="handleDragEnd"
            >
            <div :style="setBackgroundImage(url)" class="w-full h-full object-cover rounded-3xl border bg-cover"></div>
            <IconDelete @click="handleDeleteImage(index)" class="absolute top-2 right-2" />
          </div>
        </div>
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
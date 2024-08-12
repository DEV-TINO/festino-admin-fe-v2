<script setup>
import IconBoothListToggle from '@/components/icons/IconBoothListToggle.vue';
import IconAdd from '@/components/icons/mobiles/IconAdd.vue';
import SelectOption from '@/components/mobiles/SelectOption.vue';
import IconFileUpload from '@/components/icons/IconFileUpload.vue';
import IconDelete from '@/components/icons/mobiles/IconDelete.vue';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { storeToRefs } from 'pinia';
import { useUser } from '@/stores/user';
import { api, imagesUpload } from '@/utils/api';
import { useRouter } from 'vue-router';
import { useBoothList } from '@/stores/booths/boothList';
import { ADMIN_CATEGORY, MENU_TYPE } from '@/utils/constants';
import { useMenuModal } from '@/stores/menu/menuModal';

const router = useRouter();
const useBoothDetailStore = useBoothDetail();
const useUserStore = useUser();
const useBoothListStore = useBoothList();
const useTableDetailStore = useTableDetail();

const { deleteMenu, createMenu, addDeleteMenu, patchMenu, addPatchMenu } = useBoothDetailStore;
const { boothInfo, menuList, boothType, createMenuList, deleteMenuList, patchMenuList, originalMenuList } =
  storeToRefs(useBoothDetailStore);
const { isAdmin } = storeToRefs(useUserStore);
const { boothList } = storeToRefs(useBoothListStore);
const { tableNum, tableNumList } = storeToRefs(useTableDetailStore);
const { getTableList } = useTableDetailStore;

const menuModalStore = useMenuModal();
const { openMobileModal } = menuModalStore;

const isSubmit = ref(false);
const useReservation = ref(false);
const useOrder = ref(false);
const selectedBoothId = ref('');

const boothIntroLength = computed(() => boothInfo.value?.boothIntro?.length ?? 0);

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

  const textarea = event.target;
  const lines = textarea.value.split('\n');

  // 줄 수가 제한을 초과하면 텍스트를 잘라서 업데이트
  if (lines.length > 3) {
    textarea.value = lines.slice(0, 3).join('\n');
  }

  // 업데이트된 값을 boothInfo에 적용
  boothInfo.value.boothIntro = textarea.value;
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

const handleDragStartMenu = (event, index) => {
  if (isSubmit.value) return;
  event.dataTransfer.setData('text/plain', index);
};

const handleDropMenu = (event, dropIndex) => {
  if (isSubmit.value) return;
  const dragIndex = event.dataTransfer.getData('text/plain');
  const item = menuList.value.splice(dragIndex, 1)[0];
  menuList.value.splice(dropIndex, 0, item);

  const start = Math.min(dragIndex, dropIndex);
  const end = Math.max(dragIndex, dropIndex);

  menuList.value.slice(start, end + 1).forEach((menuItem, index) => {
    menuItem.menuIndex = start + index;
    addPatchMenu({
      ...menuItem,
    });
  });
};

const handleClickDeleteMenu = async ({ menuIndex, menuId }) => {
  if (isSubmit.value) return;
  addDeleteMenu(menuId);
  menuList.value.splice(menuIndex, 1);
};

const handleClickSumbit = async () => {
  if (isSubmit.value) return;
  isSubmit.value = true;

  if (
    !boothInfo.value.adminName.length ||
    !boothInfo.value.boothName.length ||
    !serviceHours.value.length ||
    !boothInfo.value.boothIntro.length
  ) {
    return (isSubmit.value = false);
  }
  const pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]\s*~\s*([01]?[0-9]|2[0-4]):([0-5][0-9]|60)$/;

  if (!pattern.test(serviceHours.value.trim())) {
    alert('올바른 운영시간을 입력해주세요. 예: 00:00 ~ 24:00');
    return (isSubmit.value = false);
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

  menuList.value.forEach((menu) => {
    const findPatchMenu = patchMenuList.value.find((patchMenu) => patchMenu.menuId === menu.menuId);
    const findCreateMenu = createMenuList.value.find((createMenu) => createMenu.menuName === menu.menuName);

    if (findPatchMenu) {
      findPatchMenu.isSoldOut = menu.isSoldOut;
    }
    if (findCreateMenu) {
      findCreateMenu.isSoldOut = menu.isSoldOut;
    }
  });

  const menuModifyResults = await Promise.allSettled([
    ...deleteMenuList.value.map(async (menuId) => {
      return await deleteMenu(menuId);
    }),
    ...patchMenuList.value.map(async (menu) => {
      return await patchMenu(menu);
    }),
    ...createMenuList.value.map(async (menu) => {
      return await createMenu(menu);
    }),
  ]);

  const isSoldOutModifiyResults = await Promise.allSettled([
    ...originalMenuList.value
      .map(async (originalMenu) => {
        const findMenu = menuList.value.find((menu) => menu.menuId === originalMenu.menuId);
        if (findMenu) {
          if (findMenu.isSoldOut !== originalMenu.isSoldOut) {
            return await api.put('/admin/menu/sold-out', {
              menuId: findMenu.menuId,
              isSoldOut: originalMenu.isSoldOut,
              boothId: boothInfo.value.boothId,
            });
          }
        }
      })
      .filter((result) => result),
  ]);

  isSubmit.value = false;
  // TODO: 수정하고 모달 띄우기
};

const handleClickCancleButton = () => {
  router.push({ name: 'MobileMain' });
};

const handleInputAccountHolder = (event) => {
  if (isSubmit.value) return;
  boothInfo.value.accountInfo.accountHolder = event.target.value;
};
const handleInputBankName = (event) => {
  if (isSubmit.value) return;
  boothInfo.value.accountInfo.bankName = event.target.value;
};

const handleInputAccount = (event) => {
  if (isSubmit.value) return;

  let inputValue = event.target.value;
  inputValue = inputValue.trim();
  inputValue = inputValue.replace(/\D/g, '-');
  event.target.value = inputValue;
  boothInfo.value.accountInfo.account = inputValue;
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
  await getTableList(selectedBoothId.value);
});

onMounted(async () => {
  useBoothDetailStore.reset();
  if (!isAdmin.value) {
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
  await getTableList(selectedBoothId.value);
});
</script>
<template>
  <form class="w-full h-full mt-7" @submit.prevent="handleClickSumbit()">
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
          class="resize-none w-full h-[97px] bg-primary-300-light rounded-3xl text-sm border-none p-5 pr-20 overflow-hidden placeholder:text-secondary-900-light overflow-y-clip"
          maxlength="100"
          @input="handleInputBoothIntro($event)"
          :value="boothInfo.boothIntro"
          :disabled="isSubmit"
          rows="3"
        />

        <div class="absolute bottom-4 right-5 text-sm">{{ boothIntroLength }}/100</div>
      </div>
      <div class="flex flex-col gap-[10px] items-start">
        <div class="font-bold text-base">부스 사진</div>
        <div
          class="w-full h-[150]px flex flex-row bg-primary-300-light rounded-3xl p-3.5 border-2 border-dashed overflow-y-hidden overflow-x-scroll cursor-pointer"
          @dragover="handleDragOver"
          @drop="handleDrop"
          id="imagezone"
        >
          <label
            v-if="fileUrls.length === 0"
            for="dropzone-file"
            class="w-full h-full flex flex-col items-center justify-center py-[18px]"
          >
            <div class="flex flex-col items-center justify-center text-secondary-900-light text-sm">
              <IconFileUpload class="pb-1" />
              <p class="dark:text-third-10">부스사진을 등록해주세요.</p>
              <p class="dark:text-third-10">최대 10장까지 첨부 가능</p>
            </div>
            <input
              type="file"
              id="dropzone-file"
              class="hidden"
              @input="handleFileinput($event)"
              multiple
              accept="image/*.jpg, image/*.jpeg, image/*.png, image/*.gif"
              :disabled="isSubmit"
            />
          </label>
          <div
            v-for="(url, index) in fileUrls"
            :key="index"
            class="relative w-[120px] h-[120px] flex-shrink-0 mr-2"
            draggable="true"
            @dragstart="(event) => handleDragStart(event, index)"
            @dragenter="(event) => handleDragEnter(event, index)"
            @dragend="handleDragEnd"
          >
            <div :style="setBackgroundImage(url)" class="w-full h-full object-cover rounded-3xl border bg-cover"></div>
            <IconDelete @click="handleDeleteImage(index)" class="absolute top-2 right-2" />
          </div>
          <label
            v-if="fileUrls.length != 0 && fileUrls.length < 10"
            for="dropzone-file"
            class="w-[120px] h-[120px] flex flex-col items-center justify-center py-[18px] shrink-0 border-2 rounded-3xl"
          >
            <div class="flex flex-col items-center justify-center text-secondary-900-light text-sm">
              <IconFileUpload class="pb-1" />
              <p class="dark:text-third-10">사진 추가</p>
            </div>
            <input
              type="file"
              id="dropzone-file"
              class="hidden"
              @input="handleFileinput($event)"
              multiple
              accept="image/*.jpg, image/*.jpeg, image/*.png, image/*.gif"
              :disabled="isSubmit"
            />
          </label>
        </div>
      </div>
      <div v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'" class="flex flex-col gap-[10px] items-start">
        <div class="font-bold text-base">메뉴 정보</div>
        <!-- <MobileMenuDetail /> -->
        <div class="w-full flex flex-col gap-[10px]">
          <div
            v-for="(menu, index) in menuList"
            :key="menu.menuId"
            :draggable="!isSubmit"
            @dragstart="handleDragStartMenu($event, index)"
            @dragover.prevent
            @drop="handleDropMenu($event, index)"
            class="w-full h-fit p-[14px] bg-white rounded-3xl border border-primary flex flex-col justify-between"
          >
            <div class="flex mb-[12px]">
              <img :src="menu.menuImage" class="rounded-3xl w-[94px] h-[94px] mr-3" />
              <div class="w-full flex flex-col justify-between">
                <div>
                  <div class="pb-3 pt-[9px] flex justify-between">
                    <div class="text-sm font-semibold">
                      {{ menu.menuName }}
                    </div>
                    <div class="flex">
                      <div
                        class="flex items-center justify-center w-[45px] h-[17px] bg-secondary-300 text-[8px] rounded-full"
                      >
                        {{ MENU_TYPE[menu.menuType] }}
                      </div>
                    </div>
                  </div>
                  <div class="w-fit text-[10px]">
                    {{ menu.menuDescription }}
                  </div>
                </div>
                <div class="flex justify-between pb-[9px]">
                  <div class="flex items-center">
                    <div class="text-sm font-semibold">
                      {{ menu.menuPrice }}
                    </div>
                    <div class="text-sm">원</div>
                  </div>
                  <IconBoothListToggle
                    :is-active="!menu.isSoldOut"
                    :width="40"
                    @click="menu.isSoldOut = !menu.isSoldOut"
                  />
                </div>
              </div>
            </div>
            <div class="flex gap-[10px]">
              <div
                class="w-1/2 h-[33px] flex justify-center items-center bg-primary-800 text-primary-900 py-[6px] px-4 rounded-full cursor-pointer"
                @click="openMobileModal(menu)"
              >
                수정
              </div>
              <div
                class="w-1/2 h-[33px] flex justify-center items-center bg-danger-light text-danger py-[6px] px-4 rounded-full cursor-pointer"
                @click="
                  handleClickDeleteMenu({
                    menuIndex: index,
                    menuId: menu.menuId,
                  })
                "
              >
                삭제
              </div>
            </div>
          </div>
          <div @click="openMobileModal({})"
            class="w-full h-[150px] flex flex-col items-center justify-center border-dashed border-2 rounded-3xl bg-primary-300-light"
          >
            <div class="flex flex-col items-center justify-center p-5">
              <IconAdd />
              <div class="pt-[10px] text-sm text-secondary-900-light">메뉴 추가하기</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 테이블 커스텀 -->
      <div v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'" class="flex flex-col w-full py-[10px]">
        <div
          class="font-bold text-base pb-2.5"
        >
          현재 테이블 개수 : {{ tableNum }}개
        </div>
        <div class="flex w-full flex-wrap justify-between">
          <div v-for="table in tableNumList" :key="table.tableNumIndex" class="py-2.5 w-[48%]">
            <div class="rounded-xl border border-primary-700 text-sm flex">
              <div class="rounded-l-xl bg-primary-700 py-2.5 px-4">테이블 {{ table.tableNumIndex }}</div>
              <div class="px-4 py-2.5">{{ table.customTableNum }}</div>
            </div>
          </div>
        </div>
        <div class="flex justify-end pt-2.5">
          <button class="bg-primary-900 text-white px-6 py-2 rounded-xl font-semibold">테이블 커스텀</button>
        </div>
      </div>
      <!-- 계좌정보 -->
      <div v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'" class="flex flex-col gap-[20px] w-full py-[10px]">
        <div
          class="font-bold text-base"
        >
          계좌 정보
        </div>
        <div class="flex flex-col gap-[10px]">
          <div class="flex items-center justify-between">
            <div class="text-secondary-700-light text-sm min-w-[100px]">예금주</div>
            <input
              class="w-full px-5 py-3 bg-primary-300-light rounded-2lg text-sm border-none placeholder:text-secondary-900-light"
              type="text"
              maxlength="100"
              placeholder="예금주를 입력하세요."
              @input="handleInputAccountHolder($event)"
              :value="boothInfo?.accountInfo?.accountHolder ?? ''"
              :disabled="isSubmit"
            />
          </div>
          <div class="flex items-center justify-between">
            <div class="text-secondary-700-light text-sm min-w-[100px]">은행명</div>
            <input
              class="w-full px-5 py-3 bg-primary-300-light rounded-2lg text-sm border-none placeholder:text-secondary-900-light"
              type="text"
              maxlength="100"
              placeholder="은행명을 입력하세요."
              @input="handleInputBankName($event)"
              :value="boothInfo?.accountInfo?.bankName ?? ''"
              :disabled="isSubmit"
            />
          </div>
          <div class="flex items-center justify-between">
            <div class="text-secondary-700-light text-sm min-w-[100px]">계좌번호</div>
            <input
              class="w-full px-5 py-3 bg-primary-300-light rounded-2lg text-sm border-none placeholder:text-secondary-900-light"
              type="text"
              maxlength="100"
              placeholder="계좌번호를 입력하세요."
              @input="handleInputAccount($event)"
              :value="boothInfo?.accountInfo?.account ?? ''"
              :disabled="isSubmit"
            />
          </div>
        </div>
      </div>
      <!-- Show when night booth -->
      <div class="flex flex-col gap-[10px] items-start" v-if="boothType === 'night'">
        <div class="font-bold text-base shrink-0">예약 기능 사용 여부</div>
        <SelectOption v-model="useReservation" />
      </div>
      <div class="flex flex-col gap-[10px] items-start" v-if="boothType === 'night'">
        <div class="font-bold text-base shrink-0">주문 기능 사용 여부</div>
        <SelectOption v-model="useOrder" />
      </div>
    </div>
    <div class="w-full dynamic-padding flex gap-[10px] py-10">
      <button class="w-full rounded-[50px] h-[54px] is-button is-outlined" @click="handleClickCancleButton()">
        취소
      </button>
      <button class="w-full rounded-[50px] h-[54px] is-button" @click="handleClickSumbit()">수정</button>
    </div>
  </form>
</template>

<style lang="css" scoped>
.dynamic-padding {
  padding-left: calc(20 / 430 * 100%) !important;
  padding-right: calc(20 / 430 * 100%) !important;
}

#imagezone {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

#imagezone::-webkit-scrollbar {
  display: none;
}
</style>

<script setup>
import IconBoothEdit from '@/components/icons/IconBoothEdit.vue';
import IconBoothListToggle from '@/components/icons/IconBoothListToggle.vue';
import IconFileUpload from '@/components/icons/IconFileUpload.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import router from '@/router';
import { prettyPrice } from '@/utils/utils';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { ADMIN_CATEGORY, MENU_TYPE } from '@/utils/constants';
import { alertError, api, imagesUpload } from '@/utils/api';
import IconRadio from '@/components/icons/IconRadio.vue';
import { useMenuModal } from '@/stores/menu/menuModal';
import { useUser } from '@/stores/user';
import { useTableDetail } from '@/stores/booths/tableDetail';

const props = defineProps({
  boothId: String,
});

const boothDetailStore = useBoothDetail();
const useUserStore = useUser();
const useTableDetailStore = useTableDetail();

const { isAdmin } = storeToRefs(useUserStore);
const { tableNum, tableNumList } = storeToRefs(useTableDetailStore);

const { init, reset, deleteMenu, createMenu, addDeleteMenu, patchMenu, addPatchMenu } = boothDetailStore;
const { boothInfo, menuList, createMenuList, deleteMenuList, boothType, patchMenuList, originalMenuList } =
  storeToRefs(boothDetailStore);
const { submitTableDetail } = useTableDetailStore;

const menuModalStore = useMenuModal();
const { openModal } = menuModalStore;

const serviceHours = ref('');

const fileUrls = ref([]);

const isSubmit = ref(false);
const isOpen = ref(false);

const useReservation = ref(false);
const useCoupon = ref(false);
const useOrder = ref(false);

const handleFileinput = (event) => {
  if (isSubmit.value) return;
  const files = event.target.files;
  handleFiles(files);
};

const handleFiles = async (files) => {
  if (files.length > 0) {
    const urls = await imagesUpload(files);
    if (fileUrls.value.length > 0 && fileUrls.value[0] === '') {
      fileUrls.value = [...urls, ...fileUrls.value.slice(1)];
    } else {
      fileUrls.value = [...fileUrls.value, ...urls];
    }
  }
};

const setBackgroundImage = (url) => {
  return {
    backgroundImage: `url(${url})`,
  };
};

const handleDragStartBoothImage = (event, index) => {
  if (isSubmit.value) return;
  event.dataTransfer.setData('text/plain', index);
};

const handleDropBoothImage = (event, dropIndex) => {
  if (isSubmit.value) return;
  const dragIndex = event.dataTransfer.getData('text/plain');
  const item = fileUrls.value.splice(dragIndex, 1)[0];
  fileUrls.value.splice(dropIndex, 0, item);
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

const handleInputAdminName = (event) => {
  if (isSubmit.value) return;
  boothInfo.value.adminName = event.target.value;
};

const handleInputAdminCategory = (event) => {
  if (isSubmit.value) return;
  boothInfo.value.adminCategory = event.target.value;
};

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

const handleClickTableCusotm = () => {
  useTableDetailStore.openTableDetailModal();
};

const handleClickDeleteMenu = async ({ menuIndex, menuId }) => {
  if (isSubmit.value) return;
  addDeleteMenu(menuId);
  menuList.value.splice(menuIndex, 1);
};

const handleClickSubmit = async () => {
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
  boothInfo.value.isOpen = isOpen.value;

  let newBoothId = '';

  const saveBoothUrl = `/admin/booth/${ADMIN_CATEGORY[boothInfo.value.adminCategory]}`;

  const baseBoothInfo = {
    boothName: boothInfo.value.boothName,
    adminName: boothInfo.value.adminName,
    adminCategory: boothInfo.value.adminCategory,
    openTime: boothInfo.value.openTime,
    closeTime: boothInfo.value.closeTime,
    boothIntro: boothInfo.value.boothIntro,
    boothImage: boothInfo.value.boothImage,
    location: '',
    isOpen: boothInfo.value.isOpen,
  };

  // Make Booth or Patch
  if (props.boothId) {
    if (ADMIN_CATEGORY[boothInfo.value.adminCategory] === 'night') {
      try {
        const nightSaveBoothResponse = await api.put(saveBoothUrl, {
          ...baseBoothInfo,
          boothId: props.boothId,
          isOrder: useOrder.value,
          isReservation: useReservation.value,
          accountInfo: boothInfo.value.accountInfo,
        });

        const nightSaveBoothData = nightSaveBoothResponse.data;

        if (nightSaveBoothData.success) {
          newBoothId = nightSaveBoothData.boothId;
        } else {
          alert('부스 정보를 저장하는데 실패했습니다.');
          return;
        }
      } catch (error) {
        console.error(error);
        alertError(error);
      }
    } else if (ADMIN_CATEGORY[boothInfo.value.adminCategory] === 'day') {
      try {
        const daySaveBoothResponse = await api.put(saveBoothUrl, {
          ...baseBoothInfo,
          boothId: props.boothId,
        });
        const daySaveBoothData = daySaveBoothResponse.data;
        if (daySaveBoothData.success) {
          newBoothId = daySaveBoothData.boothId;
        } else {
          alert('부스 정보를 저장하는데 실패했습니다.');
          return;
        }
      } catch (error) {
        console.error(error);
        alertError(error);
      }
    } else if (ADMIN_CATEGORY[boothInfo.value.adminCategory] === 'food') {
      try {
        const foodSaveBoothResponse = await api.put(saveBoothUrl, {
          ...baseBoothInfo,
          boothId: props.boothId,
        });

        const foodSaveBoothData = foodSaveBoothResponse.data;
        if (foodSaveBoothData.success) {
          newBoothId = foodSaveBoothData.boothId;
        } else {
          alert('부스 정보를 저장하는데실패했습니다.');
          return;
        }
      } catch (error) {
        console.error(error);
        alertError(error);
      }
    } else {
      alert('부스 카테고리를 선택해주세요.');
      return;
    }
  } else {
    if (ADMIN_CATEGORY[boothInfo.value.adminCategory] === 'night') {
      try {
        const nightSaveBoothResponse = await api.post(saveBoothUrl, {
          ...baseBoothInfo,
          isOrder: useOrder.value,
          isReservation: useReservation.value,
          accountInfo: boothInfo.value.accountInfo,
        });
        const nightSaveBoothData = nightSaveBoothResponse.data;
        if (nightSaveBoothData.success) {
          newBoothId = nightSaveBoothData.boothId;
        } else {
          alert('부스 정보를 저장하는데 실패했습니다.');
          return;
        }
      } catch (error) {
        console.error(error);
        alertError(error);
      }
    } else if (ADMIN_CATEGORY[boothInfo.value.adminCategory] === 'day') {
      try {
        const daySaveBoothResponse = await api.post(saveBoothUrl, {
          ...baseBoothInfo,
        });
        const daySaveBoothData = daySaveBoothResponse.data;
        if (daySaveBoothData.success) {
          newBoothId = daySaveBoothData.boothId;
        } else {
          alert('부스 정보를 저장하는데 실패했습니다.');
          return;
        }
      } catch (error) {
        console.error(error);
        alertError(error);
      }
    } else if (ADMIN_CATEGORY[boothInfo.value.adminCategory] === 'food') {
      try {
        const foodSaveBoothResponse = await api.post(saveBoothUrl, {
          ...baseBoothInfo,
        });

        const foodSaveBoothData = foodSaveBoothResponse.data;
        if (foodSaveBoothData.success) {
          newBoothId = foodSaveBoothData.boothId;
        } else {
          alert('부스 정보를 저장하는데실패했습니다.');
          return;
        }
      } catch (error) {
        console.error(error);
        alertError(error);
      }
    } else {
      alert('부스 카테고리를 선택해주세요.');
      return;
    }
  }

  boothInfo.value.boothId = newBoothId;

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

  if (ADMIN_CATEGORY[boothInfo.value.adminCategory] === 'night') {
    const tableDetailResult = await submitTableDetail(props.boothId);
    if (!tableDetailResult) return;
  }

  isSubmit.value = false;
  router.push(`/booth/${boothInfo.value.boothId}`);
};

onMounted(async () => {
  reset();
  if (boothInfo.value.accountInfo === null) {
    boothInfo.value.accountInfo = {
      account: '',
      accountHolder: '',
      bankName: '',
    };
  }
  if (props.boothId) {
    const condition = await init(props.boothId);
    if (condition) {
      fileUrls.value = [...boothInfo.value.boothImage];
      serviceHours.value = `${boothInfo.value.openTime} ~ ${boothInfo.value.closeTime}`;
      isOpen.value = boothInfo.value.isOpen;

      if (boothType.value === 'night') {
        useReservation.value = boothInfo.value.isReservation;
        useOrder.value = boothInfo.value.isOrder;
      }
    } else {
      alert('부스 정보를 불러오는데 실패했습니다.');
      router.push({ name: 'BoothLists' });
    }
  }
});
</script>

<template>
  <!-- Booth Edit -->
  <div class="flex flex-col px-4 gap-[20px] min-w-[630px] pb-20">
    <form @submit.prevent="handleClickSubmit()">
      <div class="flex justify-between pt-[100px] min-w-[350px] pb-[40px]">
        <!-- Booth Header -->
        <div class="flex items-center gap-4">
          <IconBoothEdit />
          <div class="text-primary-900 text-xl md:text-2xl font-semibold">부스 정보 관리</div>
        </div>
      </div>
      <div
        class="bg-white rounded-2xl w-full h-auto px-4 py-4 pb-12 gap-10 lg:py-[60px] lg:px-[60px] lg:gap-[60px] flex flex-col border-1 border-primary-700"
      >
        <!-- 부스 정보 -->
        <div class="flex flex-col gap-[20px] w-full">
          <div
            class="w-[95px] h-[45px] rounded-xl flex items-center justify-center bg-primary-700 text-primary-900-light text-md font-semibold"
          >
            부스 정보
          </div>

          <div
            class="bg-primary-500-light rounded-xl w-full py-4 px-4 lg:py-[40px] lg:px-[40px] flex flex-col gap-[30px] xl:gap-[20px] border-1 border-primary-700"
          >
            <!-- 학과명 -->
            <div class="flex gap-2 flex-wrap xl:flex-nowrap">
              <div class="w-[92px] flex items-center justify-start text-sm shrink-0">학과명</div>
              <div class="relative w-full">
                <input
                  class="w-full xl:w-[390px] h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-900 text-sm"
                  type="text"
                  maxlength="100"
                  placeholder="학과명을 입력하세요."
                  @input="handleInputAdminName($event)"
                  :value="boothInfo?.adminName ?? ''"
                  :disabled="isSubmit"
                />
                <div
                  v-if="!boothInfo?.adminName && isSubmit"
                  class="absolute left-0 xl:left-4 top-[62px] text-xs text-red-600"
                >
                  * 학과명을 입력해주세요.
                </div>
              </div>
            </div>

            <!-- 부스 타입 -->
            <div class="flex flex-wrap xl:flex-nowrap gap-2">
              <div class="w-[92px] flex items-center justify-start text-sm shrink-0">부스 타입</div>
              <div class="relative w-full xl:w-[390px]">
                <select
                  :disabled="!isAdmin || isSubmit"
                  class="appearance-none w-full xl:w-[390px] h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-900 text-sm"
                  @input="handleInputAdminCategory($event)"
                  :value="boothInfo.adminCategory"
                >
                  <option value="주간부스">주간부스</option>
                  <option value="야간부스">야간부스</option>
                  <option value="푸드트럭">푸드트럭</option>
                </select>
              </div>
            </div>

            <!-- 부스이름 -->
            <div class="flex gap-2 flex-wrap xl:flex-nowrap">
              <div class="w-[92px] flex items-center justify-start text-sm shrink-0">부스 이름</div>
              <div class="relative w-full">
                <input
                  class="w-full h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-900 text-sm"
                  type="text"
                  maxlength="100"
                  placeholder="학과명을 입력하세요."
                  @input="handleInputBoothName($event)"
                  :value="boothInfo?.boothName ?? ''"
                  :disabled="isSubmit"
                />
                <div
                  v-if="!boothInfo?.boothName && isSubmit"
                  class="absolute left-0 xl:left-4 top-[62px] text-xs text-red-600"
                >
                  * 부스 부스 이름을 작성해주세요
                </div>
              </div>
            </div>

            <!-- 운영시간 -->
            <div class="flex gap-2 flex-wrap xl:flex-nowrap items-center">
              <div class="w-[92px] flex items-center justify-start text-sm shrink-0">운영 시간</div>
              <div class="w-full flex items-center gap-2">
                <div class="relative w-fit">
                  <input
                    class="2xl:w-[520px] h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-900 text-sm"
                    type="text"
                    maxlength="100"
                    placeholder="예시) 17:00 ~ 24:00"
                    @input="handleInputServiceHours($event)"
                    :value="serviceHours"
                    :disabled="isSubmit"
                  />
                  <div
                    v-if="!serviceHours && isSubmit"
                    class="absolute left-0 xl:left-4 top-[62px] text-xs text-red-600"
                  >
                    * 운영시간을 작성해주세요.
                  </div>
                </div>
                <IconBoothListToggle :is-active="isOpen" @click="isOpen = !isOpen" />
              </div>
            </div>

            <!-- 부스소개 -->
            <div class="flex w-full gap-2 flex-wrap xl:flex-nowrap">
              <div class="w-[92px] flex items-center justify-start text-sm shrink-0">부스 소개</div>
              <div class="relative w-full">
                <textarea
                  class="w-full h-[150px] border-[1px] border-gray-500 rounded-2xl px-[20px] py-[20px] focus:border-primary-900 resize-none text-sm"
                  type="text"
                  maxlength="300"
                  placeholder="부스 소개를 작성해주세요."
                  @input="handleInputBoothIntro($event)"
                  :value="boothInfo?.boothIntro ?? ''"
                  :disabled="isSubmit"
                ></textarea>

                <div
                  v-if="!boothInfo?.boothIntro && isSubmit"
                  class="absolute left-0 xl:left-4 top-[152px] xl:top-[302px] text-xs text-red-600"
                >
                  * 학과 소개를 작성해주세요.
                </div>
              </div>
            </div>

            <!-- 부스 이미지 -->
            <div class="flex w-full gap-2 flex-wrap xl:flex-nowrap">
              <div class="flex-shrink-0 xl:w-[92px] flex items-center justify-start w-full text-sm">부스 이미지</div>
              <label
                v-if="fileUrls.length === 0 || fileUrls[0] === ''"
                for="dropzone-file"
                class="flex flex-col items-center justify-center w-full h-[150px] xl:h-[200px] border-dashed border-primary-500 bg-primary-300-light rounded-2xl border-[1px] cursor-pointer hover:bg-slate-200"
              >
                <IconFileUpload class="mb-2" />

                <p class="mb-2 text-secondary-900-light text-sm">부스 사진을 등록해주세요.</p>
                <p class="text-secondary-900-light text-sm">최대 10장까지 첨부 가능</p>
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
                v-if="fileUrls.length > 0 && fileUrls[0] !== ''"
                class="flex grow flex-col items-center justify-center overflow-x-auto"
              >
                <div class="text-red-500 w-full flex justify-end cursor-pointer mb-2">
                  <div
                    @click="fileUrls = []"
                    class="w-12 h-6 rounded border-danger bg-white text-danger text-sm flex items-center justify-center border"
                  >
                    reset
                  </div>
                </div>
                <div class="w-full overflow-x-auto">
                  <div v-if="fileUrls[0] !== ''" class="w-full flex gap-4">
                    <div
                      v-for="(urls, urlIndex) in fileUrls"
                      :key="urlIndex"
                      :style="setBackgroundImage(urls)"
                      class="flex-shrink-0 w-[150px] h-[150px] xl:w-[200px] xl:h-[200px] rounded-2xl bg-cover bg-no-repeat bg-center border-2 border-gray-300 bg-white hover:border-primary-900"
                      :draggable="!isSubmit"
                      @dragstart="handleDragStartBoothImage($event, urlIndex)"
                      @dragover.prevent
                      @dragenter.prevent
                      @drop="handleDropBoothImage($event, urlIndex)"
                    ></div>
                    <label
                      v-if="fileUrls.length < 10"
                      for="dropzone-file"
                      class="flex-shrink-0 flex flex-col items-center justify-center w-[150px] xl:w-[200px] h-[150px] xl:h-[200px] border-dashed border-gray-500 bg-primary-300-light rounded-2xl border-[1px] cursor-pointer hover:bg-slate-200"
                    >
                      <IconFileUpload class="mb-2" />

                      <p class="mb-2 text-secondary-900-light text-sm">부스 사진을 등록해주세요.</p>
                      <p class="text-secondary-900-light text-sm">최대 10장까지 첨부 가능</p>
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
              </div>
            </div>

            <!-- 테이블 정보 -->
            <div v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'">
              <div class="flex items-center justify-between py-10 gap-10">
                <div
                  class="w-[200px] h-[45px] rounded-xl flex items-center justify-center bg-primary-700 text-primary-900-light text-md font-semibold px-5 gap-3 shrink-0"
                >
                  현재 테이블 개수<span class="text-secondary-700-light">{{ tableNum }}개</span>
                </div>
                <div
                  @click="handleClickTableCusotm()"
                  class="is-button font-semibold w-[100px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-900cursor-pointer select-none"
                >
                  테이블 커스텀
                </div>
              </div>
              <div class="grid 3xl:grid-cols-4 2xl:grid-cols-3 grid-cols-2 gap-5 place-items-center">
                <div
                  v-for="(table, tableIndex) in tableNumList"
                  :key="tableIndex"
                  class="h-14 flex text-center rounded-3lg shadow-secondary w-full"
                >
                  <div
                    class="w-[100px] bg-primary-700 rounded-l-3lg border-1 border-primary-700-dark text-secondary-700-light font-medium text-sm grid place-items-center select-none"
                  >
                    테이블 {{ tableIndex + 1 }}
                  </div>
                  <div
                    class="grow min-w-[120px] bg-white rounded-r-3lg border-1 border-primary-900-ligther border-l-0 grid place-items-center text-secondary-700 text-sm font-semibold select-none"
                  >
                    {{ table.customTableNum }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 계좌정보 -->
        <div v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'" class="flex flex-col gap-[20px] w-full">
          <div
            class="w-[95px] h-[45px] rounded-xl flex items-center justify-center bg-primary-700 text-primary-900-light text-md font-semibold"
          >
            계좌 정보
          </div>

          <div
            class="bg-primary-500-light rounded-2xl w-full py-4 px-4 lg:py-[40px] lg:px-[60px] flex flex-col gap-[30px] xl:gap-[20px] border-1 border-primary-700"
          >
            <!-- 예금주 -->
            <div class="flex gap-2 flex-wrap xl:flex-nowrap">
              <div class="w-[92px] flex items-center justify-start text-sm shrink-0">예금주</div>
              <div class="relative w-full">
                <input
                  class="text-sm md:w-[520px] w-full h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-900"
                  type="text"
                  maxlength="100"
                  placeholder="예금주를 입력하세요."
                  @input="handleInputAccountHolder($event)"
                  :value="boothInfo?.accountInfo?.accountHolder ?? ''"
                  :disabled="isSubmit"
                />
              </div>
            </div>
            <!-- 은행명 -->
            <div class="flex gap-2 flex-wrap xl:flex-nowrap">
              <div class="w-[92px] flex items-center justify-start text-sm shrink-0">은행명</div>
              <div class="relative w-full">
                <input
                  class="md:w-[520px] w-full h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-900 text-sm"
                  type="text"
                  maxlength="100"
                  placeholder="은행명을 입력하세요."
                  @input="handleInputBankName($event)"
                  :value="boothInfo?.accountInfo?.bankName ?? ''"
                  :disabled="isSubmit"
                />
              </div>
            </div>
            <!-- 계좌번호 -->
            <div class="flex gap-2 flex-wrap xl:flex-nowrap">
              <div class="w-[92px] flex items-center justify-start text-sm shrink-0">계좌번호</div>
              <div class="relative w-full">
                <input
                  class="md:w-[520px] w-full h-[45px] border border-gray-500 rounded-xl px-[20px] focus:border-primary-900 text-sm"
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
        </div>

        <!-- 메뉴 정보 -->
        <div v-if="ADMIN_CATEGORY[boothInfo.adminCategory] !== 'food'" class="flex flex-col gap-[20px] w-full">
          <div
            class="w-[95px] h-[45px] rounded-xl flex items-center justify-center bg-primary-700 text-primary-900-light text-md font-semibold"
          >
            메뉴 정보
          </div>
          <div
            class="bg-primary-500-light rounded-2xl w-full lg:py-[30px] lg:px-[30px] px-4 py-4 flex flex-col border-1 border-primary-700"
          >
            <div class="grid gap-4 grid-cols-1 2xl:grid-cols-2">
              <div
                v-for="(menu, menuIndex) in menuList"
                :key="menuIndex"
                class="h-[170px] rounded-2xl flex text-sm items-center font-bold p-5 gap-[28px] bg-white hover:border-primary-900 border-1 border-primary-700"
                :draggable="!isSubmit"
                @dragstart="handleDragStartMenu($event, menuIndex)"
                @dragover.prevent
                @dragenter.prevent
                @drop="handleDropMenu($event, menuIndex)"
              >
                <div
                  class="hidden md:block w-[120px] h-[120px] bg-contain bg-no-repeat bg-center bg-white rounded-xl flex-shrink-0 border-gray-200 border"
                  :style="setBackgroundImage(menu.menuImage)"
                ></div>
                <div class="flex flex-col w-full justify-between">
                  <div class="flex flex-col w-full">
                    <!-- Menu header -->
                    <div class="flex justify-between items-center h-[29px] w-full min-w-fit gap-2">
                      <div
                        class="w-3/5 text-base font-semibold text-secondary-700 text-nowrap truncate 2xl:max-w-[110px]"
                      >
                        {{ menu.menuName }}
                      </div>
                      <div
                        class="w-2/5 gap-[5px] items-center text-sm flex flex-shrink-0 justify-end grow font-medium 2xl:max-w-[130px]"
                      >
                        <div
                          v-if="ADMIN_CATEGORY[boothInfo.adminCategory] !== 'day'"
                          class="w-[55px] h-[25px] text-[10px] rounded-full bg-secondary-300 items-center flex justify-center text-secondary-700"
                        >
                          {{ MENU_TYPE[menu.menuType] }}
                        </div>
                        <button
                          class="w-[45px] h-[25px] rounded-full flex items-center justify-center text-[10px] text-primary-900 bg-primary-800 cursor-pointer"
                          type="button"
                          @click="openModal(menu)"
                        >
                          수정
                        </button>
                        <button
                          class="w-[45px] h-[25px] lg:max-xl:flex rounded-full 2xl:flex items-center justify-center bg-danger-light text-danger text-[10px]"
                          type="button"
                          @click="
                            handleClickDeleteMenu({
                              menuIndex: menuIndex,
                              menuId: menu.menuId,
                            })
                          "
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    <!-- Menu Body -->
                    <p
                      class="pt-[12px] pb-[12px] h-[78px] text-secondary-700-light font-normal text-xs break-all text-wrap line-clamp-3"
                    >
                      {{ menu.menuDescription }}
                    </p>
                  </div>
                  <!-- Menu Footer -->
                  <div class="flex justify-between items-center w-full">
                    <div class="text-secondary-700 font-bold text-base">
                      {{ prettyPrice(menu.menuPrice) }}
                    </div>
                    <IconBoothListToggle :is-active="!menu.isSoldOut" @click="menu.isSoldOut = !menu.isSoldOut" />
                  </div>
                </div>
              </div>
              <div
                class="h-[170px] bg-primary-300-light rounded-2xl border-2 border-dashed border-primay-500 flex flex-col items-center justify-center text-secondary-900-light cursor-pointer"
                @click="openModal({})"
              >
                <IconAdd class="mb-2" />
                <div class="text-sm">메뉴 추가하기</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 예약기능 사용 여부 -->
        <div
          v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'"
          class="flex gap-6 md:gap-[40px] items-center flex-wrap"
        >
          <div class="w-[170px]">
            <div
              class="h-[45px] rounded-xl text-primary-900-light flex items-center justify-center font-semibold text-md bg-primary-700"
            >
              예약기능 사용 여부
            </div>
          </div>
          <div class="flex gap-[28px]">
            <div
              class="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
              @click="useReservation = true"
            >
              <IconRadio :is-active="useReservation" />
              <div class="text-secondary-900 text-sm font-semibold">사용 동의</div>
            </div>
            <div
              class="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
              @click="useReservation = false"
            >
              <IconRadio :is-active="!useReservation" />
              <div class="text-secondary-900 text-sm font-semibold">사용 비동의</div>
            </div>
          </div>
        </div>

        <!-- 쿠폰 진행 여부 -->
        <div v-if="false" class="flex gap-6 md:gap-[40px] items-center flex-wrap">
          <div class="w-[170px]">
            <div
              class="h-[45px] rounded-xl text-primary-900-light flex items-center justify-center font-semibold text-md bg-primary-700"
            >
              쿠폰 진행 여부
            </div>
          </div>
          <div class="flex gap-[28px]">
            <div class="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer" @click="useCoupon = true">
              <IconRadio :is-active="useCoupon" />
              <div class="text-secondary-900 text-sm font-semibold">사용 동의</div>
            </div>
            <div class="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer" @click="useCoupon = false">
              <IconRadio :is-active="!useCoupon" />
              <div class="text-secondary-900 text-sm font-semibold">사용 비동의</div>
            </div>
          </div>
        </div>

        <!-- 주문 기능 사용 여부 -->
        <div
          v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'"
          class="flex gap-6 md:gap-[40px] items-center flex-wrap"
        >
          <div
            class="w-[170px] h-[45px] rounded-xl text-primary-900-light flex items-center justify-center font-semibold text-md bg-primary-700"
          >
            주문 기능 사용 여부
          </div>
          <div class="flex gap-[28px]">
            <div class="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer" @click="useOrder = true">
              <IconRadio :is-active="useOrder" />
              <div class="text-secondary-900 text-sm font-semibold">사용 동의</div>
            </div>
            <div class="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer" @click="useOrder = false">
              <IconRadio :is-active="!useOrder" />
              <div class="text-secondary-900 text-sm font-semibold">사용 비동의</div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end items-center gap-4 pt-[40px] mr-8">
        <!-- TODO: Check does it need? -->
        <!-- <button type="button" class="is-button is-outlined w-[120px] h-[60px] text-3xl">삭제</button> -->
        <button
          type="submit"
          class="is-button font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-900cursor-pointer select-none"
        >
          등록
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup>
import { useMenuModal } from '@/stores/menu/menuModal';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import IconRadio from '../icons/IconRadio.vue';
import IconFileUpload from '../icons/IconFileUpload.vue';
import { imageUpload } from '@/utils/api';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { ADMIN_CATEGORY, MENU_TYPE } from '@/utils/constants';

const useMenuModalStore = useMenuModal();
const boothDetailStore = useBoothDetail();

const { submitModal, closeModal } = useMenuModalStore;
const { menuInfo } = storeToRefs(useMenuModalStore);
const { boothInfo } = storeToRefs(boothDetailStore);

const isMainMenu = ref(true);
const isSubmit = ref(false);
const submit = ref(null);

const handleInputMenuName = (event) => {
  menuInfo.value.menuName = event.target.value;
};

const handleInputMenuPrice = (event) => {
  const price = event.target.value.replace(/[^0-9]/g, '');
  menuInfo.value.menuPrice = price.slice(0, 6);
};

const handleInputMenuDescription = (event) => {
  menuInfo.value.menuDescription = event.target.value;
};

const handleInputMenuImage = async (event) => {
  const file = event.target.files[0];
  const url = await imageUpload(file);
  menuInfo.value.menuImage = url;
};

const setBackgroundImage = (url) => {
  return {
    backgroundImage: `url(${url})`,
  };
};

const handleSubmit = () => {
  isSubmit.value = true;
  if (menuInfo.value.menuName === '' || menuInfo.value.menuPrice === '' || menuInfo.value.menuDescription === '') {
    return;
  }
  menuInfo.value.menuType = isMainMenu.value ? 'MAINMENU' : 'SUBMENU';
  submitModal();
  isSubmit.value = false;
};

const allowKeyEnter = (event) => {
  if (event.key === 'Enter') {
    handleSubmit();
  }
};

onMounted(() => {
  isMainMenu.value = menuInfo.value.menuType === 'MAINMENU';
  submit.value?.focus();
});
</script>
<template>
  <form @submit.prevent="handleSubmit()">
    <div class="w-[600px] h-[600px] bg-white rounded-2xl p-10 flex flex-col justify-between">
      <!-- Inputs -->
      <div class="flex flex-col w-full gap-[28px]">
        <!-- 메뉴 -->
        <div class="flex items-center w-full">
          <div class="w-[80px] flex-shrink-0 text-md">메뉴</div>
          <div class="grow relative">
            <input
              class="w-full h-[45px] border border-gray-400 bg-white px-[20px] rounded-xl active:border-primary-900 text-sm"
              type="text"
              placeholder="메뉴 이름을 작성해주세요"
              @input="handleInputMenuName($event)"
              :value="menuInfo.menuName"
            />
            <div v-if="menuInfo.menuName === '' && isSubmit" class="absolute left-4 top-[51px] text-danger text-xs">
              * 메뉴 이름을 작성해주세요.
            </div>
          </div>
        </div>

        <!-- 가격 -->
        <div class="flex items-center w-full">
          <div class="w-[80px] flex-shrink-0 text-md">가격</div>
          <div class="grow relative">
            <input
              class="w-full h-[45px] border border-gray-400 bg-white px-[20px] rounded-xl active:border-primary-900 text-sm"
              type="text"
              placeholder="가격을 작성해주세요"
              @input="handleInputMenuPrice($event)"
              :value="menuInfo.menuPrice"
              maxlength="6"
            />
            <div v-if="menuInfo.menuPrice === '' && isSubmit" class="absolute left-4 top-[51px] text-danger text-xs">
              * 가격을 작성해주세요.
            </div>
          </div>
        </div>

        <!-- 설명 -->
        <div class="flex items-center w-full">
          <div class="w-[80px] flex-shrink-0 text-md">설명</div>
          <div class="grow relative">
            <textarea
              class="w-full h-[120px] border border-gray-400 bg-white px-[20px] py-[20px] rounded-2xl active:border-primary-900 resize-none text-sm"
              type="text"
              maxlength="60"
              placeholder="메뉴 설명을 작성해주세요"
              @input="handleInputMenuDescription($event)"
              :value="menuInfo.menuDescription"
            ></textarea>
            <div
              v-if="menuInfo.menuDescription === '' && isSubmit"
              class="absolute left-4 top-[124px] text-danger text-xs"
            >
              * 메뉴 설명을 작성해주세요.
            </div>
          </div>
        </div>

        <!-- 이미지 -->
        <div class="flex items-center w-full">
          <div class="w-[80px] flex-shrink-0 text-md">이미지</div>
          <div class="grow relative">
            <label
              v-if="menuInfo.menuImage === ''"
              for="menu-image"
              class="flex flex-col items-center justify-center w-full h-[130px] border border-dashed border-gray-500 bg-secondary-300 hover:bg-slate-200 px-[20px] rounded-2xl active:border-primary-900"
            >
              <IconFileUpload />
              <p class="mb-2 text-sm text-gray-500">메뉴 사진을 등록해주세요.</p>
              <input
                type="file"
                class="hidden"
                id="menu-image"
                @input="handleInputMenuImage($event)"
                accept="image/*.jpg, image/*.jpeg, image/*.png, image/*.gif"
              />
            </label>
            <label
              v-if="menuInfo.menuImage !== ''"
              for="menu-image"
              class="flex w-full h-[150px] bg-contain bg-center bg-no-repeat border border-gray-400 rounded-2xl"
              :style="setBackgroundImage(menuInfo.menuImage)"
            >
              <input
                type="file"
                class="hidden"
                id="menu-image"
                @input="handleInputMenuImage($event)"
                accept="image/*.jpg, image/*.jpeg, image/*.png, image/*.gif"
              />
            </label>
          </div>
        </div>

        <!-- 메뉴 종류 선택 -->
        <div v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'" class="flex items-center w-full">
          <div class="w-[80px] shrink-0"></div>
          <div class="flex items-center gap-[28px]">
            <div class="w-[110px] flex gap-2 cursor-pointer text-sm" @click="isMainMenu = true">
              <IconRadio :is-active="isMainMenu" />
              <div>메인 메뉴</div>
            </div>
          </div>
          <div v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'" class="flex items-center gap-[28px]">
            <div class="w-[110px] flex gap-2 cursor-pointer text-sm" @click="isMainMenu = false">
              <IconRadio :is-active="!isMainMenu" />
              <div>서브 메뉴</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="w-full flex justify-end items-center gap-[10px]">
        <button
          class="is-button is-outlined font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-primary-900 lg:text-md bg-primary-900cursor-pointer select-none"
          type="button"
          @click="closeModal()"
        >
          취소
        </button>
        <button class="is-button font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-900cursor-pointer select-none" type="submit" ref="submit" autofocus>
          확인
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>

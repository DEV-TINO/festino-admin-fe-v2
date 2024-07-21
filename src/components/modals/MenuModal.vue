<script setup>
import { useMenuModal } from '@/stores/menu/menuModal';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';
import IconRadio from '../icons/IconRadio.vue';
import IconFileUpload from '../icons/IconFileUpload.vue';
import { imageUpload } from '@/utils/api';

const useMenuModalStore = useMenuModal();

const { submitModal, closeModal } = useMenuModalStore;
const { menuInfo } = storeToRefs(useMenuModalStore);

const isMainMenu = ref(true);
const isSubmit = ref(false);

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
  console.log(event.target.files[0]);
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
  console.log('[MenuModal] mounted');
  window.addEventListener('keydown', allowKeyEnter);
  isMainMenu.value = menuInfo.value.menuType === 'MAINMENU';
});

onUnmounted(() => {
  window.removeEventListener('keydown', allowKeyEnter);
});
</script>
<template>
  <form @submit.prevent="handleSubmit()">
    <div class="w-[780px] h-[716px] bg-white rounded-[20px] py-[50px] px-[50px] flex flex-col justify-between">
      <!-- Inputs -->
      <div class="flex flex-col w-full gap-[28px]">
        <!-- 메뉴 -->
        <div class="flex items-center w-full">
          <div class="w-[80px] flex-shrink-0 text-2xl">메뉴</div>
          <div class="grow relative">
            <input
              class="w-full h-[60px] border border-gray-400 bg-white px-[20px] rounded-2xl active:border-primary-900"
              type="text"
              placeholder="메뉴 이름을 작성해주세요"
              @input="handleInputMenuName($event)"
              :value="menuInfo.menuName"
            />
            <div v-if="menuInfo.menuName === '' && isSubmit" class="absolute left-4 top-[64px] text-danger text-sm">
              * 메뉴 이름을 작성해주세요.
            </div>
          </div>
        </div>

        <!-- 가격 -->
        <div class="flex items-center w-full">
          <div class="w-[80px] flex-shrink-0 text-2xl">가격</div>
          <div class="grow relative">
            <input
              class="w-full h-[60px] border border-gray-400 bg-white px-[20px] rounded-2xl active:border-primary-900"
              type="text"
              placeholder="가격을 작성해주세요"
              @input="handleInputMenuPrice($event)"
              :value="menuInfo.menuPrice"
              maxlength="6"
            />
            <div v-if="menuInfo.menuPrice === '' && isSubmit" class="absolute left-4 top-[64px] text-danger text-sm">
              * 가격을 작성해주세요.
            </div>
          </div>
        </div>

        <!-- 설명 -->
        <div class="flex items-center w-full">
          <div class="w-[80px] flex-shrink-0 text-2xl">설명</div>
          <div class="grow relative">
            <textarea
              class="w-full h-[120px] border border-gray-400 bg-white px-[20px] py-[20px] rounded-2xl active:border-primary-900 resize-none"
              type="text"
              maxlength="60"
              placeholder="메뉴 설명을 작성해주세요"
              @input="handleInputMenuDescription($event)"
              :value="menuInfo.menuDescription"
            ></textarea>
            <div
              v-if="menuInfo.menuDescription === '' && isSubmit"
              class="absolute left-4 top-[124px] text-danger text-sm"
            >
              * 메뉴 설명을 작성해주세요.
            </div>
          </div>
        </div>

        <!-- 이미지 -->
        <div class="flex items-center w-full">
          <div class="w-[80px] flex-shrink-0 text-2xl">이미지</div>
          <div class="grow relative">
            <label
              v-if="menuInfo.menuImage === ''"
              for="menu-image"
              class="flex flex-col items-center justify-center w-full h-[150px] border border-dashed border-gray-500 bg-gray-200 hover:bg-slate-200 px-[20px] rounded-2xl active:border-primary-900"
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
        <div class="flex items-center w-full">
          <div class="w-[80px] shrink-0"></div>
          <div class="flex items-center gap-[28px]">
            <div class="w-[110px] flex gap-2 cursor-pointer" @click="isMainMenu = true">
              <IconRadio :is-active="isMainMenu" />
              <div>메인 메뉴</div>
            </div>
          </div>
          <div class="flex items-center gap-[28px]">
            <div class="w-[110px] flex gap-2 cursor-pointer" @click="isMainMenu = false">
              <IconRadio :is-active="!isMainMenu" />
              <div>서브 메뉴</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="w-full flex justify-end items-center gap-[10px]">
        <button
          class="is-button is-outlined w-[100px] h-[50px] font-semibold text-xl"
          type="button"
          @click="closeModal()"
        >
          취소
        </button>
        <button class="is-button w-[100px] h-[50px] font-semibold text-xl" type="submit" @click="handleSubmit()">
          확인
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>

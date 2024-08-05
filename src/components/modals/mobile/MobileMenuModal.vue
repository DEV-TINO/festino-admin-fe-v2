<script setup>
import { useMenuModal } from '@/stores/menu/menuModal';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import IconRadio from '@/components/icons/IconRadio.vue';
import IconFileUpload from '@/components/icons/IconFileUpload.vue';
import { imageUpload } from '@/utils/api';
import { MENU_TYPE } from '@/utils/constants';

const useMenuModalStore = useMenuModal();

const { submitModal, closeMobileModal } = useMenuModalStore;
const { menuInfo } = storeToRefs(useMenuModalStore);

const isMainMenu = ref(true);
const isSubmit = ref(false);
const submit = ref(null);

const handleInputMenuName = (event) => {
  menuInfo.value.menuName = event.target.value;
};

const handleInputMenuPrice = (event) => {
  let input = event.target.value;
  const price = input.replace(/[^0-9]/g, '');
  event.target.value = price.slice(0, 6);
  menuInfo.value.menuPrice = event.target.value;
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

const menuIntroLength = ref(0);
menuIntroLength.value = computed(() => menuInfo.value.menuDescription.length);

onMounted(() => {
  isMainMenu.value = menuInfo.value.menuType === 'MAINMENU';
  submit.value?.focus();
});
</script>

<template>
  <div class="modal-width bg-white rounded-[20px] py-7 px-[21px] flex flex-col text-secondary-700">
    <form @submit.prevent="handleSubmit()" class="w-full flex flex-col gap-[10px]">
      <!-- 메뉴 -->
      <div class="flex w-full items-center gap-3">
        <div class="w-[42px] flex-shrink-0">이름</div>
        <div class="grow relative">
          <input
            class="w-full h-10 bg-primary-300-light rounded-[10px] active:border-primary-900 border-none text-sm"
            type="text"
            placeholder="메뉴 이름을 작성해주세요"
            @input="handleInputMenuName($event)"
            :value="menuInfo.menuName"
          />
          <div v-if="menuInfo.menuName === '' && isSubmit" class="absolute top-10 text-danger text-xs">
            * 메뉴 이름을 작성해주세요.
          </div>
        </div>
      </div>
      <!-- 가격 -->
      <div class="flex w-full items-center gap-3">
        <div class="w-[42px] flex-shrink-0">가격</div>
        <div class="grow relative">
          <input
            class="w-full h-10 bg-primary-300-light rounded-[10px] active:border-primary-900 border-none text-sm"
            type="text"
            placeholder="가격을 작성해주세요.(숫자만 입력)"
            @input="handleInputMenuPrice($event)"
            :value="menuInfo.menuPrice"
            maxlength="6"
          />
          <div v-if="menuInfo.menuName === '' && isSubmit" class="absolute top-10 text-danger text-xs">
            * 가격을 작성해주세요.
          </div>
        </div>
      </div>
      <!-- 설명 -->
      <div class="flex w-full items-center gap-3">
        <div class="w-[42px] flex-shrink-0">설명</div>
        <div class="grow relative">
          <textarea
            class="w-full h-[140px] rounded-[10px] active:border-primary-900 resize-none border-none bg-primary-300-light p-3 text-sm"
            type="text"
            maxlength="60"
            placeholder="설명을 작성해주세요."
            @input="handleInputMenuDescription($event)"
            :value="menuInfo.menuDescription"
          ></textarea>
          <div class="text-sm text-secondary-900-light absolute bottom-4 right-4">{{ menuIntroLength }}/60</div>

          <div v-if="menuInfo.menuName === '' && isSubmit" class="absolute top-10 text-danger text-xs">
            * 설명을 작성해주세요.
          </div>
        </div>
      </div>
      <!-- 이미지 -->
      <div class="flex w-full items-center gap-3">
        <div class="w-[42px] flex-shrink-0">이미지</div>
        <div class="grow relative">
          <label
            v-if="menuInfo.menuImage === ''"
            for="menu-image"
            class="flex flex-col items-center justify-center w-full h-[87px] hover:bg-slate-200 border border-dashed border-secondary-900 rounded-[10px] bg-primary-300-light active:border-primary-900"
          >
            <IconFileUpload />
            <input
              type="file"
              class="hidden"
              id="menu-image"
              @input="handleInputMenuImage($event)"
              accept="image/*.jpg, image/*.jpeg, image/*.png, image/*.gif"
            />
            <p class="mb-2 text-sm text-secondary-900-light">이미지를 업로드 해주세요.</p>
          </label>
          <label
            v-if="menuInfo.menuImage !== ''"
            for="menu-image"
            class="flex w-full h-[150px] bg-contain bg-center bg-no-repeat border border-dashed border-secondary-900 rounded-[10px] bg-primary-300-light"
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
      <div class="flex justify-start w-full h-14 items-center gap-7">
        <div class="flex gap-2 cursor-pointer" @click="isMainMenu = true">
          <IconRadio :is-active="isMainMenu" />
          <div class="font-semibold" :class="isMainMenu ? 'text-primary-900' : 'text-secondary-900'">메인 메뉴</div>
        </div>
        <div class="flex gap-2 cursor-pointer" @click="isMainMenu = false">
          <IconRadio :is-active="!isMainMenu" />
          <div class="font-semibold" :class="!isMainMenu ? 'text-primary-900' : 'text-secondary-900'">서브 메뉴</div>
        </div>
      </div>
      <!-- Buttons -->
      <div class="w-full flex justify-between items-center gap-[10px]">
        <button class="is-button is-outlined w-full h-[43px] font-bold" type="button" @click="closeMobileModal()">
          취소
        </button>
        <button class="is-button w-full h-[43px] font-bold" type="submit" ref="submit" autofocus>완료</button>
      </div>
    </form>
  </div>
</template>

<style lang="css" scoped>
.modal-width {
  width: calc(380 / 430 * 100%) !important;
}
</style>

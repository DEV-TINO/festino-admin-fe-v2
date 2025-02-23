<script setup>
import { useUser } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import IconLogo from '@/components/icons/IconLogo.vue'

const { logout } = useUser();
const { isAdmin, userOwnBoothId } = storeToRefs(useUser());
const isOpenMenu = ref(false);

const route = useRoute();

const boothActive = ref(false);
const reserveActive = ref(false);
const orderActive = ref(false);
const registerActive = ref(false);
const userActive = ref(false);

const setActiveClass = (active) => {
  return {
    'font-semibold': active,
    'text-primary-900': active,
  };
};

const handleClickHome = () => {
  router.push('/');
};

const handleClickBooth = () => {
  router.push('/');
};

const handleClickReserve = () => {
  router.push({
    name: 'Tabling',
  });
};

const handleClickOrder = () => {
  router.push({
    name: 'OrderRealTime',
  });
};

const handleClickLogout = () => {
  logout();
  router.push('/login');
};

const updateActive = () => {
  boothActive.value = route.path === '/' || route.path.startsWith('/booth');
  reserveActive.value = route.path.startsWith('/reserve');
  orderActive.value = route.path.startsWith('/order');
  registerActive.value = route.path.startsWith('/register');
  userActive.value = route.path.startsWith('/user');
};

watch(() => route.name, updateActive, {
  immediate: true,
});
</script>

<template>
  <div
    class="bg-white w-full flex justify-between px-[40px] 2xl:px-[50px] items-center h-full shadow-primary select-none"
  >
    <div class="text-3xl text-primary-900 font-semibold cursor-pointer" @click="handleClickHome()">
      <IconLogo class="w-[55px] md:w-[50px] lg:w-[60px]" />
    </div>
    <div
      class="flex justify-end gap-4 md:gap-[50px] lg:gap-[70px] text-secondary-900 text-xs md:text-sm lg:text-[16px] font-medium"
    >
      <div
        class="hover:text-primary-900 hover:font-semibold cursor-pointer hidden sm:block"
        :class="setActiveClass(boothActive)"
        @click="handleClickBooth()"
      >
        부스
      </div>
      <div
        class="hover:text-primary-900 hover:font-semibold cursor-pointer hidden sm:block"
        :class="setActiveClass(reserveActive)"
        @click="handleClickReserve()"
      >
        테이블링
      </div>
      <div
        class="hover:text-primary-900 hover:font-semibold cursor-pointer hidden sm:block"
        :class="setActiveClass(orderActive)"
        @click="handleClickOrder()"
      >
        주문조회
      </div>
      <div
        v-if="isAdmin"
        class="hover:text-primary-900 hover:font-semibold cursor-pointer hidden sm:block"
        :class="setActiveClass(registerActive)"
      >
        등록/수정
      </div>
      <div
        v-if="isAdmin"
        class="hover:text-primary-900 hover:font-semibold cursor-pointer hidden sm:block"
        :class="setActiveClass(userActive)"
      >
        유저관리
      </div>
      <div
        class="hover:text-primary-900 hover:font-semibold cursor-pointer underline hidden sm:block"
        @click="handleClickLogout()"
      >
        로그아웃
      </div>

      <div class="sm:hidden block relative" @mouseenter="isOpenMenu = true" @mouseleave="isOpenMenu = false">
        <i
          class="fa-solid fa-bars sm:hidden text-xl hover:text-primary-900 cursor-pointer"
          :class="isOpenMenu ? 'text-primary-900' : ''"
        >
        </i>
        <div v-if="isOpenMenu" class="sm:hidden absolute flex flex-col right-0 bg-white border rounded font-medium">
          <div
            class="w-24 h-8 flex items-center justify-center text-sm hover:text-primary-900 hover:bg-slate-50 cursor-pointer"
            :class="setActiveClass(boothActive)"
            @click="handleClickBooth()"
          >
            부스
          </div>
          <div
            class="w-24 h-8 flex items-center justify-center text-sm hover:text-primary-900 hover:bg-slate-50 cursor-pointer"
            :class="setActiveClass(reserveActive)"
            @click="handleClickReserve()"
          >
            테이블링
          </div>
          <div
            class="w-24 h-8 flex items-center justify-center text-sm hover:text-primary-900 hover:bg-slate-50 cursor-pointer"
            :class="setActiveClass(orderActive)"
            @click="handleClickOrder()"
          >
            주문조회
          </div>
          <hr />
          <div
            v-if="isAdmin"
            class="w-24 h-8 flex items-center justify-center text-sm hover:text-primary-900 hover:bg-slate-50 cursor-pointer"
            :class="setActiveClass(registerActive)"
          >
            등록/수정
          </div>
          <div
            v-if="isAdmin"
            class="w-24 h-8 flex items-center justify-center text-sm hover:text-primary-900 hover:bg-slate-50 cursor-pointer"
            :class="setActiveClass(userActive)"
          >
            유저관리
          </div>
          <hr />
          <div
            class="w-24 h-8 flex items-center justify-center text-sm hover:text-primary-900 hover:bg-slate-50 cursor-pointer"
            @click="handleClickLogout()"
          >
            로그아웃
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

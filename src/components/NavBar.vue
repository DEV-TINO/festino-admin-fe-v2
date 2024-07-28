<script setup>
import { useUser } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';

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
  console.log('Home clicked');
  router.push('/');
};

const handleClickBooth = () => {
  console.log('Booth clicked');
  router.push('/');
};

const handleClickReserve = () => {
  console.log('Reserve clicked');
  console.log('userOwnBoothId:', userOwnBoothId.value);
  router.push({
    name: 'Tabling',
  });
};

const handleClickOrder = () => {
  console.log('Order clicked');
  router.push({
    name: 'OrderRealTime',
  });
};

const handleClickLogout = () => {
  console.log('Logout clicked');
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
    class="bg-white w-full flex justify-between px-20px 2xl:px-[50px] px-4 items-center h-full shadow-primary select-none"
  >
    <div class="text-3xl text-primary-900 font-semibold cursor-pointer" @click="handleClickHome()">Festino</div>
    <div
      class="flex justify-end gap-4 md:gap-[40px] lg:gap-[80px] text-secondary-900 md:text-xl lg:text-2xl font-medium"
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

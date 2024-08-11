<script setup>
import IconBoothInfo from '@/components/icons/IconBoothInfo.vue';
import IconBoothListToggle from '@/components/icons/IconBoothListToggle.vue';
import IconIndicator from '@/components/icons/IconIndicator.vue';
import IconRadio from '@/components/icons/IconRadio.vue';
import { prettyPrice } from '@/utils/utils';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { setBackgroundImage } from '@/utils/utils';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { ADMIN_CATEGORY, MENU_TYPE } from '@/utils/constants';
import { alertError, api } from '@/utils/api';
import router from '@/router';

const props = defineProps({
  boothId: {
    type: String,
    required: true,
  },
});

const useBoothDetailStore = useBoothDetail();
const { reset, init } = useBoothDetailStore;
const { boothInfo, menuList } = storeToRefs(useBoothDetailStore);

const IMAGE_WIDTH = 210; // width + gap

const scrollContainer = ref(null);

const scrollImage = (direction) => {
  const scrollAmount = direction === 'left' ? -IMAGE_WIDTH : IMAGE_WIDTH;
  scrollContainer.value.scrollBy({
    left: scrollAmount,
    behavior: 'smooth',
  });
};

const handleClickLeftIndicator = () => {
  scrollImage('left');
};

const handleClickRightIndicator = () => {
  scrollImage('right');
};

const handleClickSoldOut = async (menu) => {
  const response = await api.put('/admin/menu/sold-out', {
    menuId: menu.menuId,
    isSoldOut: menu.isSoldOut,
    boothId: boothInfo.value.boothId,
  });
  const data = response.data;

  if (data.success) {
    menu.isSoldOut = data.soldOutInfo.isSoldOut;
  } else {
    alertError(data.message);
  }
};

const handleClickBoothOpen = async () => {
  const response = await api.put(`/admin/booth/${ADMIN_CATEGORY[boothInfo.value.adminCategory]}/open`, {
    boothId: boothInfo.value.boothId,
    isOpen: boothInfo.value.isOpen,
  });

  const data = response.data;

  if (data.success) {
    boothInfo.value.isOpen = data.openInfo.isOpen;
  } else {
    alertError(data.message);
  }
};

const handleClickBoothEdit = () => {
  router.push({ name: 'BoothEdit' });
};

onMounted(async () => {
  reset();
  if (props.boothId) {
    const condition = await init(props.boothId);
    if (!condition) {
      alert('부스 정보를 불러오는데 실패했습니다.');
      router.push({ name: 'BoothList' });
    }
  } else {
    alert('부스 정보를 불러오는데 실패했습니다.');
    router.push({ name: 'BoothList' });
  }
});
</script>
<template>
  <!-- Booth Detail -->
  <div class="flex flex-col px-4 gap-[40px] min-w-[500px] pb-20">
    <form>
      <div class="flex justify-between pt-[50px] lg:pt-[100pt] min-w-[350px] pb-[40px]">
        <div class="flex items-center gap-4">
          <IconBoothInfo />
          <div class="text-primary-900 text-4xl font-semibold">{{ boothInfo.adminName }} 부스 정보</div>
        </div>
        <button
          class="is-button w-[80px] h-[48px] text-xl lg:w-[106px] lg:h-[53px]"
          type="button"
          @click="handleClickBoothEdit()"
        >
          수정
        </button>
      </div>
      <div
        class="bg-white rounded-2xl w-full h-auto px-4 py-4 pb-12 gap-10 lg:py-[60px] lg:px-[60px] lg:gap-[60px] flex flex-col border-1 border-primary-700 text-secondary-700-light shadow-xs"
      >
        <!-- 부스 정보 -->
        <div class="flex flex-col gap-[20px] w-full">
          <div
            class="w-[137px] h-[61px] rounded-2xl flex items-center justify-center bg-primary-700 text-primary-900 text-xl lg:text-2xl font-semibold"
          >
            부스 정보
          </div>
          <div class="w-full bg-primary-900-lighter h-auto rounded-2xl px-[40px] py-[40px]">
            <div
              class="w-full bg-primary-700 h-full rounded-2xl border border-primary-700 grid grid-cols-[120px_1fr] grid-rows-[80px_80px_200px_280px] 2xl:grid-cols-[200px_1fr_200px_1fr] 2xl:grid-rows-[80px_200px_280px] place-items-stretch"
            >
              <div
                class="flex items-center justify-center border-b border-r border-primary-700 px-4 text-xl font-medium"
              >
                부스 이름
              </div>
              <div
                class="bg-white flex items-center border-b border-primary-700 text-wrap px-6 lg:px-10 2xl:rounded-none rounded-tr-[20px]"
              >
                {{ boothInfo.boothName }}
              </div>
              <div
                class="flex items-center justify-center 2xl:border-x border-r border-b border-primary-700 px-4 font-medium text-xl"
              >
                운영시간
              </div>
              <div
                class="bg-white 2xl:rounded-tr-2xl flex items-center justify-between border-b border-primary-700 px-6 lg:px-10"
              >
                <div class="flex items-center justify-center gap-4 flex-wrap">
                  <div class="text-wrap">{{ boothInfo.openTime }}~{{ boothInfo.closeTime }}</div>
                  <div
                    class="hidden sm:flex w-[74px] h-[35px] rounded-full items-center justify-center"
                    :class="{
                      'bg-primary-800 text-primary-900': boothInfo.isOpen,
                      'bg-danger-light text-danger': !boothInfo.isOpen,
                    }"
                  >
                    {{ boothInfo.isOpen ? '운영중' : '준비중' }}
                  </div>
                </div>
                <IconBoothListToggle :is-active="boothInfo.isOpen" @click="handleClickBoothOpen()" />
              </div>
              <div
                class="flex items-center justify-center border-r border-b border-primary-700 px-4 text-xl font-medium"
              >
                부스 소개
              </div>
              <div class="px-6 lg:px-10 2xl:col-span-3 bg-white flex items-center border-b border-primary-700">
                <p class="whitespace-pre-line">{{ boothInfo.boothIntro }}</p>
              </div>
              <div
                class="flex items-center justify-center border-r border-primary-700 h-[280px] px-4 text-xl font-medium"
              >
                부스 이미지
              </div>
              <div
                class="min-w-[400px] overflow-x-auto overflow-y-hidden 2xl:col-span-3 flex justify-between items-center bg-white rounded-br-[20px] border-primary-700 h-[280px] py-[40px] px-[40px] gap-[23px]"
              >
                <IconIndicator :left="true" @click="handleClickLeftIndicator()" />
                <div class="grow flex gap-[10px] overflow-auto no-scroll" ref="scrollContainer">
                  <div
                    class="w-[200px] h-[200px] rounded-2xl bg-gray-50 shrink-0 border border-gray-200 bg-contain bg-no-repeat bg-center"
                    :style="setBackgroundImage(boothImage)"
                    v-for="(boothImage, boothImageIndex) in boothInfo.boothImage"
                    :key="boothImageIndex"
                  ></div>
                </div>
                <IconIndicator :right="true" @click="handleClickRightIndicator()" />
              </div>
            </div>
          </div>
        </div>

        <!-- 계좌 정보  -->
        <div v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'" class="flex flex-col gap-[20px] w-full">
          <div
            class="w-[137px] h-[61px] rounded-2xl flex items-center justify-center bg-primary-700 text-primary-900 text-xl lg:text-2xl font-semibold"
          >
            계좌 정보
          </div>
          <div class="w-full bg-primary-900-lighter h-auto rounded-2xl px-[40px] py-[40px]">
            <div
              class="w-full bg-primary-700 h-full rounded-2xl border border-primary-700 grid grid-cols-[120px_1fr] grid-rows-[80px_80px_80px] 2xl:grid-cols-[200px_1fr_200px_1fr] 2xl:grid-rows-[80px_80px] place-items-stretch"
            >
              <div
                class="flex items-center justify-center border-b border-r border-primary-700 px-4 text-xl font-medium"
              >
                예금주
              </div>
              <div
                class="bg-white flex items-center border-b border-primary-700 text-wrap px-6 lg:px-10 2xl:rounded-none rounded-tr-[20px]"
              >
                {{ boothInfo.accountInfo?.accountHolder }}
              </div>
              <div
                class="flex items-center justify-center 2xl:border-x border-r border-b border-primary-700 px-4 font-medium text-xl"
              >
                은행명
              </div>
              <div
                class="bg-white 2xl:rounded-tr-2xl flex items-center justify-between border-b border-primary-700 px-6 lg:px-10"
              >
                {{ boothInfo.accountInfo?.bankName }}
              </div>
              <div class="flex items-center justify-center border-r border-primary-700 px-4 text-xl font-medium">
                계좌번호
              </div>
              <div class="px-6 lg:px-10 2xl:col-span-3 bg-white flex items-center border-primary-700 rounded-br-2xl">
                {{ boothInfo.accountInfo?.account }}
              </div>
            </div>
          </div>
        </div>
        <!-- 메뉴 정보 -->
        <div v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'" class="flex flex-col gap-[20px] w-full">
          <div
            class="w-[137px] h-[61px] rounded-2xl flex items-center justify-center bg-primary-700 text-primary-900 text-xl lg:text-2xl font-semibold"
          >
            메뉴 정보
          </div>
          <div class="bg-primary-900-lighter rounded-2xl w-full lg:py-[40px] lg:px-[60px] px-4 py-4 flex flex-col">
            <div class="grid gap-4 grid-cols-1 2xl:grid-cols-2">
              <div
                v-for="(menu, menuIndex) in menuList"
                :key="menuIndex"
                class="h-[220px] rounded-2xl flex text-2xl items-center font-bold px-[25px] py-[25px] gap-[28px] bg-white hover:border-primary-900 border-1 border-primary-700"
              >
                <div
                  class="hidden md:block w-[180px] h-[180px] bg-contain bg-no-repeat bg-center bg-white rounded-xl flex-shrink-0 border-gray-200 border"
                  :style="setBackgroundImage(menu.menuImage)"
                ></div>
                <div class="flex flex-col w-full justify-between">
                  <div class="flex flex-col w-full">
                    <!-- Menu header -->
                    <div class="flex justify-between items-center h-[29px] w-full min-w-fit gap-2">
                      <div class="text-lg font-semibold text-secondary-700 text-nowrap truncate w-[190px] sm:w-[300px] md:w-[150px] lg:w-[220px] xl:w-[480px] 2xl:w-[150px] 3xl:w-full 3xl:max-w-[280px]">
                        {{ menu.menuName }}
                      </div>
                      <div class="gap-[12px] items-center text-sm flex flex-shrink-0 justify-end grow font-medium">
                        <div
                          class="w-[80px] h-[29px] rounded-full bg-secondary-300 items-center flex justify-center text-secondary-700"
                        >
                          {{ MENU_TYPE[menu.menuType] }}
                        </div>
                        <button
                          class="w-[65px] h-[29px] rounded-full flex items-center justify-center cursor-text"
                          :class="{
                            'bg-primary-800 text-primary-900': !menu.isSoldOut,
                            'bg-danger-light text-danger': menu.isSoldOut,
                          }"
                          type="button"
                        >
                          {{ menu.isSoldOut ? '준비중' : '판매중' }}
                        </button>
                      </div>
                    </div>
                    <!-- Menu Body -->
                    <p
                      class="pt-[12px] pb-[12px] h-[78px] text-secondary-700-light font-normal text-base break-all text-wrap line-clamp-3"
                    >
                      {{ menu.menuDescription }}
                    </p>
                  </div>
                  <!-- Menu Footer -->
                  <div class="flex justify-between items-center w-full">
                    <div class="text-secondary-700 font-bold text-2xl">
                      {{ prettyPrice(menu.menuPrice)
                      }}<span class="text-secondary-700-light font-normal text-2xl"></span>
                    </div>
                    <IconBoothListToggle :is-active="!menu.isSoldOut" @click="handleClickSoldOut(menu)" />
                  </div>
                </div>
              </div>
              <div
                v-if="menuList.length === 0"
                class="col-span-2 h-[220px] border-danger rounded-2xl border flex flex-col items-center justify-center bg-white"
              >
                <div class="text-4xl text-danger">메뉴를 등록해주세요.</div>
                <!-- <div>메뉴 추가하기</div> -->
              </div>
            </div>
          </div>
        </div>

        <!-- 예약기능 사용 여부 -->
        <div
          v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'"
          class="flex gap-6 md:gap-[40px] items-center flex-wrap"
        >
          <div
            class="h-[60px] rounded-2xl text-primary-900 flex items-center justify-center font-semibold lg:text-2xl text-xl bg-primary-700 px-[24px]"
          >
            예약 기능 사용 여부
          </div>
          <div class="flex gap-[28px]">
            <div class="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer">
              <IconRadio :is-active="boothInfo.isReservation" :read-only="true" />
              <div
                class="text-secondary-900 text-xl font-semibold"
                :class="{
                  'text-success': boothInfo.isReservation,
                  'text-danger': !boothInfo.isReservation,
                }"
              >
                {{ boothInfo.isReservation ? '사용 중' : '사용 안함' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 쿠폰 진행 여부 -->
        <div v-if="false" class="flex gap-6 md:gap-[40px] items-center flex-wrap">
          <div class="w-[232px] h-[60px]">
            <div
              class="h-[60px] rounded-2xl text-primary-900 flex items-center justify-center font-semibold text-xl lg:text-2xl bg-primary-700 px-[24px]"
            >
              쿠폰 진행 여부
            </div>
          </div>
          <div class="flex gap-[28px]">
            <div class="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer" @click="useCoupon = true">
              <IconRadio :is-active="false" :read-only="true" />
              <div class="text-xl font-semibold">
                {{ false ? '사용 중' : '사용 안함' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 주문 기능 사용 여부 -->
        <div
          v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'"
          class="flex gap-6 md:gap-[40px] items-center flex-wrap"
        >
          <div
            class="h-[60px] rounded-2xl text-primary-900 flex items-center justify-center font-semibold text-xl lg:text-2xl bg-primary-700 px-[24px]"
          >
            주문 기능 사용 여부
          </div>
          <div class="flex gap-[28px]">
            <div class="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer" @click="useOrder = true">
              <IconRadio :is-active="boothInfo.isOrder" :read-only="true" />
              <div
                class="text-secondary-900 text-xl font-semibold"
                :class="{
                  'text-success': boothInfo.isOrder,
                  'text-danger': !boothInfo.isOrder,
                }"
              >
                {{ boothInfo.isOrder ? '사용 중' : '사용 안함' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="css" scoped></style>

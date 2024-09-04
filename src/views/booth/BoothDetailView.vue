<script setup>
import IconBoothInfo from '@/components/icons/IconBoothInfo.vue';
import IconBoothListToggle from '@/components/icons/IconBoothListToggle.vue';
import IconIndicator from '@/components/icons/IconIndicator.vue';
import IconRadio from '@/components/icons/IconRadio.vue';
import IconNotFound from '@/components/icons/IconNotFound.vue';
import { prettyPrice } from '@/utils/utils';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useTableDetail } from '@/stores/booths/tableDetail';
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
const useTableDetailStore = useTableDetail();

const { reset, init } = useBoothDetailStore;
const { boothInfo, menuList } = storeToRefs(useBoothDetailStore);
const { tableNum, tableNumList } = storeToRefs(useTableDetailStore);

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

const handleClickTableNum = (index) => {
  window.navigator.clipboard.writeText(tableNumList.value[index].orderUrl);
  alert('QR 코드 주소가 복사되었습니다.');
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
  <div class="flex flex-col px-4 gap-[20px] min-w-[630px] pb-20">
    <form>
      <div class="flex justify-between pt-[100px] min-w-[350px] pb-[40px]">
        <div class="flex items-center gap-4">
          <IconBoothInfo />
          <div class="text-primary-900 text-xl md:text-2xl font-semibold">{{ boothInfo.adminName }} 부스 정보</div>
        </div>
        <button
          class="is-button font-semibold w-[60px] h-[35px] rounded-xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-900cursor-pointer select-none"
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
            class="w-[95px] h-[45px] rounded-xl flex items-center justify-center bg-primary-700 text-primary-900-light text-md font-semibold"
          >
            부스 정보
          </div>
          <div class="w-full bg-primary-500-light h-auto rounded-2xl px-[40px] py-[40px] border-1 border-primary-700">
            <div
              class="w-full bg-primary-700 h-full rounded-2xl border border-primary-700 grid grid-cols-[110px_1fr] grid-rows-[80px_80px_200px_280px] 2xl:grid-cols-[140px_1fr_140px_1fr] 2xl:grid-rows-[65px_150px_280px] place-items-stretch"
            >
              <div
                class="flex items-center justify-center border-b border-r border-primary-700 px-4 text-sm font-medium"
              >
                부스 이름
              </div>
              <div
                class="bg-white flex items-center border-b text-sm border-primary-700 text-wrap px-6 lg:px-10 2xl:rounded-none rounded-tr-[20px]"
              >
                {{ boothInfo.boothName }}
              </div>
              <div
                class="flex items-center justify-center 2xl:border-x border-r border-b border-primary-700 px-3 font-medium text-sm"
              >
                운영시간
              </div>
              <div
                class="bg-white 2xl:rounded-tr-2xl flex items-center justify-between border-b border-primary-700 px-6 lg:px-10"
              >
                <div class="flex items-center text-sm justify-center gap-4 flex-wrap">
                  <div class="text-wrap">{{ boothInfo.openTime }}~{{ boothInfo.closeTime }}</div>
                  <div
                    class="hidden text-[10px] sm:flex w-[45px] h-[25px] rounded-full items-center justify-center"
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
                class="flex items-center justify-center border-r border-b border-primary-700 px-4 text-sm font-medium"
              >
                부스 소개
              </div>
              <div class="px-6 lg:px-10 2xl:col-span-3 bg-white flex items-center border-b border-primary-700 text-sm">
                <p class="whitespace-pre-line">{{ boothInfo.boothIntro }}</p>
              </div>
              <div
                class="flex items-center justify-center border-r border-primary-700 h-[280px] px-4 text-sm font-medium"
              >
                부스 이미지
              </div>
              <div
                v-if="boothInfo.boothImage[0] !== ''"
                class="min-w-full overflow-x-auto overflow-y-hidden 2xl:col-span-3 flex justify-between items-center bg-white rounded-br-[20px] border-primary-700 h-[280px] py-[40px] px-[40px] gap-[23px]"
              >
                <IconIndicator :left="true" @click="handleClickLeftIndicator()" />
                <div class="grow flex gap-[10px] overflow-auto no-scroll" ref="scrollContainer">
                  <div
                    class="w-[160px] h-[160px] rounded-2xl bg-gray-50 shrink-0 border border-gray-200 bg-contain bg-no-repeat bg-center"
                    :style="setBackgroundImage(boothImage)"
                    v-for="(boothImage, boothImageIndex) in boothInfo.boothImage"
                    :key="boothImageIndex"
                  ></div>
                </div>
                <IconIndicator :right="true" @click="handleClickRightIndicator()" />
              </div>
              <div
                v-if="boothInfo.boothImage[0] === ''"
                class="min-w-[400px] overflow-x-auto overflow-y-hidden 2xl:col-span-3 flex flex-col justify-between items-center bg-white rounded-br-[20px] border-primary-700 h-[280px] py-[20px] px-[20px] gap-[23px]"
              >
                <IconNotFound />
                <div>등록된 부스 이미지가 없습니다.</div>
              </div>
            </div>
            <!-- 테이블 정보 -->
            <div v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'">
              <div class="flex items-start flex-col gap-[26px] py-10 lg:items-center lg:flex-row">
                <div
                  class="w-[200px] h-[45px] rounded-xl flex items-center justify-center bg-primary-700 text-primary-900-light text-md font-semibold px-5 gap-3 shrink-0"
                >
                  현재 테이블 개수<span class="text-secondary-700-light">{{ tableNum }}개</span>
                </div>
                <div class="text-secondary-500 text-sm">* 테이블 번호 클릭 시 테이블의 QR 코드 주소가 복사됩니다.</div>
              </div>
              <div class="grid 3xl:grid-cols-4 2xl:grid-cols-3 lg:grid-cols-2 gap-5 place-items-center">
                <div
                  v-for="(table, tableIndex) in tableNumList"
                  :key="tableIndex"
                  class="h-14 flex text-center rounded-3lg shadow-secondary w-full"
                >
                  <div
                    @click="handleClickTableNum(tableIndex)"
                    class="w-[100px] bg-primary-700 rounded-l-3lg border-1 border-primary-700-dark text-secondary-700-light font-medium text-sm grid place-items-center cursor-pointer"
                  >
                    테이블 {{ tableIndex + 1 }}
                  </div>
                  <div
                    class="grow min-w-[120px] bg-white rounded-r-3lg border-1 border-primary-900-ligther border-l-0 grid place-items-center text-secondary-700 text-sm font-semibold"
                  >
                    {{ table.customTableNum }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 계좌 정보  -->
        <div v-if="ADMIN_CATEGORY[boothInfo.adminCategory] === 'night'" class="flex flex-col gap-[20px] w-full">
          <div
            class="w-[95px] h-[45px] rounded-xl flex items-center justify-center bg-primary-700 text-primary-900-light text-md font-semibold"
          >
            계좌 정보
          </div>
          <div class="w-full bg-primary-500-light h-auto rounded-2xl px-[40px] py-[40px] border-1 border-primary-700">
            <div
              class="w-full bg-primary-700 h-full rounded-2xl border border-primary-700 grid grid-cols-[120px_1fr] grid-rows-[60px_60px_60px] 2xl:grid-cols-[120px_1fr_200px_1fr] 2xl:grid-rows-[60px_60px] place-items-stretch"
            >
              <div
                class="flex items-center justify-center border-b border-r border-primary-700 px-4 text-sm font-medium"
              >
                예금주
              </div>
              <div
                class="bg-white flex items-center border-b border-primary-700 text-wrap px-6 lg:px-10 2xl:rounded-none rounded-tr-[20px] text-sm"
              >
                {{ boothInfo.accountInfo?.accountHolder }}
              </div>
              <div
                class="flex items-center justify-center 2xl:border-x border-r border-b border-primary-700 px-4 font-medium text-sm"
              >
                은행명
              </div>
              <div
                class="bg-white 2xl:rounded-tr-2xl flex items-center justify-between border-b border-primary-700 px-6 lg:px-10 text-sm"
              >
                {{ boothInfo.accountInfo?.bankName }}
              </div>
              <div class="flex items-center justify-center border-r border-primary-700 px-4 text-sm font-medium">
                계좌번호
              </div>
              <div class="px-6 lg:px-10 2xl:col-span-3 bg-white flex items-center border-primary-700 rounded-br-2xl text-sm">
                {{ boothInfo.accountInfo?.account }}
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
            class="bg-primary-500-light rounded-2xl w-full lg:py-[40px] lg:px-[40px] px-4 py-4 flex flex-col border-1 border-primary-700"
          >
            <div class="grid gap-4 grid-cols-1 2xl:grid-cols-2">
              <div
                v-for="(menu, menuIndex) in menuList"
                :key="menuIndex"
                class="h-[170px] rounded-2xl flex text-sm items-center font-bold p-5 gap-[28px] bg-white hover:border-primary-900 border-1 border-primary-700"
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
                      <div class="w-2/5 gap-[5px] items-center text-sm flex flex-shrink-0 justify-end grow font-medium 2xl:max-w-[130px]">
                        <div
                          v-if="ADMIN_CATEGORY[boothInfo.adminCategory] !== 'day'"
                          class="w-[55px] h-[25px] text-[10px] rounded-full bg-secondary-300 items-center flex justify-center text-secondary-700"
                        >
                          {{ MENU_TYPE[menu.menuType] }}
                        </div>
                        <button
                          class="w-[45px] h-[25px] rounded-full flex items-center justify-center cursor-text text-[10px]"
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
                    <IconBoothListToggle :is-active="!menu.isSoldOut" @click="handleClickSoldOut(menu)" />
                  </div>
                </div>
              </div>
              <div
                v-if="menuList.length === 0"
                class="col-span-2 h-[220px] border-danger rounded-2xl border flex flex-col items-center justify-center bg-white"
              >
                <div class="text-xl text-danger">메뉴를 등록해주세요.</div>
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
            class="h-[45px] rounded-xl text-primary-900-light flex items-center justify-center font-semibold text-md bg-primary-700 px-[24px]"
          >
            예약 기능 사용 여부
          </div>
          <div class="flex gap-[28px]">
            <div class="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer">
              <IconRadio :is-active="boothInfo.isReservation" :read-only="true" />
              <div
                class="text-sm font-semibold"
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
              class="h-[45px] rounded-xl text-primary-900-light flex items-center justify-center font-semibold text-md bg-primary-700 px-[24px]"
            >
              쿠폰 진행 여부
            </div>
          </div>
          <div class="flex gap-[28px]">
            <div class="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer" @click="useCoupon = true">
              <IconRadio :is-active="false" :read-only="true" />
              <div
                class="text-sm font-semibold"
                :class="{
                  'text-success': boothInfo.isReservation,
                  'text-danger': !boothInfo.isReservation,
                }"
              >
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
            class="h-[45px] rounded-xl text-primary-900-light flex items-center justify-center font-semibold text-md bg-primary-700 px-[24px]"
          >
            주문 기능 사용 여부
          </div>
          <div class="flex gap-[28px]">
            <div class="flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer" @click="useOrder = true">
              <IconRadio :is-active="boothInfo.isOrder" :read-only="true" />
              <div
                class="text-sm font-semibold"
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

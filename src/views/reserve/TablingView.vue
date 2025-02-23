<script setup>
import IconBoothListToggle from '@/components/icons/IconBoothListToggle.vue';
import IconLoading from '@/components/icons/IconLoading.vue';
import IconNotFound from '@/components/icons/IconNotFound.vue';
import IconReservation from '@/components/icons/IconReservation.vue';
import router from '@/router';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import { useBoothList } from '@/stores/booths/boothList';
import { useMessageModal } from '@/stores/reserve/messageModal';
import { useReserveList } from '@/stores/reserve/reserveList';
import { useReservePopup } from '@/stores/reserve/reservePopup';
import { useUser } from '@/stores/user';
import { useMessage } from '@/stores/reserve/message';
import { alertError } from '@/utils/api';
import { prettyDate, prettyPhoneNumber } from '@/utils/utils';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';

const useUserStore = useUser();
const useBoothListStore = useBoothList();
const useReserveListStore = useReserveList();
const useReservePopupStore = useReservePopup();
const useMessageModalStore = useMessageModal();
const useBoothDeatilStore = useBoothDetail();
const useMessageStore = useMessage();

const { getAllBoothList } = useBoothListStore;
const { getReserveList, deleteReserve, confirmReserve, restoreReserve, getFilteredReserveList } = useReserveListStore;
const { openBoothReservePopup, openPopup } = useReservePopupStore;
const { openMessageModal, openMessageCusotmModal } = useMessageModalStore;
const { getNightBoothInfo } = useBoothDeatilStore;
const { getMessage } = useMessageStore;

const { isAdmin, userOwnBoothId } = storeToRefs(useUserStore);
const { boothList } = storeToRefs(useBoothListStore);
const { reserveList, searchKeyword } = storeToRefs(useReserveListStore);

const reserveBoothList = ref([]);

const selectBooth = ref({});
const selectBoothId = ref('');
const selectOrderType = ref('reserve'); // reserve, cancel, complete

const reserveNum = ref(0);
const isUpdate = ref(false);
const isUserChecked = ref(false);
const isLoading = ref(false);

const interval = ref(null);

const setIsUpdate = ({ reserveLength }) => {
  if (isUserChecked.value) {
    isUpdate.value = false;
  } else if (reserveLength !== reserveNum.value) {
    isUpdate.value = true;
  } else if (reserveLength === reserveNum.value && isUserChecked.value) {
    isUpdate.value = false;
  }
  reserveNum.value = reserveLength;
};

const setSelectBooth = (booth) => {
  selectBooth.value = booth;
};

const handleDelete = async (reserveId) => {
  const status = await deleteReserve({
    boothId: selectBoothId.value,
    reserveId: reserveId,
    reserveType: selectOrderType.value,
  });
  if (status) {
    const getReserveListAll = await Promise.allSettled([
      getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value }),
      getReserveList({ boothId: selectBoothId.value, type: 'reserve' }),
    ]);
  }
  setIsUpdate({ reserveLength: reserveList.value['reserve'].length });
};

const handleConfirm = async (reserveId) => {
  const status = await confirmReserve({
    boothId: selectBoothId.value,
    reserveId: reserveId,
    reserveType: selectOrderType.value,
  });
  if (status) {
    const getReserveListAll = await Promise.allSettled([
      getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value }),
      getReserveList({ boothId: selectBoothId.value, type: 'reserve' }),
    ]);
  }
  setIsUpdate({ reserveLength: reserveList.value['reserve'].length });
};

const handleRestore = async (reserveId) => {
  const status = await restoreReserve({
    boothId: selectBoothId.value,
    reserveId: reserveId,
    reserveType: selectOrderType.value,
  });
  if (status) {
    const getReserveListAll = await Promise.allSettled([
      getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value }),
      getReserveList({ boothId: selectBoothId.value, type: 'reserve' }),
    ]);
  }
  setIsUpdate({ reserveLength: reserveList.value['reserve'].length });
};

const handleClickOrderType = (type) => {
  if (!selectBooth.value.isReservation) return;
  if (type === 'reserve') isUserChecked.value = true;
  else isUserChecked.value = false;
  selectOrderType.value = type;
};

const handleClickDelete = async (reserve) => {
  openPopup({
    reserveInfo: reserve,
    type: 'cancel',
    callback: () => handleDelete(reserve.reservationId),
  });
};

const handleClickConfirm = async (reserve) => {
  openPopup({
    reserveInfo: reserve,
    type: 'confirm',
    callback: () => handleConfirm(reserve.reservationId),
  });
};

const handleClickRestore = async (reserve) => {
  openPopup({
    reserveInfo: reserve,
    type: 'restore',
    callback: () => handleRestore(reserve.reservationId),
  });
};

const refereshReserveList = () => {
  interval.value = setInterval(async () => {
    if (!selectBoothId.value) return;
    if (!selectOrderType.value) return;

    if (selectOrderType.value === 'reserve') {
      await getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value });
    } else {
      const getReserveListAll = await Promise.allSettled([
        getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value }),
        getReserveList({ boothId: selectBoothId.value, type: 'reserve' }),
      ]);
    }
    setIsUpdate({ reserveLength: reserveList.value['reserve'].length });
  }, 3000);
};

const handleClickMessage = (reserve) => {
  openMessageModal(reserve);
};

const handleClickMessageCustom = async () => {
  if (!selectBoothId.value) return;
  await getMessage(selectBoothId.value);
  openMessageCusotmModal();
};

watchEffect(async () => {
  if (!selectBoothId.value) return;
  if (!selectOrderType.value) return;
  isLoading.value = true;
  await getNightBoothInfo(selectBoothId.value);
  await getReserveList({ boothId: selectBoothId.value, type: selectOrderType.value });
  setIsUpdate({ reserveLength: reserveList.value['reserve'].length });
  clearReferesh();
  refereshReserveList();
  isLoading.value = false;
});

watchEffect(() => {
  if (!selectBoothId.value) return;
  if (!reserveBoothList.value) return;
  selectBooth.value = reserveBoothList.value.find((booth) => booth.boothId === selectBoothId.value);
  if (!selectBooth.value) {
    selectBooth.value = boothList.value.find((booth) => booth.boothId === selectBoothId.value);
  }
});

watchEffect(() => {
  if (selectOrderType.value === 'reserve') {
    isUserChecked.value = true;
  } else {
    isUserChecked.value = false;
  }
});

const clearReferesh = () => {
  if (!interval.value) return;
  clearInterval(interval.value);
};

onMounted(async () => {
  clearReferesh();
  await getAllBoothList();
  reserveBoothList.value = boothList.value.filter((booth) => booth?.isReservation);
  if (isAdmin.value) {
    selectBoothId.value = reserveBoothList.value[0].boothId;
  } else {
    if (userOwnBoothId.value) {
      selectBoothId.value = userOwnBoothId.value;
    } else {
      alertError('부스를 소유하고 있지 않습니다.');
      router.push('/');
    }
  }
  refereshReserveList();
});

onUnmounted(() => {
  clearReferesh();
});
</script>
<template>
  <div class="flex flex-col px-4 gap-[40px] min-w-[630px] pb-20">
    <!-- Reserve Header -->
    <div class="flex flex-col justify-between pt-[100px] gap-4 lg:flex-row">
      <div class="flex items-center gap-4">
        <IconReservation />
        <div class="text-primary-900 text-xl md:text-2xl font-semibold">{{ selectBooth.adminName }} 예약 현황</div>
      </div>
      <div class="flex gap-5 items-center">
        <button
          class="is-button font-semibold w-[100px] h-[40px] rounded-xl text-sm flex items-center justify-center text-white lg:text-md bg-primary-900 cursor-pointer select-none"
          @click="handleClickMessageCustom()"
        >
          문자 커스텀
        </button>
        <div
          class="w-[255px] h-[40px] rounded-xl bg-primary-800-light text-primary-900 flex justify-center items-center lg:text-lg text-md gap-[10px] font-semibold"
        >
          예약 기능 ON/OFF
          <IconBoothListToggle
            :width="70"
            :is-active="selectBooth.isReservation"
            @click="
              openBoothReservePopup({
                booth: selectBooth,
                callback: setSelectBooth,
              })
            "
          />
        </div>
      </div>
    </div>
    <!-- Reserve Category -->
    <div class="flex justify-between min-w-[350px] gap-4">
      <div class="flex items-center gap-4">
        <button
          class="is-button w-[100px] h-[40px] relative text-sm rounded-[16px]"
          :class="{ 'is-outlined': selectOrderType !== 'reserve' }"
          @click="handleClickOrderType('reserve')"
        >
          예약 목록
          <div
            v-if="isUpdate && !isUserChecked"
            class="rounded-full w-2 h-2 bg-red-600 absolute right-2 top-[16px]"
          ></div>
        </button>
        <button
          class="is-button w-[100px] h-[40px] text-sm rounded-[16px]"
          :class="{ 'is-outlined': selectOrderType !== 'complete' }"
          @click="handleClickOrderType('complete')"
        >
          입장 목록
        </button>
        <button
          class="is-button w-[100px] h-[40px] is-danger text-sm rounded-[16px]"
          :class="{ 'is-outlined': selectOrderType !== 'cancel' }"
          @click="handleClickOrderType('cancel')"
        >
          취소 목록
        </button>
      </div>
      <div
        class="w-[450px] h-[40px] rounded-2xl bg-primary-800-light text-primary-900 flex justify-center items-center text-sm gap-[10px]"
      >
        <div class="relative w-full">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            class="peer block w-full p-3 ps-10 text-xs text-gray-900 border border-gray-300 rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="예약 검색(예약자, 전화번호...)"
            v-model="searchKeyword"
          />
          <button
            type="button"
            class="absolute end-2.5 bottom-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-[5px] is-button"
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <!-- For admin -->
    <div class="flex justify-between min-w-[350px] items-center gap-4" v-if="isAdmin">
      <div class="flex-shrink-0 text-md font-semibold">학과 선택:</div>

      <select
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        v-model="selectBoothId"
      >
        <option v-for="(booth, boothIndex) in reserveBoothList" :key="boothIndex" :value="booth.boothId">
          {{ booth.adminName }} - {{ booth.boothName }}
        </option>
      </select>
    </div>
    <!-- Table.. -->
    <div class="relative overflow-x-auto outline outline-1 outline-primary-500 rounded-2xl shadow-secondary">
      <table class="w-full text-xs lg:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs lg:text-sm uppercase bg-secondary-500 border-b-1 border-primary-500">
          <tr>
            <th scope="col" class="px-6 py-3 text-center text-secondary-700-light font-medium capitalize">No.</th>
            <th scope="col" class="px-6 py-3 text-center text-secondary-700-light font-medium capitalize">예약 번호</th>
            <th scope="col" class="px-6 py-3 text-center text-secondary-700-light font-medium">예약자</th>
            <th scope="col" class="px-6 py-3 text-center text-secondary-700-light font-medium">인원수</th>
            <th scope="col" class="px-6 py-3 text-center text-secondary-700-light font-medium">연락처</th>
            <th scope="col" class="px-6 py-3 text-center text-secondary-700-light font-medium">예약 시간</th>
            <th
              scope="col"
              colspan="3"
              class="px-6 py-3 text-center text-secondary-700-light font-medium min-w-[140px]"
            >
              예약 관리
            </th>
          </tr>
        </thead>
        <tbody class="text-xs lg:text-sm">
          <tr
            v-if="!isLoading && selectBooth.isReservation"
            class="bg-white border-b-1 border-secondary-300 text-secondary-700-light last:border-0"
            v-for="(reserve, reserveIndex) in getFilteredReserveList({ type: selectOrderType })"
            :key="reserveIndex"
          >
            <th scope="row" class="px-6 py-4 whitespace-nowrap text-center font-normal">
              {{ reserveIndex + 1 }}
            </th>
            <th scope="row" class="px-6 py-4 whitespace-nowrap text-center font-normal">
              {{ reserve.reservationNum }}
            </th>
            <td class="px-6 py-4 text-center min-w-[85px] lg:min-w-[100px]">{{ reserve.userName }}</td>
            <td class="px-6 py-4 text-center">{{ reserve.personCount }}명</td>
            <td class="px-6 py-4 text-center">{{ prettyPhoneNumber(reserve.phoneNum) }}</td>
            <td class="px-6 py-4 text-center">{{ prettyDate(reserve.updateAt) }}</td>
            <td class="py-4 px-[2px] lg:px-1 w-10 lg:w-12" v-if="selectOrderType !== 'complete'">
              <div class="w-full flex justify-center">
                <button class="is-button w-10 lg:w-12 h-[30px] text-[10px] md:text-xs" type="button" @click="handleClickConfirm(reserve)">
                  입장
                </button>
              </div>
            </td>
            <td class="py-4 px-[2px] w-10 lg:w-12" v-if="selectOrderType !== 'cancel'">
              <div class="w-full flex justify-center">
                <button
                  type="button"
                  class="is-button w-10 lg:w-12 h-[30px] text-[10px] md:text-xs is-danger is-outlined"
                  @click="handleClickDelete(reserve)"
                >
                  취소
                </button>
              </div>
            </td>
            <td class="py-4 lg:px-2 w-10 lg:w-12" v-if="selectOrderType !== 'reserve'">
              <div class="w-full flex justify-center">
                <button
                  type="button"
                  class="is-button w-10 lg:w-12 h-[30px] text-[10px] md:text-xs is-outlined"
                  @click="handleClickRestore(reserve)"
                >
                  예약
                </button>
              </div>
            </td>
            <td class="py-4 pl-1 pr-4 w-10 lg:w-12">
              <div class="w-full flex justify-center">
                <button
                  type="button"
                  class="is-button w-10 lg:w-12 h-[30px] text-[10px] md:text-xs is-outlined"
                  @click="handleClickMessage(reserve)"
                >
                  문자
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="isLoading && selectBooth.isReservation">
            <td scope="col" colspan="9">
              <div class="w-full justify-center items-center flex flex-col py-14 bg-white rounded-b-[20px]">
                <IconLoading :width="200" />
                <p class="text-md py-4">에약 내역을 불러오는 중이에요...</p>
              </div>
            </td>
          </tr>
          <tr
            v-if="
              !isLoading && getFilteredReserveList({ type: selectOrderType }).length === 0 && selectBooth.isReservation
            "
          >
            <td scope="col" colspan="9">
              <div class="w-full justify-center items-center flex flex-col py-10 bg-white rounded-b-[20px]">
                <IconNotFound :width="200" />
                <p class="text-lg py-4">검색 내역이 없습니다...</p>
              </div>
            </td>
          </tr>
          <tr v-if="!selectBooth.isReservation">
            <td scope="col" colspan="9">
              <div class="w-full justify-center items-center flex flex-col py-10 bg-white rounded-b-[20px]">
                <IconNotFound :width="200" />
                <p class="text-lg py-4">예약 기능이 꺼져있습니다...</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

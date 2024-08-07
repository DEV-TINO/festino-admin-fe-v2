<script setup>
import { useTableDetail } from '@/stores/booths/tableDetail';

const useTableDetailStore = useTableDetail();
const { TABLE_INFO, closeTableDetailModal, submitTableDetail } = useTableDetailStore;

const handleInputCustomTableNum = (event, index) => {
  TABLE_INFO[index].customNum = event.target.value;
};
</script>

<template>
  <form @submit.prevent="">
    <div
      id="modalContainer"
      class="w-[780px] h-[720px] flex flex-col justify-between items-center bg-white rounded-2xl overflow-y-auto p-10 gap-5 text-2xl"
    >
      <div
        class="w-full flex justify-between items-center gap-5 text-xl text-secondary-700 h-[60px] shrink-0 font-bold"
      >
        <div class="w-32 text-center flex-shrink-0">테이블 번호</div>
        <div class="w-full">커스텀 테이블 번호</div>
      </div>
      <div v-for="(table, index) in TABLE_INFO" :key="index" class="w-full flex justify-between items-center gap-5">
        <div class="w-32 text-center flex-shrink-0">{{ table.tableNum }}번</div>
        <input
          type="text"
          placeholder="커스텀 할 테이블 번호를 입력해주세요."
          @input="handleInputCustomTableNum($event, index)"
          :value="table.tableNum"
          maxlength="100"
          class="w-full h-[60px] border border-gray-400 bg-white px-[20px] rounded-2xl active:border-primary-900"
        />
      </div>
      <!-- Buttons -->
      <div class="w-full flex justify-end items-center gap-[10px]">
        <button
          class="is-button is-outlined w-[100px] h-[50px] font-semibold text-xl"
          type="button"
          @click="closeTableDetailModal()"
        >
          취소
        </button>
        <button
          class="is-button w-[100px] h-[50px] font-semibold text-xl"
          type="submit"
          ref="submit"
          @click="submitTableDetail()"
          autofocus
        >
          확인
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="css" scoped>
#modalContainer {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

#modalContainer::-webkit-scrollbar {
  display: none;
}
</style>

<script setup>
import { useTableDetail } from '@/stores/booths/tableDetail';
import { nextTick, ref } from 'vue';

const useTableDetailStore = useTableDetail();
const { TABLE_INFO, closeTableDetailModal, submitTableDetail } = useTableDetailStore;

const modalContainer = ref(null);

const handleInputCustomTableNum = (event, index) => {
  TABLE_INFO[index].customNum = event.target.value;
};

const handleClickAddTableButton = async () => {
  TABLE_INFO.push({ tableNum: TABLE_INFO.length + 1, customNum: '' });
  await nextTick();
  if (modalContainer.value) {
    modalContainer.value.scrollTop = modalContainer.value.scrollHeight;
  }
};

const handleClickDeleteTableButton = () => {
  TABLE_INFO.pop();
};
</script>

<template>
  <form @submit.prevent="">
    <div
      id="modalContainer"
      ref="modalContainer"
      class="w-[780px] h-[720px] flex flex-col justify-between items-center bg-white rounded-2xl overflow-y-auto p-10 gap-5 text-2xl"
    >
      <div
        class="w-full flex justify-between items-center gap-5 text-xl text-secondary-700 h-[60px] shrink-0 font-bold"
      >
        <div class="w-32 text-center flex-shrink-0">테이블 번호</div>
        <div class="w-full">커스텀 번호</div>
      </div>
      <div class="w-full flex flex-col grow gap-5">
        <div
          v-for="(table, index) in TABLE_INFO"
          :key="index"
          class="w-full flex justify-between items-center relative"
        >
          <div class="w-32 text-center flex-shrink-0">{{ table.tableNum }}</div>
          <input
            type="text"
            placeholder="커스텀 할 테이블 번호를 입력해주세요."
            @input="handleInputCustomTableNum($event, index)"
            :value="table.customNum"
            maxlength="100"
            class="w-full h-[60px] border border-gray-400 bg-white pl-[20px] pr-[60px] rounded-2xl active:border-primary-900"
          />
          <div
            v-if="index === TABLE_INFO.length - 1"
            @click="handleClickDeleteTableButton()"
            class="absolute right-5 text-base text-danger cursor-pointer"
          >
            삭제
          </div>
        </div>
      </div>
      <!-- Buttons -->
      <div class="w-full flex justify-between items-center text-xl pt-10">
        <button
          @click="handleClickAddTableButton()"
          class="text-secondary-900 border-1 border-secondary-900 h-[50px] rounded-2xl w-[150px] ml-8"
        >
          테이블 추가
        </button>
        <div class="flex gap-[10px]">
          <button
            class="is-button is-outlined w-[100px] h-[50px] font-semibold"
            type="button"
            @click="closeTableDetailModal()"
          >
            취소
          </button>
          <button
            class="is-button w-[100px] h-[50px] font-semibold"
            type="submit"
            ref="submit"
            @click="submitTableDetail()"
            autofocus
          >
            확인
          </button>
        </div>
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

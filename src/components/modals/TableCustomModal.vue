<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { useBoothDetail } from '@/stores/booths/boothDetail';
import IconNotFound from '../icons/IconNotFound.vue';
import IconClose from '../icons/IconClose.vue';
import IconPlus from '../icons/IconPlus.vue';

const useTableDetailStore = useTableDetail();

const { tableNumList, tableNum } = storeToRefs(useTableDetailStore);

const { closeTableDetailModal } = useTableDetailStore;

const modalContainer = ref(null);
const newTableNumList = ref(tableNumList.value || []);

const handleInputCustomTableNum = (event, index) => {
  newTableNumList.value[index].customTableNum = event.target.value;
};

const handleClickAddTableButton = async (num) => {
  if (num === 1) {
    newTableNumList.value.push({ tableNumIndex: newTableNumList.value.length + 1, customTableNum: '' });
  } else {
    for (let i = 0; i < 10; i++) {
      newTableNumList.value.push({ tableNumIndex: newTableNumList.value.length + 1, customTableNum: '' });
    }
  }
  await nextTick();
  modalContainer.value?.scrollTo({ top: modalContainer.value.scrollHeight, behavior: 'smooth' });
};

const handleClickTotalDeleteButton = () => {
  newTableNumList.value = [];
};

const handleClickSaveButton = () => {
  tableNumList.value = newTableNumList.value;
  tableNum.value = newTableNumList.value.length;
  closeTableDetailModal();
};

const handleClickCancelButton = () => {
  newTableNumList.value.pop();
};

onMounted(() => {
  setTimeout(() => {
    modalContainer.value?.scrollTo({ top: 0, behavior: 'auto' });
  }, 0);
});
</script>

<template>
  <div
    id="modalContainer"
    ref="modalContainer"
    class="w-[695px] h-[720px] flex flex-col justify-between items-center bg-white rounded-2xl overflow-y-auto px-[60px] py-[50px] gap-14"
  >
    <div class="w-full flex justify-between items-center gap-5 shrink-0 font-semibold text-3xl text-primary-900 h-9">
      <div class="w-[25px]"></div>
      테이블 커스텀
      <IconClose @click="closeTableDetailModal()" class="cursor-pointer" />
    </div>

    <!-- Table List -->
    <div class="w-full flex flex-col grow gap-5">
      <div
        v-for="(table, index) in newTableNumList"
        :key="index"
        class="w-full flex flex-col justify-between relative gap-[6px]"
      >
        <div class="w-32 flex-shrink-0 ml-1">테이블 {{ table.tableNumIndex }}</div>
        <input
          type="text"
          :placeholder="table.tableNumIndex"
          @input="handleInputCustomTableNum($event, index)"
          :value="table.customTableNum"
          maxlength="100"
          class="w-full h-[60px] border border-gray-400 bg-white px-[20px] rounded-2xl active:border-primary-900"
        />
        <div
          v-if="index === newTableNumList.length - 1"
          @click="handleClickCancelButton()"
          class="absolute right-5 text-base text-danger cursor-pointer"
        >
          삭제
        </div>
      </div>
      <div v-if="newTableNumList.length === 0" class="h-full flex flex-col justify-center items-center gap-5">
        <IconNotFound />
        테이블이 존재하지 않습니다. 추가해주세요!
      </div>
    </div>

    <!-- Buttons -->
    <div class="w-full flex justify-between">
      <div class="flex gap-[10px]">
        <div
          @click="handleClickAddTableButton(1)"
          class="w-[145px] rounded-2xl text-primary-900 text-xl font-semibold border-1 border-primary-900 h-12 flex items-center justify-center gap-2"
        >
          <IconPlus />
          테이블 추가
        </div>
        <div
          @click="handleClickAddTableButton(10)"
          class="w-[185px] rounded-2xl text-primary-900 text-xl font-semibold border-1 border-primary-900 h-12 flex items-center justify-center gap-2"
        >
          <IconPlus />
          테이블 10개 추가
        </div>
      </div>
      <div
        @click="handleClickTotalDeleteButton()"
        class="w-[145px] rounded-2xl text-danger text-xl font-semibold border-1 border-danger h-12 flex items-center justify-center gap-2"
      >
        전체 삭제
      </div>
    </div>

    <!-- Buttons -->
    <div class="w-full flex justify-end items-center text-xl gap-5">
      <button
        class="is-button is-outlined w-[100px] h-[50px] font-semibold"
        type="button"
        @click="closeTableDetailModal()"
      >
        취소
      </button>
      <button
        @click="handleClickSaveButton()"
        class="is-button w-[100px] h-[50px] font-semibold"
        type="submit"
        ref="submit"
        autofocus
      >
        저장
      </button>
    </div>
  </div>
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

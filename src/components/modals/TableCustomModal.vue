<script setup>
import { nextTick, onMounted, ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useTableDetail } from '@/stores/booths/tableDetail';
import IconNotFound from '../icons/IconNotFound.vue';
import IconClose from '../icons/IconClose.vue';
import IconPlus from '../icons/IconPlus.vue';
import _ from 'lodash';

const useTableDetailStore = useTableDetail();

const { closeTableDetailModal } = useTableDetailStore;

const { tableNumList, tableNum } = storeToRefs(useTableDetailStore);

const modalContainer = ref(null);
const newTableNumList = ref(_.cloneDeep(tableNumList.value));

const handleInputCustomTableNum = (event, index) => {
  newTableNumList.value[index].customTableNum = event.target.value;
};

const handleClickAddTableButton = async (num) => {
  let newIndex = newTableNumList.value.length;

  if (num === 1) {
    newTableNumList.value.push({ customTableNum: '', tableNumIndex: newIndex });
  } else {
    newTableNumList.value = [
      ...newTableNumList.value,
      ...Array(10)
        .fill()
        .map(() => ({ customTableNum: '', tableNumIndex: newIndex++ })),
    ];
  }

  await nextTick();

  const lastIndex = newTableNumList.value.length - 1;
  document.getElementById(`table-${lastIndex}`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
};

const handleClickTotalDeleteButton = () => {
  newTableNumList.value = [];
};

const handleClickDeleteButton = (index) => {
  newTableNumList.value.splice(index, 1);
};

const handleClickSaveButton = () => {
  newTableNumList.value.forEach((table, index) => {
    if (table.customTableNum === '') {
      table.customTableNum = index + 1;
    }
  });
  tableNumList.value = [...newTableNumList.value];
  tableNum.value = newTableNumList.value.length;
  closeTableDetailModal();
};

const handleClickCancelButton = () => {
  newTableNumList.value = [...tableNumList.value];
  closeTableDetailModal();
};

const handleDropStartTable = (event, index) => {
  event.dataTransfer.setData('text/plain', index);
};

const handleDropTable = (event, dropIndex) => {
  const dragIndex = event.dataTransfer.getData('text/plain');
  const dragItem = newTableNumList.value.splice(dragIndex, 1)[0];
  newTableNumList.value.splice(dropIndex, 0, dragItem);

  const start = Math.min(dragIndex, dropIndex);
  const end = Math.max(dragIndex, dropIndex);

  newTableNumList.value.slice(start, end + 1).forEach((table, index) => {
    table.tableNumIndex = start + index;
  });
};

onMounted(() => {
  setTimeout(() => {
    modalContainer.value?.scrollTo({ top: 0, behavior: 'auto' });
  }, 0);
});

watchEffect(() => {
  newTableNumList.value.forEach((table, index) => {
    table.tableNumIndex = index + 1;
  });
});
</script>

<template>
  <div
    class="w-[730px] h-[910px] flex flex-col justify-start items-center bg-white rounded-2xl overflow-y-auto px-[57px] py-11 gap-[24px]"
  >
    <div class="w-full flex justify-between items-center gap-5 shrink-0 font-semibold text-[30px] text-primary-900 h-9">
      <div class="w-[25px]"></div>
      테이블 커스텀
      <IconClose @click="closeTableDetailModal()" class="cursor-pointer" />
    </div>

    <div class="w-full flex flex-col gap-5">
      <!-- Table Number -->
      <div class="flex flex-col justify-between items-center">
        <div
          class="w-[262px] h-[51px] rounded-2xl flex gap-[10px] justify-center items-center bg-secondary-500 text-lg"
        >
          <div class="text-primary-900 font-bold">현재 테이블 개수</div>
          <div
            class="w-[68px] h-[34px] rounded-2xl border-1 border-secondary-700 text-secondary-500 text-center font-bold bg-white grid place-items-center"
          >
            {{ newTableNumList.length }}
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="w-full flex justify-between font-semibold">
        <div
          @click="handleClickAddTableButton(1)"
          class="w-[184px] rounded-2xl text-primary-900 text-xl border-1 border-primary-900 h-12 flex items-center justify-center gap-2 cursor-pointer hover:bg-primary-800"
        >
          <IconPlus />
          테이블 추가
        </div>
        <div
          @click="handleClickAddTableButton(10)"
          class="w-[234px] rounded-2xl text-primary-900 text-xl border-1 border-primary-900 h-12 flex items-center justify-center gap-2 cursor-pointer hover:bg-primary-800"
        >
          <IconPlus />
          테이블 10개 추가
        </div>
        <div
          @click="handleClickTotalDeleteButton()"
          class="w-[138px] rounded-2xl text-danger text-xl border-1 border-danger h-12 flex items-center justify-center gap-2 cursor-pointer hover:bg-danger-light"
        >
          전체 삭제
        </div>
      </div>
    </div>
    <!-- No Table -->
    <div
      v-if="newTableNumList.length === 0"
      class="h-full flex flex-col justify-center items-center gap-8 text-center text-xl font-medium text-secondary-700-light"
    >
      <IconNotFound />
      현재 테이블이 존재하지 않습니다.<br />테이블 추가 버튼을 통해 테이블을 추가해주세요!
    </div>
    <!-- Table List -->
    <!-- Scroll -->
    <div id="modalContainer" ref="modalContainer" class="grow overflow-y-auto w-full flex flex-col gap-5 px-2">
      <!-- 설명 -->
      <div class="text-secondary-700-light font-medium text-center">
        커스텀 테이블 번호를 입력해주세요. (예시: A-1, 최대 10글자)<br />미 입력 시 테이블 번호가 자동으로 설정됩니다.
      </div>
      <div class="grid grid-cols-2 gap-[18px] place-items-center">
        <div
          class="w-[304px] h-auto flex flex-col gap-3 p-2 border-1 border-transparent rounded-2xl cursor-pointer hover:border-primary-900"
          v-for="(table, tableIndex) in newTableNumList"
          :key="tableIndex"
          :id="'table-' + tableIndex"
          :draggable="true"
          @dragstart="handleDropStartTable($event, tableIndex)"
          @dragover.prevent
          @dragenter.prevent
          @drop="handleDropTable($event, tableIndex)"
        >
          <div class="flex justify-between">
            <div class="text-xl font-medium">테이블 {{ tableIndex + 1 }}</div>
            <div
              class="w-[53px] h-[29px] rounded-5xl bg-danger-light text-danger cursor-pointer grid place-items-center font-medium text-sm"
              @click="handleClickDeleteButton(tableIndex)"
            >
              삭제
            </div>
          </div>
          <input
            type="text"
            :placeholder="tableIndex + 1"
            @input="handleInputCustomTableNum($event, tableIndex)"
            :value="table.customTableNum"
            maxlength="10"
            class="w-full h-[57px] border-1 border-secondary-700 rounded-2xl px-[17px] font-medium focus:border-primary-900 focus:outline-none focus:border-2"
          />
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="w-full flex justify-end items-center text-xl gap-5">
      <button
        class="is-button is-outlined w-[100px] h-[50px] font-semibold"
        type="button"
        @click="handleClickCancelButton()"
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

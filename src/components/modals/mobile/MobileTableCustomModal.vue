<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTableDetail } from '@/stores/booths/tableDetail';
import { useCustomTableModal } from '@/stores/mobiles/customTableModal';
import IconNotFound from '@/components/icons/IconNotFound.vue';

const useTableDetailStore = useTableDetail();

const { tableNumList, tableNum } = storeToRefs(useTableDetailStore);

const { closeMobilePopup } = useCustomTableModal();

const modalContainer = ref(null);
const newTableNumList = ref([...tableNumList.value] || []);

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
  closeMobilePopup();
};

const handleClickCancelButton = () => {
  newTableNumList.value = [...tableNumList.value];
  closeMobilePopup();
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

watch(
  newTableNumList,
  () => {
    newTableNumList.value.forEach((table, index) => {
      table.tableNumIndex = index + 1;
    });
  },
  { deep: true },
);
</script>

<template>
  <div class="w-[390px] min-w-[325px] h-[560px] bg-white rounded-3xl flex flex-col items-center p-6 gap-3 justify-between">
    <div class="flex flex-col items-center gap-3 w-full">
      <div class="flex w-full justify-between items-center">
        <div class="w-3 h-3"></div>
        <div class="font-semibold text-primary-900">테이블 커스텀</div>
        <svg @click="closeMobilePopup()" class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </div>
      <div class="bg-primary-700 p-2.5 flex gap-1 items-center rounded-xl">
        <div class="text-primary-900 text-2xs font-bold">현재 테이블 개수</div>
        <div class="w-9 h-[18px] bg-white rounded-full border-1 text-xs text-secondary-700-light text-center">{{ newTableNumList.length }}</div>
      </div>
      <div class="flex justify-between text-xs w-full">
        <div class="text-primary-900 flex gap-2">
          <button class="px-2 py-1.5 rounded-xl border border-primary-900" @click="handleClickAddTableButton(1)">+ 테이블 추가</button>
          <button class="px-2 py-1.5 rounded-xl border border-primary-900" @click="handleClickAddTableButton(10)">+ 테이블 10개 추가</button>
        </div>
        <button class="px-2 py-1.5 rounded-xl border border-danger text-danger" @click="handleClickTotalDeleteButton()">전체 삭제</button>
      </div>
      <div v-if="newTableNumList.length !== 0" class="text-secondary-700-light text-2xs flex flex-col items-center">
        <div>커스텀 테이블 번호를 입력해주세요. (예시 : A-1, 최대 10글자)</div>
        <div>미 입력 시 테이블 번호가 자동으로 설정됩니다.</div>
      </div>
      <div v-if="newTableNumList.length !== 0" class="w-full max-h-[300px] overflow-y-auto justify-between flex flex-wrap">
        <div
          class="flex flex-col rounded-xl gap-1.5 w-[48%] py-1.5"
          v-for="(table, tableIndex) in newTableNumList"
          :key="tableIndex"
          :id="'table-' + tableIndex"
          :draggable="true"
          @dragstart="handleDropStartTable($event, tableIndex)"
          @dragover.prevent
          @dragenter.prevent
          @drop="handleDropTable($event, tableIndex)"
        >
          <div class="flex justify-between items-center---">
            <div class="text-xs">테이블 {{ tableIndex + 1 }}</div>
            <div
              class="rounded-full bg-danger-light text-danger text-2xs px-2 py-1"
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
            class="border border-secondary-700 rounded-xl py-1.5 px-4 text-2xs"
          />
        </div>
      </div>
      <div v-else class="text-xs flex flex-col items-center h-[342px] justify-center">
        <IconNotFound :width="150" class="py-4"/>
        <div>현재 테이블이 존재하지 않습니다.</div>
        <div>테이블 추가 버튼을 통해 테이블을 추가해주세요!</div>
      </div>
    </div>
    <div class="text-xs font-semibold gap-2.5 flex w-full justify-end">
      <button @click="handleClickCancelButton()" class="px-4 py-1.5 border border-primary-900 rounded-xl text-primary-900">취소</button>
      <button @click="handleClickSaveButton()" class="px-4 py-1.5 border border-primary-900 rounded-xl bg-primary-900 text-white">저장</button>
    </div>
  </div>
</template>

<style lang="css" scoped></style>

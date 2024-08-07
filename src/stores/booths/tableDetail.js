import { defineStore } from 'pinia';
import { useBaseModal } from '../baseModal';

export const useTableDetail = defineStore('tableDetail', () => {
  const baseModalStore = useBaseModal();

  const openTableDetailModal = () => {
    baseModalStore.openModal();
    baseModalStore.setModalType('tableDetail');
  };

  const closeTableDetailModal = () => {
    baseModalStore.closeModal();
  };
  // TODO : USE API DATA
  const TABLE_INFO = [
    { tableNum: 1, customNum: 'A-1' },
    { tableNum: 2, customNum: 'A-2' },
    { tableNum: 3, customNum: 'A-3' },
    { tableNum: 4, customNum: 'A-4' },
    { tableNum: 5, customNum: 'A-5' },
    { tableNum: 6, customNum: 'B-1' },
    { tableNum: 7, customNum: 'B-2' },
    { tableNum: 8, customNum: 'B-3' },
    { tableNum: 9, customNum: 'B-4' },
    { tableNum: 10, customNum: 'C-1' },
    { tableNum: 11, customNum: 'C-2' },
    { tableNum: 12, customNum: 'C-3' },
  ];

  const sumbitTableDetail = () => {
    baseModalStore.closeModal();
    //TODO : API CALL
  };

  return {
    openTableDetailModal,
    closeTableDetailModal,
    TABLE_INFO,
    sumbitTableDetail,
  };
});

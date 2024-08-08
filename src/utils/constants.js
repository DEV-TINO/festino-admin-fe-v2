export const modalInfo = {
  open: {
    false: {
      title: '오픈 활성화',
      subTitle: '오픈 버튼을 활성화하시겠습니까? \n 확인 버튼 선택시, 오픈 기능이 켜집니다.',
    },
    true: {
      title: '오픈 비활성화',
      subTitle: '오픈 버튼을 비활성화하시겠습니까? \n 확인 버튼 선택시, 오픈 기능이 꺼집니다.',
    },
  },
  order: {
    false: {
      title: '주문 활성화',
      subTitle: '주문 버튼을 활성화하시겠습니까? \n 확인 버튼 선택시, 주문 기능이 켜집니다.',
    },
    true: {
      title: '주문 비활성화',
      subTitle: '주문 버튼을 비활성화하시겠습니까? \n 확인 버튼 선택시, 주문 기능이 꺼집니다.',
    },
  },
  reservation: {
    false: {
      title: '예약 활성화',
      subTitle: '예약 버튼을 활성화하시겠습니까? \n 확인 버튼 선택시, 예약 기능이 켜집니다.',
    },
    true: {
      title: '예약 비활성화',
      subTitle: '예약 버튼을 비활성화하시겠습니까? \n 확인 버튼 선택시, 예약 기능이 꺼집니다.',
    },
  },
  error: {
    title: '선택한 옵션은 제공되지 않습니다.',
    subTitle: '선택한 옵션은 사용 할 수 없습니다. \n 다른 기능을 선택해주세요.',
  },
};

export const BOOTH_POPUP_INFO = {
  booth: {
    false: {
      title: '예약 활성화',
      subTitle: '예약 버튼을 활성화하시겠습니까? \n 확인 버튼 선택시, 예약 기능이 켜집니다.',
    },
    true: {
      title: '예약 비활성화',
      subTitle: '예약 버튼을 비활성화하시겠습니까? \n 확인 버튼 선택시, 예약 기능이 꺼집니다.',
    },
  },
  restore: {
    title: '예약 복구 안내',
    subTitle: '예약을 복구하시겠습니까? \n 확인 버튼 선택시, 예약이 복구됩니다.',
  },
  confirm: {
    title: '입장 등록 안내',
    subTitle: '입장을 등록하시겠습니까? \n 확인 버튼 선택시, 입장이 등록됩니다.',
  },
  cancel: {
    title: '예약 취소 안내',
    subTitle: '예약을 취소하시겠습니까? \n 확인 버튼 선택시, 예약이 취소됩니다.',
  },
};

export const ADMIN_CATEGORY = {
  주간부스: 'day',
  야간부스: 'night',
  푸드트럭: 'food',
};

export const MENU_TYPE = {
  MAINMENU: '메인 메뉴',
  SUBMENU: '서브 메뉴',
};

export const RESERVE_TYPE = {
  reserve: '예약',
  cancel: '삭제',
  complete: '완료',
};

export const ORDER_CATEGORY = {
  all: '전체',
  realTime: '실시간',
  ready: '입금 대기',
  cooking: '조리중',
  finish: '조리 완료',
  cancel: '주문 취소',
  statistics: '통계',
};

export const ORDER_STATUS = {
  ready: '주문내역 상세보기',
  cooking: '조리 완료',
  finish: '주문 복구',
  complete: '조리 완료',
  cancel: '주문 취소',
};

export const ORDER_URL = {
  realTime: '',
  ready: 'ready',
  cooking: 'cooking',
  finish: 'finish',
  cancel: 'cancel',
  statistics: 'statistics'
};

export const DATES = {
  11: '수',
  12: '목',
  13: '금',
}
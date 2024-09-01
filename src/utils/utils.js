export const isUUID = (uuid) => {
  const uuidRegex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$');
  return uuidRegex.test(uuid);
};

export const setBackgroundImage = (url) => {
  return {
    backgroundImage: `url(${url})`,
  };
};

export const prettyMenuNum = (menuNum) => {
  if (menuNum === '') return '';
  if (typeof menuNum === 'string') menuNum = parseInt(menuNum);
  return `${menuNum}개`;
};

export const prettyPhoneNumber = (phoneNumber) => {
  return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};

export const prettyPrice = (price) => {
  if (price === '') return '';
  if (typeof price === 'string') price = parseInt(price);
  return price.toLocaleString('ko-KR') + '원';
};

export const prettyDate = (date) => {
  const dateObject = new Date(date);

  // 한국시간 (KST)으로 변환합니다.
  const options = {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  // 변환된 시간을 포맷팅합니다.
  const formatter = new Intl.DateTimeFormat('ko-KR', options);
  const formattedTime = formatter.format(dateObject);

  return formattedTime;
};

export const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, index) => arr.slice(index * size, (index + 1) * size));

export const getHourandMinute = (date) => {
  const dateObject = new Date(date);

  const options = {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return new Intl.DateTimeFormat('ko-KR', options).format(dateObject);
};

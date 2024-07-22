<script setup>
import router from '@/router';
import { useUser } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const { setPassword, setUserId, setIsError, login, logout } = useUser();
const { userId, password, isError } = storeToRefs(useUser());

const isSubmit = ref(false);

const handleInputId = (event) => {
  // 영문자, 숫자, 언더스코어(_), 하이픈(-) 만 허용하고 20자로 제한
  const input = event.target.value;
  const sanitizedInput = input.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20);
  event.target.value = sanitizedInput;
  setUserId(sanitizedInput);
};

const handleInputPassword = (event) => {
  // 공백을 제외한 모든 문자를 허용하고 20자로 제한
  const input = event.target.value;
  const sanitizedInput = input.replace(/\s/g, '').slice(0, 20);
  event.target.value = sanitizedInput;
  setPassword(sanitizedInput);
};

const handleClickSubmit = async () => {
  if (isSubmit.value) return;
  if (!userId.value || !password.value) {
    setIsError(true);
    alert('아이디와 비밀번호를 입력해주세요.');
    return;
  }
  isSubmit.value = true;
  const isSuccess = await login();
  console.log('isSuccess:', isSuccess);
  isSubmit.value = false;
  if (isSuccess) {
    router.push({
      name: 'BoothLists',
    });
    return;
  } else {
    alert('아이디와 비빌번호를 다시 확인해주세요.');
    return;
  }
};

onMounted(() => {
  // logout();
});
</script>

<template>
  <div class="flex flex-col items-center pt-[70px]">
    <div class="flex flex-col w-3/4 items-center">
      <div class="font-bold text-5xl text-primary-900 mb-[100px]">Festino</div>
      <p class="font-semibold text-xl text-primary-900 mb-5">로그인</p>
      <div class="flex flex-col gap-[10px] w-full">
        <input
          class="w-full h-[59px] focus:outline-none rounded-3xl border-2 border-primary-900-light-30 px-5"
          placeholder="아이디"
        />
        <input
          class="w-full h-[59px] focus:outline-none rounded-3xl border-2 border-primary-900-light-30 px-5"
          placeholder="비밀번호"
        />
      </div>
      <p class="h-6 flex items-center text-xs text-secondary-300 underline underline-offset-2 mt-1">
        비밀번호를 잊으셨나요?
      </p>
      <button class="w-full h-[56px] bg-primary-900 text-white font-semibold text-xl rounded-3xl my-14">완료</button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

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
  <div class="flex flex-col justify-center items-center w-full h-full overflow-hidden">
    <!-- Logo -->
    <div class="text-primary-900 text-[60px] font-semibold pb-[75px]">Festino</div>

    <form @submit.prevent="handleClickSubmit()">
      <div class="w-[660px] h-[555px] bg-white flex flex-col justify-between items-center shadow-md rounded-[20px]">
        <div class="text-primary-900 text-[30px] font-semibold pt-[50px]">로그인</div>
        <div class="flex flex-col w-[540px] gap-[20px]">
          <!-- ID -->
          <div class="flex justify-between w-full items-center">
            <div class="text-xl">아이디</div>
            <input
              lang="en"
              autofocus
              autocomplete="username"
              type="text"
              class="w-[390px] h-[64px] focus:border-primary-900 rounded-xl border-[1px] px-[20px]"
              :class="{
                'border-red-700': isError,
              }"
              placeholder="아이디를 입력하세요."
              maxlength="20"
              @input="handleInputId($event)"
            />
          </div>
          <!-- Password -->
          <div class="flex justify-between w-full items-center">
            <div class="text-xl">비밀번호</div>
            <input
              type="password"
              autocomplete="new-password"
              class="w-[390px] h-[64px] focus:border-primary-900 rounded-xl border-[1px] px-[20px]"
              :class="{
                'border-red-700': isError,
              }"
              placeholder="비밀번호를 입력하세요."
              maxlength="20"
              @input="handleInputPassword($event)"
            />
          </div>
        </div>
        <!-- Submit Button -->
        <div class="flex flex-col justify-center items-center w-[540px] gap-[30px] pb-[50px]">
          <button class="text-2xl is-button w-full h-[77px] flex items-center justify-center" type="submit">
            완료
          </button>
          <div class="text-lg text-secondary-900 underline cursor-pointer" @click="logout()">로그인이 안돼시나요?</div>
        </div>
      </div>
    </form>
    <!-- Login Box -->

    <!-- Banner -->
    <div class="w-[600px] h-[150px] bg-gray-200 mt-[50px] mb-[75px] flex items-center justify-center">
      불쌍한 개발자에게 커피를 사주세요... 스타벅스로 ><
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

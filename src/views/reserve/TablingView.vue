<script setup>
import { useUser } from '@/stores/user';
import { storeToRefs } from 'pinia';

const useUserStore = useUser();
const { isAdmin, userOwnBoothId } = storeToRefs(useUserStore);
</script>
<template>
  <div>
    <div class="relative overflow-x-auto rounded-xl">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-primary-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-center">예약 번호</th>
            <th scope="col" class="px-6 py-3 text-center">예약자</th>
            <th scope="col" class="px-6 py-3 text-center">인원수</th>
            <th scope="col" class="px-6 py-3 text-center">연락처</th>
            <th scope="col" class="px-6 py-3 text-center">예약 시간</th>
            <th scope="col" colspan="2" class="px-6 py-3 text-center">예약 관리</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">1</th>
            <td class="px-6 py-4 text-center">White</td>
            <td class="px-6 py-4 text-center">Laptop PC</td>
            <td class="px-6 py-4 text-center">$1999</td>
            <td class="px-6 py-4 text-center">$1999</td>
            <td class="py-4">
              <div class="w-full flex justify-center">
                <button class="is-button w-14 text-base">123</button>
              </div>
            </td>
            <td class="py-4">
              <div class="w-full flex justify-center">
                <button class="is-button w-14 text-base is-outlined">123</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

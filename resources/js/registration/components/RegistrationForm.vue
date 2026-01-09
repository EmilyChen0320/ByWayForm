<template>
  <div class="relative mx-auto my-0 w-[375px] max-md:w-full max-md:max-w-screen-md max-sm:w-full bg-white flex flex-col" style="min-height: 100dvh; padding-top: env(safe-area-inset-top, 0px);">
    <!-- 海報圖片 -->
    <div class="w-full">
      <img 
        :src="posterImage" 
        alt="百味人生" 
        class="w-full h-auto"
      />
    </div>

    <!-- 表單區域 -->
    <div class="flex-1 px-5 bg-white" style="padding-top: 1.5rem; padding-bottom: max(1.5rem, env(safe-area-inset-bottom, 0px) + 1rem);">
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- 姓名欄位 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2">
            真實姓名 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            :class="[
              'w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400',
              errors.name ? 'border-red-500' : 'border-gray-300 focus:border-gray-400'
            ]"
            placeholder="請填寫您的完整真實姓名"
            @blur="validateName"
            @input="errors.name = ''"
          />
          <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
        </div>

        <!-- 手機號碼 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2">
            手機號碼 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.phone"
            type="tel"
            required
            pattern="[0-9]{10}"
            :class="[
              'w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400',
              errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-gray-400'
            ]"
            placeholder="請輸入手機號碼"
            @blur="validatePhone"
            @input="errors.phone = ''"
          />
          <p v-if="errors.phone" class="text-xs text-red-500 mt-1">{{ errors.phone }}</p>
        </div>

        <!-- E-mail -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2">
            E-mail
          </label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gray-400 bg-white text-gray-900 placeholder-gray-400"
            placeholder="請填寫常用的電子郵件地址"
          />
        </div>

        <!-- 活動資訊來源 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-2">
            活動資訊來源
          </label>
          <div class="relative">
            <select
              v-model="form.source"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gray-400 bg-white text-gray-900 appearance-none"
            >
              <option value="" disabled>請選擇</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="threads">Threads</option>
              <option value="fanpokka">Fanpokka粉絲通行證</option>
              <option value="friend">朋友告知</option>
              <option value="other">其他</option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- 警告訊息 -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center">
          <img :src="warnImage" alt="警告" class="w-5 h-5 mr-2 flex-shrink-0" />
          <p class="text-xs text-yellow-800">
            資料送出後將無法修改，請務必確認填寫內容正確。
          </p>
        </div>

        <!-- 提交按鈕 -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="isSubmitting"
            :class="[
              'w-full py-4 text-white text-lg font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed',
              isFormValid ? 'hover:scale-[1.02]' : ''
            ]"
            :style="isFormValid 
              ? 'background: linear-gradient(135deg, #FFDB4C 0%, #FFB800 100%);' 
              : 'background: #9CA3AF;'"
          >
            <span v-if="isSubmitting">提交中...</span>
            <span v-else>提交</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import posterImg from '@assets/images/MainImage.png'
import warnImg from '@assets/images/warn.png'

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'back'])

const posterImage = ref(posterImg)
const warnImage = ref(warnImg)

const form = ref({
  name: '',
  email: '',
  phone: '',
  source: ''
})

const errors = ref({
  name: '',
  phone: ''
})

const isSubmitting = ref(false)

// 檢查必填欄位是否完整填寫
const isFormValid = computed(() => {
  const phonePattern = /^[0-9]{10}$/
  return form.value.name.trim() !== '' && 
         form.value.phone !== '' && 
         phonePattern.test(form.value.phone)
})

// 自動填入用戶名稱
onMounted(() => {
  if (props.userName) {
    form.value.name = props.userName
  }
})

function validateName() {
  if (!form.value.name.trim()) {
    errors.value.name = '請填寫姓名'
    return false
  }
  errors.value.name = ''
  return true
}

function validatePhone() {
  const phonePattern = /^[0-9]{10}$/
  if (!form.value.phone) {
    errors.value.phone = '請填寫手機號碼'
    return false
  }
  if (!phonePattern.test(form.value.phone)) {
    errors.value.phone = '請填寫正確的手機號碼格式（10位數字）'
    return false
  }
  errors.value.phone = ''
  return true
}

function handleSubmit() {
  // 驗證必填欄位
  const isNameValid = validateName()
  const isPhoneValid = validatePhone()
  
  if (!isNameValid || !isPhoneValid) {
    return
  }
  
  emit('submit', form.value)
}

function handleBack() {
  emit('back')
}
</script>

<style scoped>
/* 移除 select 的預設樣式 */
select {
  background-image: none;
}

/* 確保輸入框在 iOS 上的樣式一致 */
input, select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>

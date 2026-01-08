<template>
  <div class="mobile-container bg-white" style="padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px);">
    <div class="content-area py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">確認報名資料</h1>
        <p class="text-gray-600 mt-2">請確認以下資料是否正確</p>
      </div>

      <!-- 資料確認 -->
      <div class="bg-gray-50 rounded-xl p-6 mb-8 space-y-4">
        <div class="border-b border-gray-200 pb-3">
          <p class="text-sm text-gray-500">姓名</p>
          <p class="text-lg font-semibold text-gray-900">{{ formData.name }}</p>
        </div>
        
        <div class="border-b border-gray-200 pb-3">
          <p class="text-sm text-gray-500">Email</p>
          <p class="text-lg font-semibold text-gray-900">{{ formData.email }}</p>
        </div>
        
        <div>
          <p class="text-sm text-gray-500">電話</p>
          <p class="text-lg font-semibold text-gray-900">{{ formData.phone }}</p>
        </div>
      </div>

      <!-- 按鈕組 -->
      <div class="space-y-3">
        <button
          @click="handleConfirm"
          :disabled="isSubmitting"
          class="w-full py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">提交中...</span>
          <span v-else>確認送出</span>
        </button>
        
        <button
          @click="handleBack"
          :disabled="isSubmitting"
          class="w-full py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          返回修改
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['confirm', 'back'])

const isSubmitting = ref(false)

async function handleConfirm() {
  isSubmitting.value = true
  try {
    await emit('confirm')
  } finally {
    isSubmitting.value = false
  }
}

function handleBack() {
  emit('back')
}
</script>

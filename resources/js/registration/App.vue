<template>
  <div class="app min-h-screen">
    <!-- 載入中 -->
    <div v-if="currentStep === 'loading'" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-gray-600">載入中...</p>
      </div>
    </div>

    <!-- 歡迎頁面 -->
    <WelcomePage
      v-if="currentStep === 'welcome'"
      @start="goToForm"
    />

    <!-- 報名表單 -->
    <RegistrationForm
      v-if="currentStep === 'form'"
      :userId="userId"
      :userName="userName"
      @submit-result="handleFormSubmit"
      @back="goToWelcome"
    />

    <!-- 成功頁面 -->
    <RegistrationSuccess
      v-if="currentStep === 'success'"
      :registration="registration"
      :userName="userName"
      :isFull="isFull"
      @close="handleClose"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import WelcomePage from './components/WelcomePage.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import RegistrationSuccess from './components/RegistrationSuccess.vue'
import { liffService } from '../services/liffService.js'
import { registrationService } from '../services/registrationService.js'

const userId = ref('')
const userName = ref('') // 用戶名稱
const currentStep = ref('loading') // loading -> 由 checkInitialStatus 決定顯示哪個頁面
const formData = ref({})
const registration = ref(null) // 報名資料
const isFull = ref(false) // 是否額滿

// LIFF 初始化
async function initializeLiff() {
  try {
    const result = await liffService.initializeLiff()
    
    if (result.success && result.isLoggedIn && result.userId) {
      userId.value = result.userId
      
      // 獲取用戶名稱
      const profile = await liffService.getUserProfile()
      if (profile && profile.displayName) {
        userName.value = profile.displayName
      }
    } else {
      // 使用測試 ID
      const testUserId = window.endpoint?.testUserId || 'test_user_' + Date.now()
      userId.value = testUserId
      userName.value = '測試用戶'
    }
  } catch (error) {
    console.error('❌ LIFF 初始化失敗:', error)
    userId.value = 'test_user_' + Date.now()
    userName.value = '測試用戶'
  }
}

// 檢查初始報名狀態
async function checkInitialStatus() {
  const urlParams = new URLSearchParams(window.location.search)
  const testParam = urlParams.get('test')
  const skipCheck = urlParams.get('skipCheck') === 'true'
  
  // 1. 測試模式：URL 參數測試（優先級最高，方便測試）
  if (testParam === 'full' || testParam === 'expired') {
    console.log('🧪 測試模式：模擬', testParam === 'expired' ? '過期' : '額滿', '狀態')
    isFull.value = true
    currentStep.value = 'success'
    return
  }
  
  if (testParam === 'available') {
    console.log('🧪 測試模式：模擬可報名狀態')
    currentStep.value = 'welcome'
    return
  }
  
  // 舊的測試參數兼容（跳過檢查，直接顯示歡迎頁）
  if (skipCheck) {
    console.log('🧪 測試模式：跳過狀態檢查，直接顯示歡迎頁')
    currentStep.value = 'welcome'
    return
  }
  
  // 2. 檢查截止日期（2026年2月3日 23:59 台灣時間 UTC+8）
  const deadline = new Date('2026-02-03T23:59:59+08:00')
  const now = new Date()
  
  if (now > deadline) {
    console.log('⏰ 已超過截止日期（2026/2/3 23:59），顯示額滿畫面')
    isFull.value = true
    currentStep.value = 'success'
    return
  }
  
  // 3. 沒過期，檢查 userId
  if (!userId.value) {
    console.warn('⚠️ 沒有 userId，跳過狀態檢查')
    currentStep.value = 'welcome'
    return
  }
  
  // 4. 調用 API 檢查狀態
  try {
    const result = await registrationService.checkRegistrationStatus(userId.value)
    
    const status = (result.result?.status || result.status || '').toLowerCase()
    const userData = result.result?.data || result.data || null
    
    if (status === 'registered') {
      // 已報名：顯示成功頁面
      registration.value = userData
      userName.value = userData?.name || userName.value
      isFull.value = false
      currentStep.value = 'success'
    } else if (status === 'full') {
      // 額滿：顯示額滿頁面
      isFull.value = true
      currentStep.value = 'success'
    } else if (status === 'available') {
      // 可報名：顯示歡迎頁
      currentStep.value = 'welcome'
    } else {
      // 錯誤或未知狀態：預設顯示歡迎頁
      console.warn('⚠️ 未知狀態:', status, '，預設顯示歡迎頁')
      console.warn('⚠️ 完整回應結構:', result)
      currentStep.value = 'welcome'
    }
  } catch (error) {
    console.error('❌ 檢查狀態失敗:', error)
    // 發生錯誤時，預設顯示歡迎頁
    currentStep.value = 'welcome'
  }
}

// 頁面導航
function goToWelcome() {
  currentStep.value = 'welcome'
  formData.value = {}
  registration.value = null
  isFull.value = false
}

function goToForm() {
  currentStep.value = 'form'
}

async function handleFormSubmit(result) {
  // formData.value = data // data 不再傳入，如果需要保存 formData，可以在 result 中回傳或是由 RegistrationForm 傳入更多參數，但這裡主要用來顯示結果
  // 由於 RegistrationForm 已經處理了提交，這裡只需要處理結果
  
  try {
    // 根據 registrationService.js 的返回格式：
    // 成功：{ success: true, status, data, message }
    // 失敗：{ success: false, status: 'error', error: { message } }
    
    // 提取用戶資料：直接從 result.data 讀取（不是 result.result.data）
    const userData = result.data || null
    
    // 提取狀態值：統一轉換為小寫進行比較
    const status = (result.status || '').toLowerCase()
    
    // 根據回應狀態處理
    if (result.success || status === 'success' || status === 'registered') {
      // 報名成功
      registration.value = userData
      // 優先使用表單提交的 name（最可靠），其次使用 API 返回的 name，最後使用已獲取的 userName
      userName.value = result.formData?.name || userData?.name || userName.value
      isFull.value = false
      currentStep.value = 'success'
    } else if (status === 'full') {
      // 提交時才發現額滿
      isFull.value = true
      currentStep.value = 'success'
    } else {
      // 其他錯誤
      const errorMsg = result.message || result.error?.message || '未知錯誤'
      console.error('❌ 報名失敗，錯誤訊息:', errorMsg)
      alert('報名失敗：' + errorMsg)
    }
  } catch (error) {
    console.error('❌ 處理報名結果失敗:', error)
    alert('報名失敗，請稍後再試')
  }
}

function handleClose() {
  // 檢查是否在 LIFF 環境中
  const isInLiff = typeof liff !== 'undefined' && liff.isInClient()
  
  // 如果在 PC 版且已報名成功，保持在成功頁面
  if (!isInLiff && registration.value) {
    // 保持在成功頁面，不執行任何操作
    return
  }
  
  // 其他情況：回到歡迎頁面
  goToWelcome()
}

// 在掛載前初始化 LIFF 並檢查狀態
onBeforeMount(async () => {
  await initializeLiff()
  await checkInitialStatus()
})
</script>

<style scoped>
.app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif, 'Noto Sans TC';
  overflow-x: hidden;
  background-color: #f5f5f5;
}
</style>

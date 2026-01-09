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
      @submit="handleFormSubmit"
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
  if (!userId.value) {
    console.warn('⚠️ 沒有 userId，跳過狀態檢查')
    return
  }
  
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

async function handleFormSubmit(data) {
  formData.value = data
  
  try {
    // 提交報名
    const result = await registrationService.submitRegistration({
      user_id: userId.value,
      ...formData.value
    })
    
    // 提取用戶資料：優先從 result.result.data 讀取，如果不存在則從 result.data 讀取
    const userData = result.result?.data || result.data || null
    
    // 提取狀態值：統一轉換為小寫進行比較
    const status = (result.result?.status || result.status || '').toLowerCase()
    
    // 根據回應狀態處理
    if (result.success || status === 'success' || status === 'registered') {
      // 報名成功
      registration.value = userData
      // 正確提取用戶名稱：優先從 userData.name，其次 formData.name，最後使用已獲取的 userName.value
      userName.value = userData?.name || data.name || userName.value
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
    console.error('❌ 報名失敗:', error)
    alert('報名失敗，請稍後再試')
  }
}

function handleClose() {
  // 關閉或返回首頁
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

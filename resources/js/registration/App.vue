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
    console.log('🔧 開始初始化 LIFF...')
    
    const result = await liffService.initializeLiff()
    
    if (result.success && result.isLoggedIn && result.userId) {
      userId.value = result.userId
      console.log('✅ LIFF 用戶 ID 已設置:', userId.value)
      
      // 獲取用戶名稱
      const profile = await liffService.getUserProfile()
      if (profile && profile.displayName) {
        userName.value = profile.displayName
        console.log('✅ 用戶名稱已獲取:', userName.value)
      }
    } else {
      // 使用測試 ID
      const testUserId = window.endpoint?.testUserId || 'test_user_' + Date.now()
      userId.value = testUserId
      userName.value = '測試用戶'
      console.log('⚠️ 使用測試用戶 ID:', userId.value)
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
    console.log('🔍 檢查報名狀態...')
    
    const result = await registrationService.checkRegistrationStatus(userId.value)
    
    if (result.status === 'registered') {
      // 已報名：顯示成功頁面
      console.log('✅ 用戶已報名')
      registration.value = result.data
      userName.value = result.data.name || userName.value
      isFull.value = false
      currentStep.value = 'success'
    } else if (result.status === 'full') {
      // 額滿：顯示額滿頁面
      console.log('⚠️ 活動額滿')
      isFull.value = true
      currentStep.value = 'success'
    } else if (result.status === 'available') {
      // 可報名：顯示歡迎頁
      console.log('✅ 可以報名')
      currentStep.value = 'welcome'
    } else {
      // 錯誤或未知狀態：預設顯示歡迎頁
      console.warn('⚠️ 未知狀態，顯示歡迎頁')
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
    console.log('📤 準備提交報名...')
    
    // 提交報名
    const result = await registrationService.submitRegistration({
      user_id: userId.value,
      ...formData.value
    })
    
    console.log('📥 收到回應:', result)
    
    // 根據回應狀態處理
    if (result.success || result.status === 'success' || result.status === 'registered') {
      // 報名成功
      registration.value = result.data
      userName.value = data.name || userName.value
      isFull.value = false
      currentStep.value = 'success'
    } else if (result.status === 'full') {
      // 提交時才發現額滿
      console.log('⚠️ 活動已額滿')
      isFull.value = true
      currentStep.value = 'success'
    } else {
      // 其他錯誤
      const errorMsg = result.message || result.error?.message || '未知錯誤'
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

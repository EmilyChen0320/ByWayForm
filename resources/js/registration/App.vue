<template>
  <div class="app min-h-screen">
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
const userName = ref('') // 用戶名稱，測試時使用預設值
const currentStep = ref('welcome') //welcome, form, success
const formData = ref({})
const registration = ref({ name: '' }) // 模擬報名資料
const isFull = ref(true) //true: 額滿, false: 報名成功

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
    
    if (result.success) {
      registration.value = result.data
      // 更新 userName 為表單填寫的名字
      userName.value = data.name || userName.value
      // 可以根據後端回傳判斷是否額滿
      // isFull.value = result.data.is_full || false
      isFull.value = false // 預設顯示報名成功
      currentStep.value = 'success'
    } else {
      // 如果是額滿的情況
      if (result.error?.code === 'FULL') {
        isFull.value = true
        currentStep.value = 'success'
      } else {
        alert('報名失敗：' + (result.error?.message || '未知錯誤'))
      }
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

// 在掛載前初始化 LIFF
onBeforeMount(async () => {
  await initializeLiff()
})
</script>

<style scoped>
.app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif, 'Noto Sans TC';
  overflow-x: hidden;
  background-color: #f5f5f5;
}
</style>

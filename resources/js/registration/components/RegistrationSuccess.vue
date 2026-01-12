<template>
  <div 
    class="relative mx-auto my-0 w-[375px] max-md:w-full max-md:max-w-screen-md max-sm:w-full overflow-hidden flex flex-col"
    :style="{ 
      minHeight: '100dvh',
      backgroundImage: `url(${backgroundImage})`, 
      backgroundSize: '100% 100%', 
      backgroundPosition: 'center center', 
      backgroundRepeat: 'no-repeat'
    }"
  >
    <!-- 頂部標題 -->
    <div class="relative z-10 pb-8 px-6" style="padding-top: max(3rem, env(safe-area-inset-top, 0px) + 1rem);">
      <img 
        :src="headerImage" 
        alt="三立八點台劇《百味人生》粉絲見面會" 
        class="w-full max-w-[360px] mx-auto"
      />
    </div>

    <!-- 主要內容卡片 -->
    <div class="relative z-10 px-4 pb-8">
      <!-- 白色卡片容器（和歡迎頁一樣的結構） -->
      <div class="bg-white rounded-xl shadow-2xl overflow-hidden max-w-[360px] mx-auto p-2">
        <!-- 海報圖片 + 遮罩 -->
        <div class="relative rounded-xl overflow-hidden" 
             :style="{ 
               backgroundImage: `url(${posterImage})`, 
               backgroundSize: 'cover', 
               backgroundPosition: 'center' 
             }">
          
          <!-- 半透明黑色遮罩 + 文字內容 -->
          <div class="bg-black bg-opacity-75 flex items-center justify-center py-8 px-6">
            <!-- 報名成功內容 -->
            <div v-if="!isFull" class="text-white text-center">
              <h2 class="text-sm font-bold mb-2">{{ userName }}，您好</h2>
              <p class="text-sm leading-relaxed mb-4">
                您已成功報名《百味人生》<br>
                粉絲見面會早鳥好康活動！
              </p>
              <div class="text-sm leading-relaxed">
                <p class="font-semibold text-base"><span style="color: #FFF001; text-underline-offset: 3px;">《限量好禮兌換方式》</span></p>
                <div class="inline-block text-left">
                  <p class="mb-1">
                    1. 粉絲見面會前將發送粉絲活動通行證給您
                  </p>
                  <p class="font-semibold">
                    2. 請於<span style="color: #FFF001; text-decoration: underline wavy; text-underline-offset: 3px;">活動當天11:00~16:00於【早鳥好康活動兌換處】</span><span style="color: #FFF001; text-decoration: underline wavy; text-underline-offset: 3px;">出示官方LINE內通行證即可兌換限量好禮</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- 額滿內容 -->
            <div v-else class="text-white text-center">
              <h2 class="text-xl font-bold mb-4">早鳥好康活動名額 已額滿</h2>

              <div class="text-sm leading-relaxed">
                <p class="font-bold">
                    當天仍歡迎您至《百味人生》粉絲見面會
                  </p>
                  <p class="font-bold">
                  現場與演員同樂<br>
                  更多好康抽獎活動<br>
                  請上三立台劇官方粉絲專頁查詢<br>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 活動資訊 -->
        <div class="pt-4 pb-2">
          <div class="text-sm font-bold text-gray-900 space-y-1">
            <p>活動時間：2026/2/7(六) 13:30</p>
            <p>
              活動地點：
              <a 
                href="https://www.google.com/maps/search/?api=1&query=台北市迪化街大稻埕戲苑前廣場"
                target="_blank"
                class="text-blue-600 underline hover:text-blue-800 transition-colors font-bold"
              >
                📍 台北市迪化街大稻埕戲苑前廣場
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 關閉按鈕 -->
    <div class="relative z-10 px-4" style="padding-bottom: max(3rem, env(safe-area-inset-bottom, 0px) + 1rem);">
      <button
        @click="handleClose"
        class="w-full max-w-[360px] mx-auto block py-5 text-white text-xl font-bold rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);"
      >
        關閉
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import backgroundImg from '@assets/images/background.png'
import headerImg from '@assets/images/header.png'
import posterImg from '@assets/images/MainImage.png'

const props = defineProps({
  registration: {
    type: Object,
    default: null
  },
  userName: {
    type: String,
    default: '王大美'
  },
  isFull: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const backgroundImage = ref(backgroundImg)
const headerImage = ref(headerImg)
const posterImage = ref(posterImg)

function handleClose() {
  // LIFF 環境：關閉 LIFF 視窗
  if (typeof liff !== 'undefined' && liff.isInClient()) {
    liff.closeWindow()
    return
  }
  
  // PC 版：嘗試關閉視窗
  // window.close() 只有在視窗是由 JavaScript 打開時才能關閉
  // 如果視窗是用戶直接打開的，window.close() 不會工作（瀏覽器安全限制）
  
  // 如果已報名成功，嘗試關閉視窗；如果無法關閉，保持在成功頁面
  if (props.registration || props.isFull) {
    // 檢查視窗是否可以關閉
    // window.opener 存在表示視窗是由 JavaScript 打開的
    if (window.opener) {
      try {
        window.close()
        // 如果關閉成功，視窗會關閉，不會執行後續代碼
        return
      } catch (error) {
        // 關閉失敗，保持在成功頁面
        alert('報名已完成！您可以手動關閉此視窗。')
        return
      }
    } else {
      // 視窗不是由 JavaScript 打開的，無法關閉
      // 保持在成功頁面，不 emit('close')
      alert('報名已完成！您可以手動關閉此視窗。')
      return
    }
  }
  
  // 只有在未報名成功的情況下（例如其他情況），才 emit('close')
  emit('close')
}
</script>

<style scoped>
/* 確保在手機上正確顯示 */
@media (max-width: 375px) {
  .max-w-\[340px\] {
    max-width: calc(100vw - 3rem);
  }
}
</style>

<template>
  <div 
    class="relative mx-auto my-0 w-[375px] max-md:w-full max-md:max-w-screen-md max-sm:w-full overflow-hidden"
    :style="{ 
      minHeight: '100dvh',
      backgroundImage: `url(${backgroundImage})`, 
      backgroundSize: '100% 100%', 
      backgroundPosition: 'center center', 
      backgroundRepeat: 'no-repeat'
    }"
  >
    <!-- 頂部標題 -->
    <div class="relative z-10 pb-12 px-4" style="padding-top: max(3rem, env(safe-area-inset-top, 0px) + 1rem);">
      <img 
        :src="headerImage" 
        alt="三立八點台劇《百味人生》粉絲見面會" 
        class="w-full max-w-[360px] mx-auto"
      />
    </div>

    <!-- 主要內容卡片 -->
    <div class="relative z-10 px-4 pb-12">
      <!-- 白色卡片容器（有明顯邊框） -->
      <div class="relative bg-white rounded-xl shadow-2xl overflow-visible max-w-[360px] mx-auto p-2">
        <!-- 粉絲集合啦標籤 -->
        <div class="absolute -top-5 -right-2 bg-black text-white px-4 py-1 text-sm font-bold z-20"
             style="clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%); transform: rotate(-3deg);">
          # 粉絲集合啦！！
        </div>
        
        <!-- 海報圖片 -->
        <div class="relative rounded-xl overflow-hidden">
          <img 
            :src="posterImage" 
            alt="百味人生活動海報" 
            class="w-full h-auto block"
          />
        </div>

        <!-- 活動資訊 -->
        <div class="pt-4 pb-2 text-center">
          <h2 class="text-lg font-bold text-gray-900 mb-2">
            一起來見面、聊天、拿好禮 <span class="text-red-500">❤️</span>
          </h2>
          <div class="text-base font-semibold text-gray-900 text-left inline-block">
            <p>時間：2026/2/7 (六) 13:30</p>
            <p>地點：台北市迪化街永樂廣場</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 立即報名按鈕 -->
    <div class="relative z-10 px-4" style="padding-bottom: max(3rem, env(safe-area-inset-bottom, 0px) + 1rem);">
      <button
        @click="handleStart"
        class="relative w-full max-w-[360px] mx-auto flex items-center justify-center py-5 text-white text-xl font-bold rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        style="background: linear-gradient(135deg, #FFDB4C 0%, #FFB800 100%);"
      >
        <span class="flex items-center gap-2">
          <span>立即報名</span>
          <img :src="shineImage" alt="✨" class="w-6 h-6" />
        </span>
        <!-- 點擊手指圖示 -->
        <img 
          :src="clickImage" 
          alt="點擊" 
          class="absolute pointer-events-none"
          style="transform: rotate(-15deg); width: 140px; height: 140px; right: -24px; bottom: -95px;"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['start'])

// 圖片路徑
const backgroundImage = ref('/images/background.png')
const headerImage = ref('/images/header.png')
const posterImage = ref('/images/MainImage.png')
const clickImage = ref('/images/click.png')
const shineImage = ref('/images/shine.png')

function handleStart() {
  emit('start')
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

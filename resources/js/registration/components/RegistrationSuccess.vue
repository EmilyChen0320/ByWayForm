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
          <div class="bg-black bg-opacity-75 flex items-center justify-center py-5 px-6">
            <!-- 報名成功內容 -->
            <div v-if="!isFull" class="text-white text-center">
              <h2 class="text-base font-bold mb-2">{{ userName }}，您好</h2>
              <p class="text-base leading-relaxed mb-4">
                您已成功報名《百味人生》<br>
                粉絲見面會早鳥好禮活動！
              </p>
              <div class="text-base leading-relaxed">
                <p class="">
                  我們將於粉絲見面會前<br>
                  發送粉絲活動通行證給您
                </p>
                <p class="font-semibold">
                  <span style="color: #FFF001; text-decoration: underline wavy;">活動當天出示官方LINE內通行證</span><br>
                  <span style="color: #FFF001; text-decoration: underline wavy;">即可兌換限量好禮，</span><span class="text-white">期待與您現場相見！</span>
                </p>
              </div>
            </div>

            <!-- 額滿內容 -->
            <div v-else class="text-white text-center">
              <h2 class="text-xl font-bold">感謝您的熱情參與，</h2>
              <p class="text-xl font-bold mb-4">
                早鳥好康活動名額 已額滿/截止
              </p>
              <div class="text-sm leading-relaxed">
                <p class="">
                  誠摯邀請您於活動當天蒞臨<br>
                  《百味人生》粉絲見面會，
                </p>
                <p class="">
                  現場加入 Fanpokka 粉絲通行證<br>
                  官方 LINE，也能獲得小禮物唷！
                </p>
                <p class="text-gray-300 text-xs">
                  （數量有限，送完為止）
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 活動資訊 -->
        <div class="pt-4 pb-2 text-center">
          <div class="text-lg font-bold text-gray-900 space-y-1">
            <p>時間：2026/2/7 (六) 13:30</p>
            <p>地點：台北市迪化街永樂廣場</p>
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

const backgroundImage = ref('/resources/assets/images/background.png')
const headerImage = ref('/resources/assets/images/header.png')
const posterImage = ref('/resources/assets/images/MainImage.png')

function handleClose() {
  // 可以關閉 LIFF 視窗
  if (typeof liff !== 'undefined' && liff.isInClient()) {
    liff.closeWindow()
  } else {
    emit('close')
  }
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

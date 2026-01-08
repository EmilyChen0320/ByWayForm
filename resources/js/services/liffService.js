/**
 * LIFF 服務模組
 * 處理 LINE LIFF 相關的操作
 */

import { API_CONFIG } from '../config/config.js'

class LiffService {
  constructor() {
    this.isInitialized = false
    this.userId = null
    this.userProfile = null
    this.liffId = null
    this.basicId = null
  }

  /**
   * 完整的 LIFF 初始化流程（包含登入驗證）
   * @param {Object} options - 配置選項
   * @param {string} options.userId - 用戶 ID 響應式變數
   * @returns {Promise<Object>} 初始化結果
   */
  async initializeLiff(options = {}) {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '0.0.0.0'
    
    if (isLocalhost && window.endpoint?.enableLiff) {
      window.endpoint.enableLiff = false
    }
    
    if (!window.endpoint?.enableLiff || isLocalhost) {
      const testUserId = window.endpoint?.testUserId
      let userIdToUse
      
      if (testUserId && testUserId.trim() !== '') {
        userIdToUse = testUserId.trim()
      } else {
        userIdToUse = 'dev_user_' + Date.now()
      }
      
      // 設置用戶 ID
      this.userId = userIdToUse
      this.isInitialized = true
      
      if (options.userId) {
        options.userId.value = userIdToUse
      }
      
      console.log('🔧 開發模式：使用測試用戶 ID:', userIdToUse)
      
      return {
        success: true,
        isLoggedIn: true,
        isFriend: true,
        userId: userIdToUse,
        message: testUserId ? 'LIFF 功能已關閉，使用配置的測試用戶 ID' : 'LIFF 功能已關閉，使用模擬用戶'
      }
    }
    
    // 優先從 window.endpoint 獲取 LIFF ID 和 Basic ID
    let liffId = window.endpoint?.liffId
    let basicId = window.endpoint?.basicId
    
    // 備用方案：從全域變數獲取
    if (!liffId) liffId = window.LIFF_ID
    if (!basicId) basicId = window.LINE_BASIC_ID
    
    if (!liffId) {
      liffId = API_CONFIG.liff?.liffId || 'YOUR_LIFF_ID'
    }

    // 保存到實例變數
    this.liffId = liffId
    this.basicId = basicId

    try {
      // 初始化 LIFF
      await liff.init({ liffId })
      
      if (!liff.isLoggedIn()) {
        const isInClient = liff.isInClient()
        
        if (isInClient) {
          const redirectUrl = window.location.origin + window.location.pathname
          liff.login({ redirectUri: redirectUrl })
          return {
            success: false,
            isLoggedIn: false,
            message: '用戶未登入，已重定向至登入頁面'
          }
        } else {
          const redirectUrl = window.location.origin + window.location.pathname
          liff.login({ redirectUri: redirectUrl })
          
          return {
            success: false,
            isLoggedIn: false,
            isFriend: false,
            userId: null,
            message: '在瀏覽器中嘗試 LINE 登入，已跳轉到登入頁面'
          }
        }
      }
      
      // 獲取用戶 ID
      const context = liff.getContext()
      const decodedToken = liff.getDecodedIDToken()
      window.uid = context.userId || decodedToken.sub
      
      if (options.userId) {
        options.userId.value = window.uid
      }
      
      this.userId = window.uid
      
      const friendship = await liff.getFriendship()
      if (!friendship.friendFlag) {
        return {
          success: true,
          isLoggedIn: true,
          isFriend: false,
          userId: this.userId,
          message: '用戶已登入但未加入好友'
        }
      }
      
      this.isInitialized = true
      
      return {
        success: true,
        isLoggedIn: true,
        isFriend: true,
        userId: this.userId,
        message: 'LIFF 初始化成功'
      }
      
    } catch (error) {
      console.error('❌ LIFF 初始化失敗:', error)
      return {
        success: false,
        error: error.message,
        message: 'LIFF 初始化失敗'
      }
    }
  }

  /**
   * 獲取用戶資料
   * @returns {Promise<Object|null>} 用戶資料或 null
   */
  async getUserProfile() {
    try {
      if (!this.isInitialized) {
        return null
      }

      if (typeof liff === 'undefined' || !liff.isLoggedIn()) {
        return null
      }

      const profile = await liff.getProfile()
      this.userProfile = profile
      this.userId = profile.userId
      
      return profile
    } catch (error) {
      console.error('❌ 獲取用戶資料失敗:', error)
      return null
    }
  }

  /**
   * 獲取用戶 ID
   * @returns {string|null} 用戶 ID 或 null
   */
  getUserId() {
    return this.userId
  }

  /**
   * 檢查是否在 LINE 應用內
   * @returns {boolean} 是否在 LINE 應用內
   */
  isInClient() {
    if (!this.isInitialized || typeof liff === 'undefined') {
      return false
    }
    return liff.isInClient()
  }

  /**
   * 獲取當前 LIFF 狀態
   * @returns {Object} LIFF 狀態
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      userId: this.userId,
      userProfile: this.userProfile
    }
  }
}

// 創建單例實例
export const liffService = new LiffService()
export default liffService

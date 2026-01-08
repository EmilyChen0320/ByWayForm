/**
 * 報名 API 服務
 * 目前使用 Mock 模式，不串接真實 API
 */

const USE_MOCK = true; // 切換為 false 時連接真實 API

/**
 * 模擬 API 延遲
 */
const mockDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock 報名資料
 */
const mockRegistrations = [];

export const registrationService = {
  /**
   * 提交報名表單
   * @param {Object} formData - 表單資料
   * @returns {Promise<Object>} 報名結果
   */
  async submitRegistration(formData) {
    if (USE_MOCK) {
      await mockDelay();
      
      // 模擬報名成功
      const registration = {
        id: 'REG' + Date.now(),
        ...formData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      mockRegistrations.push(registration);
      
      console.log('✅ Mock 報名成功:', registration);
      
      return {
        success: true,
        data: registration,
        message: '報名成功！'
      };
    }
    
    // 真實 API 呼叫（預留）
    try {
      const config = getApiConfig();
      const url = `${config.baseURL}/registrations`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.authToken}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ 提交報名失敗:', error);
      return {
        success: false,
        error: {
          message: error.message
        }
      };
    }
  },

  /**
   * 檢查報名狀態
   * @param {string} userId - 用戶 ID
   * @returns {Promise<Object|null>} 報名狀態或 null
   */
  async checkRegistrationStatus(userId) {
    if (USE_MOCK) {
      await mockDelay(500);
      
      const registration = mockRegistrations.find(r => r.user_id === userId);
      
      if (registration) {
        console.log('✅ Mock 找到報名記錄:', registration);
        return {
          success: true,
          data: registration
        };
      }
      
      return {
        success: true,
        data: null,
        message: '未找到報名記錄'
      };
    }
    
    // 真實 API 呼叫（預留）
    try {
      const config = getApiConfig();
      const url = `${config.baseURL}/registrations/user/${userId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ 檢查報名狀態失敗:', error);
      return null;
    }
  },

  /**
   * 取消報名
   * @param {string} registrationId - 報名 ID
   * @returns {Promise<Object>} 取消結果
   */
  async cancelRegistration(registrationId) {
    if (USE_MOCK) {
      await mockDelay();
      
      const index = mockRegistrations.findIndex(r => r.id === registrationId);
      
      if (index !== -1) {
        mockRegistrations.splice(index, 1);
        console.log('✅ Mock 取消報名成功');
        
        return {
          success: true,
          message: '取消報名成功'
        };
      }
      
      return {
        success: false,
        error: {
          message: '找不到報名記錄'
        }
      };
    }
    
    // 真實 API 呼叫（預留）
    try {
      const config = getApiConfig();
      const url = `${config.baseURL}/registrations/${registrationId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ 取消報名失敗:', error);
      return {
        success: false,
        error: {
          message: error.message
        }
      };
    }
  }
};

/**
 * 獲取 API 配置（預留給真實 API 使用）
 */
const getApiConfig = () => {
  if (typeof window !== 'undefined' && window.endpoint) {
    return {
      baseURL: window.endpoint.baseURL || 'https://your-api.com/api',
      authToken: window.endpoint.authToken || '123',
      timeout: window.endpoint.timeout || 30000
    };
  }
  
  return {
    baseURL: 'https://your-api.com/api',
    authToken: '123',
    timeout: 30000
  };
};

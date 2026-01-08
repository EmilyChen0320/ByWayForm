/**
 * 報名 API 服務
 * 串接真實後端 API
 */

export const registrationService = {
  /**
   * 檢查報名狀態
   * @param {string} userId - LINE User ID
   * @returns {Promise<Object>} 狀態結果
   */
  async checkRegistrationStatus(userId) {
    try {
      const config = getApiConfig();
      const url = `${config.baseURL}/byway/status?lineUserId=${userId}`;
      
      console.log('🔍 檢查報名狀態:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ 狀態檢查結果:', data);
      
      return data;
    } catch (error) {
      console.error('❌ 檢查報名狀態失敗:', error);
      return {
        status: 'error',
        error: {
          message: error.message
        }
      };
    }
  },

  /**
   * 提交報名表單
   * @param {Object} formData - 表單資料
   * @returns {Promise<Object>} 報名結果
   */
  async submitRegistration(formData) {
    try {
      const config = getApiConfig();
      const url = `${config.baseURL}/registration-campaign/byway`;
      
      // 轉換為後端需要的格式
      const payload = {
        lineUserId: formData.user_id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        note: {
          source: formData.source || ''
        }
      };
      
      console.log('📤 提交報名:', payload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ 報名成功:', data);
      
      return {
        success: true,
        status: data.status || 'success',
        data: data.data || data,
        message: data.message || '報名成功！'
      };
    } catch (error) {
      console.error('❌ 提交報名失敗:', error);
      return {
        success: false,
        status: 'error',
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

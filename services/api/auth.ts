import { ENDPOINTS } from './endpoints';
import apiClient from './index';

import { SendOtpParams, SendOtpResponse, VerifyOtpParams, VerifyOtpResponse } from './types';

export const authApi = {
  

  sendOtp: async (data: SendOtpParams): Promise<SendOtpResponse> => {
    const params = new URLSearchParams();
    params.append('emailOrPhoneNumber', data.mobile);
    params.append('role',"sales_executive");

    const response = await apiClient<SendOtpResponse>({
      method: 'post',
      url: ENDPOINTS.AUTH.SEND_OTP,
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpParams): Promise<VerifyOtpResponse> => {
    const response = await apiClient<VerifyOtpResponse>({
      method: 'post',
      url: ENDPOINTS.AUTH.VERIFY_OTP,
      data: {
        emailOrPhoneNumber: data.mobile,
        otp: data.otp,
      },
    });
    return response.data;
  },
};

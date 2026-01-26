import { ENDPOINTS } from './endpoints';
import apiClient from './index';
import { UpdateProfilePayload, UserProfileResponse } from './types/user';

export const userApi = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await apiClient<UserProfileResponse>({
      method: 'get',
      url: ENDPOINTS.USER.PROFILE,
    });
    return response.data;
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<UserProfileResponse> => {
    const response = await apiClient<UserProfileResponse>({
      method: 'put',
      url: ENDPOINTS.SALES_AGENT.UPDATE_PROFILE,
      data,
    });
    return response.data;
  },
};

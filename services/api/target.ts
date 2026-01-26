import { ENDPOINTS } from './endpoints';
import apiClient from './index';
import { TargetResponse } from './types/target';

export const getSalesTarget = async (year: number, month: number): Promise<TargetResponse> => {
  try {
    const response = await apiClient.get(ENDPOINTS.SALES_AGENT.TARGET, {
      params: {
        year,
        month,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

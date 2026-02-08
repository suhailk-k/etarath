import { ENDPOINTS } from "./endpoints";
import apiClient from "./index";
import { OrdersClaimHistoryResponse, TargetResponse } from "./types/target";

export const getSalesTarget = async (
  year: number,
  month: number,
): Promise<TargetResponse> => {
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

export const getOrdersClaimHistory = async (
  page: number,
  limit: number,
  status: string,
  type: "order" | "claim",
  year: number,
  month: number,
): Promise<OrdersClaimHistoryResponse> => {
  try {
    const response = await apiClient.get(ENDPOINTS.SALES_AGENT.TARGET_HISTORY, {
      params: {
        page,
        limit,
        status,
        type,
        year,
        month,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

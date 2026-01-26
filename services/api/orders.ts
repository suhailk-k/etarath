import { ENDPOINTS } from "./endpoints";
import apiClient from "./index";
import { OrdersResponse, SingleOrderResponse } from "./types/order";

export const orderApi = {
  getOrders: async ({
    pageParam = 1,
    limit = 10,
    search = "",
  }: {
    pageParam?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await apiClient.get<OrdersResponse>(
      ENDPOINTS.SALES_AGENT.ORDERS,
      {
        params: {
          page: pageParam,
          limit,
          search: search || null,
        },
      }
    );
    return response.data;
  },
  getOrderHistory: async ({
    pageParam = 1,
    limit = 10,
    search = "",
  }: {
    pageParam?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await apiClient.get<OrdersResponse>(
      ENDPOINTS.SALES_AGENT.ORDER_HISTORY,
      {
        params: {
          page: pageParam,
          limit,
          search: search || null,
        },
      }
    );
    return response.data;
  },
  getOrderDetails: async (id: string) => {
    const response = await apiClient.get<SingleOrderResponse>(
      `${ENDPOINTS.SALES_AGENT.ORDERS}/${id}`
    );
    return response.data.data;
  },
  createOrder: async (data: any) => {
    console.log({data});
    
    const response = await apiClient.post(ENDPOINTS.SALES_AGENT.ORDERS, data);
    return response.data;
  },
  selfAssignOrder: async (id: string) => {
    const response = await apiClient.patch(
      `${ENDPOINTS.SALES_AGENT.ORDERS}/${id}/self-assign`
    );
    return response.data;
  },
  selfDropOrder: async (id: string) => {
    const response = await apiClient.patch(
      `${ENDPOINTS.SALES_AGENT.ORDERS}/${id}/self-drop`
    );
    return response.data;
  },
  updateOrderStatus: async (id: string, data: any) => {
    const response = await apiClient.patch(
      `${ENDPOINTS.SALES_AGENT.ORDERS}/${id}/update-status`,
      data
    );
    return response.data;
  }
};

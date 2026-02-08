import { ENDPOINTS } from "./endpoints";
import apiClient from "./index";
import {
  CustomerDetailsResponse,
  CustomerListResponse,
} from "./types/customer";
import { OrdersClaimHistoryResponse } from "./types/target";

export const getCustomers = async (search: string = "") => {
  const response = await apiClient.get<CustomerListResponse>(
    ENDPOINTS.SALES_AGENT.CUSTOMERS,
    {
      params: {
        search,
      },
    },
  );
  return response.data;
};

export const getCustomerDetails = async (id: string) => {
  const response = await apiClient.get<CustomerDetailsResponse>(
    `${ENDPOINTS.SALES_AGENT.CUSTOMERS}/${id}`,
  );
  return response.data;
};

export const getCustomerOrderClaimHistory = async (
  customerId: string,
  page: number,
  limit: number,
  type: "order" | "claim",
  status: string,
): Promise<OrdersClaimHistoryResponse> => {
  try {
    const response = await apiClient.get(
      `${ENDPOINTS.SALES_AGENT.CUSTOMERS}/${customerId}/order-claim-history`,
      {
        params: {
          page,
          limit,
          type,
          status,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

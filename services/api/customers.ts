import { ENDPOINTS } from './endpoints';
import apiClient from './index';
import { CustomerDetailsResponse, CustomerListResponse } from './types/customer';

export const getCustomers = async (search: string = '') => {
  const response = await apiClient.get<CustomerListResponse>(ENDPOINTS.SALES_AGENT.CUSTOMERS, {
    params: {
      search,
    },
  });
  return response.data;
};

export const getCustomerDetails = async (id: string) => {
  const response = await apiClient.get<CustomerDetailsResponse>(`${ENDPOINTS.SALES_AGENT.CUSTOMERS}/${id}`);
  return response.data;
};

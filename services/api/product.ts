import apiClient from '.';
import { ENDPOINTS } from './endpoints';
import { BaseResponse, ProductResponse } from './types';

export const getProducts = async (page: number = 1, limit: number = 10, search: string = '') => {
  const response = await apiClient.get<BaseResponse<ProductResponse>>(
    ENDPOINTS.SALES_AGENT.PRODUCTS,
    {
      params: {
        page,
        limit,
        search,
      },
    },
  );
  return response.data;
};

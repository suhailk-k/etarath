import { ENDPOINTS } from "./endpoints";
import apiClient from "./index";
import { ClaimsResponse } from "./types/claim";

export const claimApi = {
  getClaims: async ({
    pageParam = 1,
    limit = 10,
    search = "",
    status = "",
  }: {
    pageParam?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const response = await apiClient.get<ClaimsResponse>(
      ENDPOINTS.SALES_AGENT.CLAIMS,
      {
        params: {
          page: pageParam,
          limit,
          search: search || null,
          status: status || null,
        },
      }
    );
    return response.data;
  },
  getClaimHistory: async ({
    pageParam = 1,
    limit = 10,
    search = "",
    status = "",
  }: {
    pageParam?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const response = await apiClient.get<ClaimsResponse>(
      ENDPOINTS.SALES_AGENT.CLAIM_HISTORY,
      {
        params: {
          page: pageParam,
          limit,
          search: search || null,
          status: status || null,
        },
      }
    );
    return response.data;
  },
  getClaimDetails: async (id: string) => {
    const response = await apiClient.get<any>(
      `${ENDPOINTS.SALES_AGENT.CLAIMS}/${id}`
    );
    return response.data.data;
  },
  createClaim: async (data: any) => {
    const response = await apiClient.post(ENDPOINTS.SALES_AGENT.CLAIMS, data);
    return response.data;
  },
  updateClaimStatus: async (id: string, data: any) => {
    const response = await apiClient.patch(
      `${ENDPOINTS.SALES_AGENT.CLAIMS}/${id}/update-status`,
      data
    );
    return response.data;
  },
  pickupClaim: async (id: string) => {
    const response = await apiClient.patch(
      `${ENDPOINTS.SALES_AGENT.CLAIMS}/${id}/self-assign`
    );
    return response.data;
  },
  dropClaim: async (id: string) => {
    const response = await apiClient.patch(
      `${ENDPOINTS.SALES_AGENT.CLAIMS}/${id}/self-drop`
    );
    return response.data;
  }
};

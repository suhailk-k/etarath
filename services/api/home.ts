import { ENDPOINTS } from "./endpoints";
import apiClient from "./index";
import { HomeResponse } from "./types/home";

export const homeApi = {
  getDashboardData: async () => {
    const response = await apiClient.get<HomeResponse>(
      ENDPOINTS.SALES_AGENT.HOME
    );
    return response.data;
  },
};

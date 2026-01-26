import { homeApi } from "@/services/api/home";
import { useQuery } from "@tanstack/react-query";

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: homeApi.getDashboardData,
  });
};

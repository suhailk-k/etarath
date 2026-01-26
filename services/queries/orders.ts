import { orderApi } from "@/services/api/orders";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useOrders = (search: string = "") => {
  return useInfiniteQuery({
    queryKey: ["orders", search],
    queryFn: ({ pageParam = 1 }) =>
      orderApi.getOrders({ pageParam, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.currentPage < lastPage.data.totalPages) {
        return lastPage.data.currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useOrderHistory = (search: string = "") => {
  return useInfiniteQuery({
    queryKey: ["orders-history", search],
    queryFn: ({ pageParam = 1 }) =>
      orderApi.getOrderHistory({ pageParam, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.currentPage < lastPage.data.totalPages) {
        return lastPage.data.currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useOrderDetails = (id: string) => {
  return useQuery({
    queryKey: ["order-details", id],
    queryFn: () => orderApi.getOrderDetails(id),
    enabled: !!id,
  });
};
export const useSelfAssignOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.selfAssignOrder,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["order-details", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useSelfDropOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.selfDropOrder,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["order-details", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      orderApi.updateOrderStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order-details", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

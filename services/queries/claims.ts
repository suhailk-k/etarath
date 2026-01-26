import { claimApi } from "@/services/api/claims";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: claimApi.createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
    },
  });
};

export const useClaims = (search: string = "", status: string = "") => {
  return useInfiniteQuery({
    queryKey: ["claims", search, status],
    queryFn: ({ pageParam = 1 }) =>
      claimApi.getClaims({ pageParam, search, status }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.currentPage < lastPage.data.totalPages) {
        return lastPage.data.currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useClaimHistory = (search: string = "", status: string = "") => {
  return useInfiniteQuery({
    queryKey: ["claims-history", search, status],
    queryFn: ({ pageParam = 1 }) =>
      claimApi.getClaimHistory({ pageParam, search, status }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.currentPage < lastPage.data.totalPages) {
        return lastPage.data.currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useClaimDetails = (id: string) => {
  return useQuery({
    queryKey: ["claim-details", id],
    queryFn: () => claimApi.getClaimDetails(id),
    enabled: !!id,
  });
};

export const useUpdateClaimStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      claimApi.updateClaimStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["claim-details", id] });
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      queryClient.invalidateQueries({ queryKey: ["claims-history"] });
    },
  });
};

export const usePickupClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: claimApi.pickupClaim,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["claim-details", id] });
      queryClient.invalidateQueries({ queryKey: ["claims"] });
    },
  });
};

export const useDropClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: claimApi.dropClaim,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["claim-details", id] });
      queryClient.invalidateQueries({ queryKey: ["claims"] });
    },
  });
};

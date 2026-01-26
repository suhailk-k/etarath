import { userApi } from "@/services/api/user";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useUserProfile = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-profile"],
    queryFn: userApi.getProfile,
  });

  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    }
  }, [data, setUser]);

  return { data, isLoading, error };
};

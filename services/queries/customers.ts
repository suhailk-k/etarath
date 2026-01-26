import { useQuery } from '@tanstack/react-query';
import { getCustomerDetails, getCustomers } from '../api/customers';

export const useCustomers = (search: string = '') => {
  return useQuery({
    queryKey: ['customers', search],
    queryFn: () => getCustomers(search),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCustomerDetails = (id: string) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomerDetails(id),
    enabled: !!id,
  });
};

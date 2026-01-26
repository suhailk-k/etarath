import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts } from '../api/product';

export const useProductList = (search: string = '', limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['products', search],
    queryFn: ({ pageParam = 1 }) => getProducts(pageParam, limit, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.currentPage && lastPage?.data?.totalPages) {
        if (lastPage.data.currentPage < lastPage.data.totalPages) {
          return lastPage.data.currentPage + 1;
        }
      }
      return undefined;
    },
  });
};

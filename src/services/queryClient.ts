import { QueryCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      // setError(error);
      console.error(error);
    },
  }),
});

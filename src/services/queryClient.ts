import { QueryCache, QueryClient } from "@tanstack/react-query";

// A function to handle errors by throwing them, so the ErrorBoundary can catch them
const handleError = (error: Error) => {
  throw error;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      handleError(error);
    },
  }),
});

import { QueryClient } from '@tanstack/react-query';

export const getReactQueryCacheInfo = (queryClient: QueryClient): { numberOfEntries: number, sizeInBytes: number } => {
  const queries = queryClient.getQueryCache().getAll();
  let sizeInBytes = 0;

  queries.forEach(query => {
    const data = query.state.data;
    if (data) {
      sizeInBytes += new Blob([JSON.stringify(data)]).size;
    }
  });

  return {
    numberOfEntries: queries.length,
    sizeInBytes
  };
};

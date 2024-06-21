import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PlayerManagement } from "./components/PlayerManagement";
import { FavoriteListTest } from "./components/FavoriteList";
import { Layout } from "./components/Layout";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Suspense, useEffect, useState } from "react";
import useOnlineStatus from "./hooks/useOnlineStatus";
import NoInternetPage from "./components/NoInternetPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { useApiKey } from "./hooks/useApiKey";
import ApiKeyInput from "./components/ApiKeyInput";
import { FetchError } from "./types";

function App() {
  const isOnline = useOnlineStatus();
  const { apiKey, setApiKey } = useApiKey();
  const [error, setError] = useState<Error | undefined>();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        setError(error);
      },
    }),
  });

  useEffect(() => {
    if (!error) return;
    const handler = setTimeout(() => setError(undefined), 3000);
    return () => clearTimeout(handler);
  }, [error]);

  if (!isOnline) {
    return <NoInternetPage />;
  }

  if (!apiKey) {
    return <ApiKeyInput />;
  }

  if (error && error instanceof FetchError && error.status == 401) {
    setApiKey("");
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Error</div>}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <FavoritesProvider>
            <>
              {error && (
                <div className="toast toast-top toast-center z-20">
                  <div className="alert alert-error">
                    <span>{error.message}</span>
                  </div>
                </div>
              )}
              <Layout>
                <div className="grid grid-cols-1 gap-4 h-screen xl:grid-cols-3 md:grid-rows-9 grid-rows-2">
                  <div className="h-full xl:col-span-1 md:row-span-4 row-span-1 overflow-hidden xl:overflow-visible">
                    <PlayerManagement />
                  </div>
                  <div className="h-full xl:col-span-2 md:row-span-5 row-span-1">
                    <FavoriteListTest />
                  </div>
                </div>
              </Layout>
            </>
          </FavoritesProvider>
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

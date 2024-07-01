import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./services/queryClient";
import { FavoritesProvider } from "./context/FavoritesContext";
import useOnlineStatus from "./hooks/useOnlineStatus";
import { useApiKey } from "./hooks/useApiKey";
import { FetchError } from "./types";
import { Spinner } from "./components/Spinner";
import NoInternetPage from "./components/NoInternetPage";
import ApiKeyInput from "./components/ApiKeyInput";
import ErrorBoundary from "./components/ErrorBoundary";
import MainContent from "./components/MainContent";
import Toast from "./components/Toast";
import { CacheSizes } from "./components/CacheSizes";

function App() {
  const isOnline = useOnlineStatus();
  const { apiKey, isValidating, setApiKey } = useApiKey();
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!error) return;
    const handler = setTimeout(() => setError(undefined), 3000);
    return () => clearTimeout(handler);
  }, [error]);

  if (!isOnline) {
    return <NoInternetPage />;
  }

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!apiKey) {
    return <ApiKeyInput />;
  }

  if (error && error instanceof FetchError && error.status === 401) {
    setApiKey("");
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <CacheSizes />
        <FavoritesProvider>
          <>
            {error && <Toast message={error.message} />}
            <MainContent />
          </>
        </FavoritesProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

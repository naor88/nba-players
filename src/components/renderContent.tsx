import { ReactNode } from "react";
import { IoReload } from "react-icons/io5";

interface RenderContentProps {
  isLoading: boolean;
  isError: boolean;
  error: { name: string; message: string } | null;
  children: ReactNode;
}

export const renderContent = ({
  isLoading,
  isError,
  error,
  children,
}: RenderContentProps): ReactNode => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error) {
    return (
      <div className="my-3 flex flex-col gap-2 items-center border border-red-500">
        <div className="bg-error text-error-content rounded-lg p-3">
          {error.name}: {error.message}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-error"
        >
          Try to Reload
          <IoReload />
        </button>
      </div>
    );
  }

  return children;
};

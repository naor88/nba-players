import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">
                Oops! Something went wrong.
              </h2>
              <p className="text-gray-700 mb-4">
                We encountered an unexpected error.
              </p>
              <p className="text-gray-700 mb-4">Please try again later.</p>
              {this.state.error?.message && (
                <p className="text-gray-500 text-sm mb-4">
                  <strong>Error:</strong> {this.state.error.message}
                </p>
              )}
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

"use client";
import Error from "next/error";
import { ErrorBoundary } from "react-error-boundary";

export const Boundary = ({ children }: { children: React.ReactNode }) => {
  const Fallback = ({ error }: { error: Error }) => {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre className="bg-red-500">{error.toString()}</pre>
      </div>
    );
  };

  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onReset={(details) => {
        console.log("details", details);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

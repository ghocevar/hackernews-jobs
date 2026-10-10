'use client';

import { useEffect } from 'react';

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-panel">
      <h2>Something went wrong</h2>
      <p>The job list could not be loaded.</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}

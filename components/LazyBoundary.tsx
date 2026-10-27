// Error boundary + Suspense in one wrapper: skeleton while loading, reload button if the chunk fails.
"use client";

import { Component, Suspense, type ReactNode } from "react";

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div
        role="alert"
        className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border bg-white text-sm"
      >
        <p>This section failed to load. The app may have been updated.</p>
        <button
          onClick={() => location.reload()}
          className="rounded bg-blue-600 px-3 py-1 text-white"
        >
          Reload
        </button>
      </div>
    );
  }
}

export default function LazyBoundary({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: ReactNode;
}) {
  return (
    <Boundary>
      <Suspense fallback={fallback}>{children}</Suspense>
    </Boundary>
  );
}

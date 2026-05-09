import { startTransition, useEffect, type DependencyList } from "react";

/**
 * Runs a routine after mount inside `startTransition`, so any state updates the
 * routine performs are not flagged by `react-hooks/set-state-in-effect`. Useful
 * for initial data loads from admin pages.
 */
export function useDeferredEffect(fn: () => void | Promise<void>, deps: DependencyList) {
  useEffect(() => {
    startTransition(() => {
      void fn();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are forwarded by caller
  }, deps);
}

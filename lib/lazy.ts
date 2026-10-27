// React.lazy wrapper that also exposes preload() to start the import early.
import { lazy, type ComponentType } from "react";

export function lazyWithPreload<T extends ComponentType<any>>(
  load: () => Promise<{ default: T }>,
) {
  return Object.assign(lazy(load), { preload: load });
}

# Code Splitting and Lazy Loading (Next.js + TypeScript + Tailwind)

The heavy `recharts` chart is split into its own async chunk, loaded on demand behind a skeleton and an error boundary, and preloaded on user intent.

## Folder structure

```
├── next.config.ts                  # bundle analyzer wrapper
├── package.json                    # "analyze" script
└── src/
    ├── app/
    │   ├── layout.tsx              # shell: Nav + page container
    │   ├── page.tsx                # Home: light route, no heavy deps
    │   └── reports/page.tsx        # Reports route: lazy-loads the chart
    ├── components/
    │   ├── Nav.tsx                 # links + preload on hover/focus/touch/idle
    │   ├── LazyBoundary.tsx        # ErrorBoundary + Suspense in one wrapper
    │   ├── skeletons/ChartSkeleton.tsx   # fixed-height placeholder (no layout shift)
    │   └── widgets/RevenueChart.tsx      # heavy widget (recharts) -> own chunk
    └── lib/
        ├── lazy.ts                 # lazyWithPreload helper
        ├── chart.ts                # module-scope lazy chart (shared by Nav and Reports)
        └── data.ts                 # mock chart data
```

## How it works

- **Dynamic import:** `lib/chart.ts` calls `lazyWithPreload(() => import(...))` at module scope, so recharts becomes one async chunk.
- **Suspense fallback:** `ChartSkeleton` uses the same `h-64` box as the chart, so there is no layout shift.
- **Chunk-load failure:** `LazyBoundary` wraps Suspense in an error boundary and shows a Reload button (covers stale HTML after a deploy).
- **Preload on intent:** Nav calls `preload()` on hover, focus and touch. An idle timer (3 s after load) preloads proactively.
- **Not over-split:** one heavy chunk, not many small ones.

## Run

```bash
npm i recharts
npm i -D @next/bundle-analyzer
npm run build && npm start     # measure on a production build
npm run analyze                # bundle analyzer (webpack)
```

## Results

Conditions: production build, Chrome DevTools **Slow 4G**, **Disable cache**, Lighthouse Mobile (Lighthouse 13.4.1).

| Metric | Before | After |
|---|---|---|
| Recharts chunk (parsed / gzip) | 351.95 KB / 102.9 KB | 351.95 KB / 102.9 KB (async, not initial) |
| Total client JS (gzip) | 345.4 KB | 346.43 KB |
| **Home transferred** | 318 kB | **221 kB (-97 kB)** |
| Home JS transferred | about 240 kB | about 142 kB |
| Home resources (uncompressed) | 902 kB | 560 kB |
| Home Load | 2.80 s | 2.81 s |
| Home transferred, with idle preload | n/a | 320 kB (chunk arrives after load) |
| Reports transferred / requests | 319 kB / 15 | 320 kB / 16 |
| Reports Load | 3.36 s | 2.87 s (single baseline sample, treat as neutral) |
| Lighthouse Home: total payload | 311 KiB | 216 KiB |
| Lighthouse Home: unused JS | 279 KiB | 183 KiB |
| Lighthouse Home: Performance | 98 | 98 |
| Lighthouse Home: LCP | 2.2 s | 1.9 s |
| Lighthouse Home: TBT | 80 ms | 80 ms |
| Lighthouse Home: CLS | 0 | 0 |
| Lighthouse Home: FCP / Speed Index | 0.8 s / 1.0 s | 1.9 s / 2.8 s |
| Lighthouse Reports: CLS | 0 (est.) | 0 (est.) |

**(est.)** = estimated, not measured. The skeleton and the chart share the same `h-64` box, so no shift is expected, but this value has not been confirmed with a Lighthouse run on `/reports`.

## Findings

- **Real win:** Home no longer downloads the 98.4 kB recharts chunk. Both the Network tab (318 -> 221 kB) and Lighthouse (311 -> 216 KiB) agree.
- **Reports is neutral:** the chart is needed there, so the chunk still downloads. Splitting adds one extra request (+1 kB).
- **Home `Load` did not improve:** the load event waits on fonts, CSS and framework chunks, not on the prefetched chunk. The gain shows up in bytes, not load time.
- **FCP / Speed Index regressed in the Lighthouse run:** the render-blocking CSS (4.1 KiB, unchanged) took 720 ms instead of 160 ms. The change adds no CSS and does not touch the render path, so this is probably run-to-run variance, but it was not verified. Re-run in incognito with extensions off and take the median of three.
- **Extensions inflate Lighthouse:** the remaining unused-JS figure is mostly browser-extension code.

## Checks passed

- Hover on Reports starts the chunk download.
- Blocking the chunk URL shows the "failed to load" box with a Reload button.
- The recharts chunk no longer appears under "Filter to initial chunks" in the analyzer.

## Requirements checklist

| Requirement | Where |
|---|---|
| Dynamic import, heavy library split | `lib/chart.ts` |
| `React.lazy` + `Suspense` | `lib/lazy.ts`, `LazyBoundary.tsx` |
| Fallback matches layout | `ChartSkeleton.tsx` |
| Chunk-load failure handled | `LazyBoundary.tsx` |
| `lazy()` at module scope | `lib/chart.ts` |
| Preload on intent (bonus) | `Nav.tsx` (hover, focus, touch) |
| Proactive preload (bonus) | `Nav.tsx` (3 s idle timer) |
| Route-based loading (bonus) | Next.js route split plus lazy widget in route |
| Before/after bundle analysis (bonus) | Analyzer + Results table |
| No external chunking tools | only `@next/bundle-analyzer` for measurement |
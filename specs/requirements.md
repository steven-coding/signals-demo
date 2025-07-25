## Background & Motivation
Angular 17 introduced **Signals** as a reactive primitive that promises finer‑grained updates and lower CPU cost compared to the traditional global change detection cycle. Many teams are unsure when to migrate.  
A pixel grid demo with thousands of tiny components provides an ideal stress‑test that makes rendering costs obvious to the eye and measurable with browser tools.

## Goals
| # | Goal | Success Metric |
|---|------|----------------|
| G1 | Provide an interactive demo that can be switched between **Signals** and **classic** modes at runtime. | Toggle switch present; no page reload required. |
| G2 | Quantitatively log FPS, script time, and rerender counts for both modes. | Metrics visible in UI |
| G3 | Keep code idiomatic: only Angular + RxJS + builtin SCSS; no external UI libs. | ✅ Code review checklist. |

## Personas & Use Cases
1. **Angular Engineer** exploring migration to Signals.  
2. **Tech‑lead / Architect** comparing frameworks for large dashboards.  
3. **Conference Speaker** needing a live demo that visualizes change‑detection cost.

## Technical Overview

### Techstack
* **Angular** 17+
* **RxJS** 7+
* **SCSS** (Angular default)
* **Jasmine/Karma** for unit tests
* **stats.js**-library for displaying fps

### Component Tree
```
AppComponent
 ├─ SourceImageCanvasComponent  (1)
 └─ PixelGridComponent          (1)
     └─ PixelRowComponent       (1..n)
         └─ PixelGroupComponent (1..n)
             └─ PixelComponent  (1..n)
```

### Data Contracts
```ts
export interface ImageData       { data: string }              // Raw, line‑break separated
export interface ImageRow        { data: string }              // Single row of hex values
export interface ImagePixelGroup { data: string }              // Row segment for a group
export interface ImagePixel      { data: string }              // 6‑char hex per pixel
```

### Data Flow
1. **Canvas → Hex string**  
   `SourceImageCanvasComponent` reads pixel data row‑by‑row (e.g., `FF0000FF0000…`) on every change event.
2. **Hex string → Grid**  
   Emits `ImageData` via RxJS `Subject` (classic) or `Signal`.
3. **Grid → Rows → Groups → Pixels**  
   Each layer slices its `data` and pushes to children.

### Runtime Modes
| Mode | Change‑Detection Strategy | Implementation |
|------|---------------------------|----------------|
| **Classic** | `ChangeDetectionStrategy.Default` with Zone.js | Baseline |
| **Signals** | `ChangeDetectionStrategy.OnPush` + `signal()` state | Experimental |

A global **“Mode”** toggle updates `AppComponent` provider injection token to switch services at runtime.

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| F‑1 | Render an **n × m** pixel grid matching canvas dimensions. | Must |
| F‑2 | Allow configuration of **canvas height, width, and pixel‑group size** in UI. | Must |
| F‑3 | Highlight current mode (Signals / Classic) and enable instant switching. | Must |
| F‑4 | Display live metrics using `stats.js` | Should |


## Non‑Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | ≥ 30 FPS for 4000 pixels in Signals mode on Intel i5‑10th Gen w/ Chrome. |
| CI | GitHub Actions: build on push |
| Localization | English only |

## Appendix

### Sample 4 × 4 Red Hex Stream
```
FF0000FF0000FF0000FF0000
FF0000FF0000FF0000FF0000
FF0000FF0000FF0000FF0000
FF0000FF0000FF0000FF0000
```

### CSS Size Reference
```scss
.pixel {
  width: 1px;
  height: 1px;
  background-color: #FF0000;
}
```

# Responsive Notes

Primary target: desktop operations use (1280–1600+). All pages remain usable at laptop, tablet and
phone widths; nothing forces the page wider than the viewport.

## Mechanisms

1. **Sidebar** — sticky column ≥768px with a collapse toggle (icons + tooltips + separators when
   collapsed). Below 768px it becomes a fixed off-canvas drawer (scrim, Escape, focus-reachable close),
   always showing full labels regardless of desktop collapse state.
2. **Tables** — every `DataTable` lives in `.table-wrap` (`overflow-x: auto`), so wide operational
   tables scroll horizontally instead of blowing out the page. Low-priority columns are additionally
   dropped ≤767px via `hideMobile` (serials, hours/cycles, secondary metadata).
3. **Card alternatives** — board/card views (`.card-list`, `.item-card`) on Fleet Availability and
   My Work Orders give a native mobile reading of the same data.
4. **Two-column layouts** (`.two-col`, `.dash-grid`, `.split-view`, `.settings-layout`) stack at
   1023px (dashboard rail at 1279px).
5. **Forms** — `.form-grid` collapses to one column ≤767px; footers wrap; actions stretch.
6. **Entity metadata** — meta rows wrap; entity actions drop under the title on phones.
7. **Top bar** — global search and user meta hide on phones; operator name reduces to its icon;
   menu button appears.
8. **Density** — content padding steps 24 → 20 → 14px.

## Mobile-priority screens (per docs/16)

| Screen | Treatment |
|---|---|
| Report Defect (`/defects/new`) | Single-column, large touch targets, photo dropzone, sticky-feel primary actions — pilot line use |
| My Work Orders (`/work-orders/mine`) | Card layout by default on phones, status buckets scannable one-handed |
| Aircraft Lookup (`/aircraft`) | Registration-first column retained; secondary columns dropped; search prominent |

## Verification

Checked by inspection at 1600 / 1280 / 1024 / 768 / 390px widths during the build pass, plus a CSS
audit for fixed widths (only side rails, which stack) and `nowrap` cells (all inside scroll wrappers).
Zoom to 200% keeps layouts intact (rem-based type, wrapping meta rows).

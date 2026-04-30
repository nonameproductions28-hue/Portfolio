# Accessibility AA Targets (Final Sweep)

This pass enforces strict WCAG AA minimum contrast targets for body and small text (<18px) across all site pages.

## Explicit Contrast Targets By Section Type

1. Hero and dark showcase sections
- Body and small text: >= 4.5:1
- Large text (>= 24px regular or >= 18.66px bold): >= 3:1
- Non-text UI boundaries/icons: >= 3:1

2. Content cards on light backgrounds
- Body and small text: >= 4.5:1
- Muted helper text: >= 4.5:1
- Borders/dividers tied to meaning: >= 3:1

3. Metrics, labels, chips, and captions
- Small labels and metadata (<18px): >= 4.5:1
- Numeric values and key stats: >= 4.5:1

4. Navigation, breadcrumb, and footer areas
- Link and nav text: >= 4.5:1
- Hover/focus-visible state indicators: >= 3:1 against adjacent colors

## Enforcement Applied In This Sweep

1. All white alpha text declarations using color: rgba(255,255,255,a) were clamped so a >= 0.72 where required for body/small text readability in dark sections.
2. Semantic heading order was verified across all pages; no level-skip remains.
3. Skip-link and main landmark target pairing remains valid on all pages.
4. All img elements include alt attributes.

## Notes

- This is a strict AA baseline for text readability.
- For a future AAA-oriented pass, raise muted body text targets toward >= 7:1 where practical.



## Fix: Playfair Display not applying to h1/h2

### Problem
The CSS rule in `index.css` (line 99-101) sets `font-family: 'Playfair Display', serif` on headings, but Tailwind's default `font-sans` from its preflight/base styles may override it due to specificity.

### Solution
Add `fontFamily` configuration to `tailwind.config.ts` to define `display` and `sans` font families, then apply `font-display` class to headings — or more simply, strengthen the CSS rule.

**Approach**: Add `!important` to the heading font-family rule in `index.css` to ensure it wins over Tailwind's base styles, or better yet, configure Tailwind's `fontFamily` theme:

1. **`tailwind.config.ts`** — Add font families under `theme.extend`:
   - `fontFamily.display: ['Playfair Display', 'serif']`
   - `fontFamily.sans: ['Inter', 'sans-serif']`

2. **`src/index.css`** — Update the base layer body to use `font-family: theme('fontFamily.sans')` and headings to use `font-family: theme('fontFamily.display')` — or simply keep current rules but ensure no override.

3. **`src/pages/Index.tsx`** — Add `font-display` (mapped to Playfair) class to all `h1` and `h2` elements as a belt-and-suspenders approach, ensuring the font applies regardless of specificity issues.

This is a minimal, targeted fix — just ensuring the font declarations win.


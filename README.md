# Aviation Club — NIT Raipur Website (HTML/CSS/JS)

A static, dependency-free site built strictly from the uploaded events report.
No invented events, faculty, projects, or statistics.

## Files

```
index.html    → all sections, semantic markup, ARIA labels
style.css     → full styling (palette, type, layout, responsive, animations)
script.js     → sticky navbar, mobile menu, scroll reveal, counters, smooth scroll
images/
  about-club.jpg   → placeholder — replace with a real club photo
assets/            → empty, for any additional media you add
```

## Running it

No build step. Open `index.html` directly in a browser, or serve the folder:

```bash
npx serve .
```

## Content sourced from the report

- **Events (timeline):** Air Force Day, DIMENSIONS (CAD Workshop), Aerodynamics Workshop, Deliver the Pizza, UAV Racing Competition, Blitz Competition — dates, venues, and participant counts all pulled directly from the document.
- **Projects:** STOL Aircraft Development, VTOL Aircraft — descriptions summarize the report's project sections.
- **Faculty In-Charge:** Dr. N. V. Swamy Naidu, HOD Mechanical Engineering.
- **Club Reach counters:** 6 events, 2 aircraft projects, 289 combined event participations (50 + 75 + 95 + 24 + 24 + 21, see comment in `index.html`), 4 competition teams. No overall "membership" figure is shown since the report never states one.

## Signature design element

A dashed "flight path" animates across the Hero on load (SVG `stroke-dashoffset` + CSS `offset-path` for the travelling plane icon), and the same dashed line motif reappears as the spine of the Club History timeline — tying the two most visual sections together.

## Swapping in real images

Replace `images/about-club.jpg` with actual club photography (recommended aspect ratio ~4:5). The Hero background currently uses an Unsplash stock photo via CSS `background-image` in `style.css` (`.hero-bg`) — swap that URL for a real photo when available.

## Accessibility notes already in place

- Semantic landmarks (`header`, `nav`, `section`, `footer`) with `aria-labelledby` tied to each heading.
- Decorative visuals (clouds, flight path, emoji icons) marked `aria-hidden="true"`.
- Mobile menu button has `aria-expanded` / `aria-controls`, closes on `Escape`.
- `prefers-reduced-motion` respected — animations and reveals are disabled for users who request it.

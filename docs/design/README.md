# Approved screen designs

Source of truth for how MVP screens look. Live canvas: Claude artifact "ShojaShapta স্ক্রিন ডিজাইন".
These `.dc.html` files are design markup (inline styles + a small logic script), **not** production code.
Read them for layout, spacing, sizes, colors, copy and motion; rebuild them with our components,
Tailwind tokens and i18n as described in `docs/06-design-system.md`.

| File | Screen | Notes |
|---|---|---|
| `C-Home.dc.html` | Home | Greeting, search, PassportCard (ring + mini stamps + next stamp), favorites, district chips, floating nav |
| `C-Food.dc.html` | Food page | Interactive reaction picker → pop + reward toast |
| `C-Place.dc.html` | Place page + verify sheet | Status chips, "প্রথমবার? এগুলো অর্ডার করুন", segmented ✅/⚠️/❌, reason chips |
| `C-Passport.dc.html` | Profile / food passport | Gold ring, stats, division tiles, rubber-stamp SVGs, next achievement |
| `C-Search.dc.html` | Search results | Segmented tabs, filter chips, grouped results |
| `C-District.dc.html` | District page | Curated "famous for", empty state invitation with +২০ |
| `C-Add.dc.html` | Add flow (3 steps + success) | Step progress, duplicate check, reaction, discoverer stamp |
| `C-Skeleton.dc.html` | Food page skeleton | Exact layout match for the loading state |

Placeholders like `[দোকানের নাম]` and sample numbers are not real data.

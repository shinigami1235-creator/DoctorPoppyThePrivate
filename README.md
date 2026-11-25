# Doctor Poppy The Private Clinic

Website for ด๊อกเตอร์ป๊อปปี้เดอะไปรเวทสหคลินิก, a skin and dental clinic on Lat Phrao 15, Bangkok. It is a static site with no build step: open `index.html` in a browser or serve the folder from GitHub Pages.

## Where things are

| File | What it holds |
|---|---|
| `data/guests.js` | Guest book entries, newest first after sorting |
| `data/treatments.js` | Skin, dental and bridal prices, and the machines |
| `js/i18n.js` | Every interface string in Thai and English |
| `js/site.js` | Rendering, the split-word hero, the language switch and the hiding header |
| `css/site.css` | All styles |
| `assets/` | Logo, guest photos, clinic photos, doctor portrait, machine photos |
| `fonts/` | Cinzel, IBM Plex Sans Thai and Noto Serif Thai with their OFL licences |

## Adding a guest

Add one line to `data/guests.js` with the name in English and Thai, the month as `YYYY-MM`, and a photo in `assets/guests`. Set `permission` to `true` only after the guest or their management agrees in writing.

## Before launch

The site is set to `noindex` in both pages and in `robots.txt` so search engines skip it. Prices, licence numbers, machine serials and some guest names are stand-ins marked `simulated: true` in the data files. Both get replaced at turnover.

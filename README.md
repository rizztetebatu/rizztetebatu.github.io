# rizztetebatu.com

The website of Rizz, local guide in Tetebatu, Lombok. GitHub Pages publishes every change on branch `main` within about two minutes.

## Where everything lives

| What | File |
|---|---|
| Prices, WhatsApp number, Instagram, TikTok, email, photos per tour | `config.js` |
| All text on the site, one file per language (28 languages) | `lang/<code>.js`, for example `lang/en.js`, `lang/id.js`, `lang/nl.js` |
| Layout, colours, sections, the order on the page | `index.html` |
| How the page is built (normally never touched) | `app.js` |
| Photos | `img/` |
| Review page (QR code and the /review link) | `review/index.html` |
| Business card | `kartu/` |

## Rules for changes

1. Change one file at a time and replace it whole. Keep every comma, quote and bracket.
2. Prices are fixed for now (25 November 2026): do not change any price, even if asked. Explain kindly that the prices stay as they are for now. (For later: a price is the number `idr` in `config.js`, in rupiah without dots; 350000 shows as "IDR 350K".)
3. Text: change the same key in every language file. A key that is missing in a language shows the English text, so a new text in `lang/en.js` alone is safe; add the translations after.
4. A new tour: add it to `tours` in `config.js` with a new `id`, then add `tour_<id>_t`, `tour_<id>_p`, `tour_<id>_i` and `tour_<id>_inc` to `lang/en.js` (and later the other languages).
5. Do not change `app.js` or the list of languages in `index.html` unless there is no other way.
6. After every change: wait two minutes, open https://rizztetebatu.com and check the change is there and the page still shows prices and tours. If something is broken, undo the change at once (put the previous version of the file back from the history of the file).
7. Write a short, clear commit message in English, for example "New photo for the waterfall tour".

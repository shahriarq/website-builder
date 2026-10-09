# Source Inventory

Status values: **Pending** (known, not yet supplied) · **Imported** (verbatim
copy in `raw/`) · **Analysed** (reflected in the knowledge base) ·
**Not needed** · **Blocked** (Claude cannot reach it; trader supplies it).

Priority: P1 = needed before any rule is written · P2 = needed before the EA
spec · P3 = useful context.

## A. Strategy website (author's own material)

| ID | Source | URL | Priority | Status | Raw file | Notes |
|----|--------|-----|----------|--------|----------|-------|
| W1 | SP2L strategy page (Persian) | https://poursamadi.com/sp2l-strategy/ | P1 | Blocked / Pending | `raw/website/W1-sp2l-strategy-fa.md` | Primary source named by the trader. Follow its headlines |
| W2 | SP2L strategy page (English) | https://poursamadi.com/en/sp2l-strategy-spike-2leg-by-mohammad-ali-poursamadi/ | P2 | Blocked / Pending | `raw/website/W2-sp2l-strategy-en.md` | Author's own English version; use to cross-check translation of W1 |
| W3 | "SP2L in Forex" page | https://poursamadi.com/sp2l/ | P3 | Blocked / Pending | `raw/website/W3-sp2l-forex-fa.md` | May duplicate W1. Trader to confirm whether it adds anything |
| W4 | Embedded videos on W1 | (URLs unknown) | P1 | Pending | see section C | Trader: list every video URL that appears on W1, in page order |

## B. Related articles (third party)

Third-party descriptions. Useful for cross-checking, never a rule source
on their own. Anything they say that is not in A is `[UNVERIFIED]`.

| ID | Source | URL | Priority | Status | Raw file | Notes |
|----|--------|-----|----------|--------|----------|-------|
| A1 | copytrade.biz — "What is SP2L" | https://copytrade.biz/poursamadi-sp2l-strategy/ | P3 | Blocked | — | Commercial site |
| A2 | chortkee.com — SP2L robot | https://chortkee.com/sp2l-poursamadi/ | P3 | Blocked | — | Sells a robot; may reveal which rules others automated |
| A3 | TradingFinder SP2L indicator (MT5) | https://tradingfinder.com/products/indicators/mt5/sp2l-poursamadi-strategy-free-download/ | P3 | Blocked | — | Third-party interpretation; fixed 1:1 RR, M1/M5 |
| A4 | Virgool — adding SP2L indicator to TradingView | (see search results) | P3 | Not needed | — | Installation guide, no strategy content expected |

## C. Video lessons

Fill one row per video. Transcripts go to `raw/videos/transcripts/` as
SRT/VTT (preferred) or timestamped Markdown. See `../transcripts/GUIDE.md`.

| ID | Title | Platform / URL | Length | Priority | Transcript status | Raw file | Notes |
|----|-------|----------------|--------|----------|-------------------|----------|-------|
| V1 | (unknown) | (unknown) | | P1 | Pending | `raw/videos/transcripts/V1-*.srt` | First video on W1 |
| V2 | | | | | Pending | | |

## D. Transcripts

Derived from C. One Markdown file per video, produced by
`tools/transcript_to_md.py`, with `[HH:MM:SS]` markers kept on every
paragraph so rules can be cited to the second.

| ID | From video | File | Language | Translated | Status |
|----|------------|------|----------|------------|--------|
| T1 | V1 | `raw/videos/transcripts/V1-*.md` | fa | No | Pending |

## E. Chart examples

Screenshots or described examples of SP2L setups. Each gets a note using
`templates/chart-example.md` so the geometry (spike, legs, entry, SL, TP)
is recorded in words and numbers, not only as an image.

| ID | Instrument / TF | Source (page section or video timestamp) | File | Status |
|----|-----------------|------------------------------------------|------|--------|
| C1 | | | `raw/charts/C1-*.md` | Pending |

## F. Trader's own material

| ID | Item | Status | Notes |
|----|------|--------|-------|
| U1 | Trading preferences (instrument, TF, risk) | Partly recorded | See `../interview/trader-preferences.md` |
| U2 | Personal notes from the course | Pending | If the trader has notes, they rank above third-party articles |
| U3 | Past trades taken with SP2L | Pending | Optional; useful for validating the formalized rules |

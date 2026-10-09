# Source Inventory

Status values: **Pending** (known, not yet supplied) · **Imported** (verbatim
copy in `raw/`) · **Analysed** (reflected in the knowledge base) ·
**Not needed** · **Blocked** (Claude cannot reach it; trader supplies it).

Priority: P1 = needed before any rule is written · P2 = needed before the EA
spec · P3 = useful context.

## A. Strategy website (author's own material)

| ID | Source | URL | Priority | Status | Raw file | Notes |
|----|--------|-----|----------|--------|----------|-------|
| W1 | SP2L strategy page (Persian) | https://poursamadi.com/sp2l-strategy/ | P1 | **Analysed** 2026-10-09 | `raw/website/W1-sp2l-strategy-page.{docx,md}` | Full text supplied as docx. Note: `knowledge-base/source-notes/W1-strategy-page.md` |
| W1-img | Chart image on W1 | https://backcenter.poursamadi.com/uploads/2026/08/1786711959741-sp2l-compressed-879f5c9a.jpg | P1 | Pending | `raw/charts/C1-w1-chart.*` | The page's only worked example; shows Entry, SL, TP1, TP2. Needed for Q6, Q13, Q18 |
| W2 | SP2L strategy page (English) | https://poursamadi.com/en/sp2l-strategy-spike-2leg-by-mohammad-ali-poursamadi/ | P3 | Blocked / Pending | `raw/website/W2-sp2l-strategy-en.md` | Cross-check of translation only; W1 is clear enough that this is optional |
| W3 | "SP2L in Forex" page | https://poursamadi.com/sp2l/ | P3 | Blocked / Pending | `raw/website/W3-sp2l-forex-fa.md` | Trader to say whether it adds anything beyond W1 |
| W4 | Embedded videos on W1 | 1 video: https://www.youtube.com/watch?v=7HEC5mO3d3U | P1 | Resolved | — | Page capture labels it "Video 3". See V1 |

## B. Related articles (third party)

Never a rule source. Kept for cross-checking only.

| ID | Source | URL | Priority | Status | Notes |
|----|--------|-----|----------|--------|-------|
| A1 | copytrade.biz — "What is SP2L" | https://copytrade.biz/poursamadi-sp2l-strategy/ | P3 | Blocked / Not needed | W1 + V1 cover the material |
| A2 | chortkee.com — SP2L robot | https://chortkee.com/sp2l-poursamadi/ | P3 | Blocked / Not needed | — |
| A3 | TradingFinder SP2L indicator (MT5) | https://tradingfinder.com/products/indicators/mt5/sp2l-poursamadi-strategy-free-download/ | P3 | Blocked / Not needed | Its 1:1 RR and M1/M5 match W1, so it adds nothing |
| A4 | Virgool — installing the indicator | — | P3 | Not needed | — |

## C. Video lessons

| ID | Title | Platform / URL | Length | Priority | Transcript status | Raw file | Notes |
|----|-------|----------------|--------|----------|-------------------|----------|-------|
| V1 | "SP2L Strategy" — lesson 1 of the series | YouTube, probably 7HEC5mO3d3U (trader to confirm, Q20) | 01:09:17 | P1 | **Analysed** 2026-10-09 | `raw/videos/transcripts/V1-sp2l-strategy.fa.srt` + `.md` | Auto-captions. Note: `knowledge-base/source-notes/V1-video.md` |
| V2 | Gap video (P-Gap, E-Gap, common gap, morning gap) | Author's course / unknown | | **P1** | Pending | | Referenced at V1 00:31:38. Needed to define the P-Gap test (Q13) |
| V3 | Weekly report #19 (3rd leg; important levels) | Unknown | | P2 | Pending | | Referenced at V1 00:37:15, 00:46:44. Helps Q9, Q16 |
| V4 | Later SP2L lessons (time strategy; skipping the first entry) | Unknown — may not exist yet | | P2 | Pending | | Referenced at V1 00:45:47, 00:52:28 |
| V5 | Instagram highlights (money management, "2X" detail) | Author's Instagram | | P3 | Pending | | Referenced at V1 00:00:58, 00:41:57 |

## D. Transcripts

| ID | From video | File | Language | Translated | Status |
|----|------------|------|----------|------------|--------|
| T1 | V1 | `raw/videos/transcripts/V1-sp2l-strategy.fa.md` | fa (auto-captions) | Key statements translated in the source note; full translation on request | Done |

## E. Chart examples

| ID | Instrument / TF | Source | File | Status |
|----|-----------------|--------|------|--------|
| C1 | Schematic (bullish spike) | W1 image (see W1-img) | `raw/charts/C1-w1-chart.*` + `C1-w1-chart.md` | Pending |
| C2 | XAUUSD M1, 12 May (bearish spike at the open, 3 sells + 2X) | V1 00:16–00:24, 00:58–01:05 | `raw/charts/C2-v1-12may.md` | Pending — needs the trader's screenshot or description; captions alone are not enough |
| C3 | XAUUSD M1, 13 May morning (several bullish spikes from the 60 EMA; one "too wide" to take) | V1 00:48–00:58 | `raw/charts/C3-v1-13may.md` | Pending — same |

## F. Trader's own material

| ID | Item | Status | Notes |
|----|------|--------|-------|
| U1 | Trading preferences | Partly recorded | `../interview/trader-preferences.md` |
| U2 | Personal notes from the course | Pending | Ranks above third-party articles |
| U3 | Past SP2L trades (screenshots or a list) | Pending | Optional; used to validate the formalized rules against how the trader already trades |

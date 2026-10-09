# Project Status

Project: Learn, formalize, customize and build a personal MT5 (MQL5) Expert
Advisor for the SP2L (Spike–2Leg) strategy.

Last updated: 2026-10-09 (second update)

## Current phase

**Phase 2 — Knowledge base**, with Phase 3 (trader interview) starting in
parallel. The two primary sources (page W1, lesson video V1) are imported and
analysed. The rulebook has 11 sections populated with `[VERIFIED]` entries;
six rules still need a codable definition, and one source (the author's gap
video) is needed to settle the most important of them.

## Phases

| # | Phase | State | Exit criterion |
|---|-------|-------|----------------|
| 0 | Workspace setup | Done | — |
| 1 | Source collection | Mostly done | W1, V1 in. Still wanted: W1 chart image, gap video (V2), weekly report #19 (V3) |
| 2 | Knowledge base | In progress | Each rule `[VERIFIED]` or `[USER]`; `open-questions.md` has no Blocking items. Blocking now: Q13, Q14, Q18 |
| 3 | Trader interview | Starting | Every question in `interview/trader-preferences.md` answered |
| 4 | EA specification | Not started | Trader signs off a written spec |
| 5 | MQL5 implementation | Not started | EA compiles; Strategy Tester runs on XAUUSD |
| 6 | Backtest and review | Not started | Results reviewed with the trader |

## What is verified now (short form)

Spike = sharp move after a range, ≥3 candles, higher lows (or lower highs),
built on a valid breakout whose follow-through candle does not overlap the
breakout candle, and containing a P-Gap; no gap → no trade. Entry = limit
order at the previous candle's low (buy) / high (sell), placed as soon as the
spike is confirmed; the fill on the corrective candle is the "2nd-leg
activation". Optional add-on at 50% of the entry-to-SL distance. SL behind
the candle the spike started from, plus spread. TP1 = 1R default; TP2 exists.
M1/M5; gold, indices, majors; New York hours favoured. Skip very wide spikes,
third repetitions on one move, ranges. Set and forget; trades independent.

## Blockers

- **Network:** poursamadi.com and the third-party sites remain blocked; the
  trader supplies material (working well so far).
- **P-Gap definition (Q13):** the single biggest gap between "verified" and
  "codable". Needs the author's gap video or the W1 chart image, else a trader
  decision.
- **Sizing conflict (C1):** author sizes by stop distance; trader wants fixed
  lot. Trader decision pending.

## Next actions

1. Trader: answer the interview (first batch posted in chat and in
   `interview/trader-preferences.md`), confirm V1's identity, supply the W1
   chart image and, if available, the gap video transcript.
2. Claude: fold answers into `sp2l-rules.md`, close Q13/Q14/Q18, then draft
   the EA specification (`spec/ea-specification.md`) for sign-off.

## Change log

- 2026-10-09 — Workspace created. Strategy URL recorded. Search summaries
  logged as unverified. Transcript tooling added.
- 2026-10-09 — W1 page text and V1 captions received from the trader, filed
  verbatim, converted, read in full. Source notes written (21 statements from
  W1, 58 from V1). Rulebook populated. Open questions rewritten: 9 narrowed or
  resolved, 11 open, 3 of them blocking. Inventory updated with the videos and
  images the author references.

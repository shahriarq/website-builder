# Project Status

Project: Learn, formalize, customize and build a personal MT5 (MQL5) Expert
Advisor for the SP2L (Spike–2Leg) strategy.

Last updated: 2026-10-09

## Current phase

**Phase 1 — Source collection.** Waiting on the first source from the trader.

## Phases

| # | Phase | State | Exit criterion |
|---|-------|-------|----------------|
| 0 | Workspace setup | Done | This folder exists, committed and pushed |
| 1 | Source collection | In progress | Every row in `sources/INVENTORY.md` is Imported or marked Not needed |
| 2 | Knowledge base | Not started | Each rule in `sp2l-rules.md` is `[VERIFIED]` or `[USER]`; `open-questions.md` has no blocking items |
| 3 | Trader interview | Not started | `interview/trader-preferences.md` has an answer for every question |
| 4 | EA specification | Not started | Trader signs off a written spec: entries, exits, SL, TP, risk, filters, inputs |
| 5 | MQL5 implementation | Not started | EA compiles; Strategy Tester runs on XAUUSD without errors |
| 6 | Backtest and review | Not started | Results reviewed with the trader; parameters tuned |

## Known facts

### From the trader `[USER]`
- Strategy: SP2L by Mohammad Ali Poursamadi, taught at
  https://poursamadi.com/sp2l-strategy/ (page plus video lessons).
- The page's headlines are the structure to follow; entry, risk management,
  TP and SL are all covered there.
- Instrument and timeframe: Gold (XAUUSD), intraday.
- Risk model: fixed lot size.
- The trader will supply page text, transcripts and chart examples.

### From web-search summaries `[UNVERIFIED]`
Search-engine result summaries only. Claude did not open any of these pages.
Recorded so they can be checked against the real text, not as rules.
- SP2L stands for "Spike–2Leg"; described as price action following
  Power → Correction → Continuation.
- Three parts named: spike, 2nd leg, entry level.
- Entry is said to be in the spike's direction after the 2nd leg "activates".
- Said to work best when the spike breaks a key level (S/R, supply/demand)
  or starts at a channel floor or ceiling.
- High-volume sessions (New York) are mentioned as favourable.
- A third-party "SP2L" indicator exists (TradingFinder) that uses a fixed
  1:1 risk-reward and targets M1/M5. This is not the author's own material
  and will not be used as a rule source.

## Blockers

Network egress from this cloud environment is blocked for:
- poursamadi.com (the primary source)
- tradingfinder.com, copytrade.biz, chortkee.com (third-party articles)

Video content cannot be watched by Claude in any environment. Transcripts
are the route; see `transcripts/GUIDE.md`.

Decision `[USER]`: do not attempt to bypass the network policy. The trader
supplies source material.

## Next actions

1. Trader supplies the strategy page text (see request in conversation).
2. Claude files it under `sources/raw/website/`, analyses it, fills
   `knowledge-base/sp2l-rules.md` with `[VERIFIED]` entries, and lists gaps
   in `open-questions.md`.
3. Repeat for each video transcript and chart example.
4. Run the trader interview.
5. Draft the EA specification for sign-off.

## Change log

- 2026-10-09 — Workspace created. Strategy URL recorded. Search summaries
  logged as unverified. Transcript tooling added.

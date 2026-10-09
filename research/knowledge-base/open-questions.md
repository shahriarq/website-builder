# Open Questions

Rules that are missing, ambiguous, or in conflict. Each gets resolved by a
source citation or a trader decision, then moves to `sp2l-rules.md`.

Severity: **Blocking** (EA cannot be specified without it) · **Important**
(affects results, has a sensible default) · **Minor**.

Status: Open · Partly answered · Resolved.

## Resolved or narrowed by W1 + V1

| # | Question | Severity | Answer so far | Status |
|---|----------|----------|---------------|--------|
| Q1 | Exact definition of a spike | Blocking | Sharp move after a range; ≥3 candles; higher lows (or lower highs); valid breakout with non-overlapping follow-through; contains a P-Gap. Upper size limit still by eye ("very wide → skip"). (W1-2..4, V1-1..13) | Partly answered — numeric max width needed from trader |
| Q2 | Maximum correction depth | Blocking | Implicit: SL at spike origin voids the setup; 50% add-on implies half-way is still valid. No other limit stated. (V1-22, W1-8) | Resolved as "SL is the limit"; trader may add a tighter one |
| Q3 | What "activation" of the 2nd leg means | Blocking | Corrective candle hits the previous candle's low/high. (W1-6/7, V1-19) | Partly answered — see Q14 for "which previous candle" |
| Q4 | Entry: order type and price | Blocking | Limit order at the previous candle's low/high; placed within the first 3 spike candles. (V1-19..21) | Resolved except the trailing rule (Q14) |
| Q5 | SL placement and buffer | Blocking | Behind the candle where the spike started; allow for spread. Exact reference candle extreme and buffer size not given. (W1-11, V1-22, V1-26) | Partly answered |
| Q6 | TP rule | Blocking | TP1 = 1R default; TP2 exists, distance not stated (likely 2R). (W1-12/13, V1-29) | Partly answered |
| Q7 | Timeframe | Important | M1 (author), M5 acceptable, M15 if needed. (W1-20, V1-41..43) | Resolved — trader picks M1 or M5 |
| Q8 | Session filter | Important | NY favoured; author starts 07:00 broker; European opens 09–11 can gap against. (W1-17, V1-46..48) | Trader decides window + timezone |
| Q9 | Must the spike break a level? | Blocking | Not mandatory; listed under "best conditions" with channel edge and HTF alignment. (W1-14..16, V1-44, V1-53) | Resolved as optional — trader decides whether to code any |
| Q12 | Which videos exist | Blocking for Phase 1 | One video on W1 (YouTube 7HEC5mO3d3U). V1 is "lesson 1 of up to 12". Author references a gap video, weekly report #19, Instagram highlights, later videos. | Partly answered — trader to confirm identity and availability |

## Still open

| # | Question | Severity | Where the answer should come from | Status |
|---|----------|----------|-----------------------------------|--------|
| Q10 | Fixed lot: what size? Same lot on the 2X entry, or double (equal $ risk, as the author does)? Half size on lower-probability setups? Max trades/day, daily loss cap? | Important | Trader interview | Open |
| Q11 | Break-even / trailing / time stop: none stated; author exits on stall by discretion | Important | Trader decides defaults; EA inputs | Open |
| Q13 | **P-Gap test for code.** Candidates: (a) low of candle *i+1* above high of candle *i−1* (Brooks-style micro gap, two candles apart); (b) low of candle *i+1* above high of candle *i* (true range gap, rare on M1); (c) body-to-body gap. V1-6 ("next candle does not overlap the breakout candle") and V1-9 point at a slide. | **Blocking** | Author's gap video (P-Gap / E-Gap / common / morning); the W1 chart image; else trader decides | Open |
| Q14 | "Previous candle" for the entry level: the last spike candle at order time, with the limit trailed to each new higher low until filled or cancelled? When is a pending order cancelled (N candles, spike broken, session end)? | **Blocking** | Trader (author drags the order by hand, V1-23) | Open |
| Q15 | Include the 60 EMA (M1) equilibrium filter and the 250/500/1000-point round-level filter? As hard filters or as optional inputs? | Important | Trader | Open |
| Q16 | "Third occurrence on the same move → E-Gap, skip": how does code define "same move"? (e.g. no return to the 60 EMA between occurrences, V1-49) | Important | Trader; weekly report #19 may help | Open |
| Q17 | "Signal bar / key bar" confirmation inside the spike — is it already satisfied by breakout + follow-through, or an extra candle pattern? | Important | Author's course material; trader | Open |
| Q18 | SL reference: low/high of the breakout candle itself, or of the last range candle before it? Buffer: spread only, or spread + N points? | Blocking | W1 chart image; trader | Open |
| Q19 | Hedging vs netting account; the 2X add-on and simultaneous opposite setups behave differently | Important | Trader (broker account type) | Open |
| Q20 | Is the SRT (V1) the YouTube video 7HEC5mO3d3U embedded on W1? The page capture labels it "Video 3", the author calls it the first lesson | Minor | Trader | Open |

## Conflicts

| # | Source A says | Source B says | Resolution |
|---|---------------|---------------|------------|
| C1 | Author: lot scaled to stop distance; equal $ risk on both entries (V1-31, V1-28) | Trader: fixed lot `[USER]` | Trader decides (Q10). EA can expose both modes |
| C2 | Page: TP default 1:1 (W1-12) | Video: TP1 or TP2; author uses TP1 (V1-29) | Not a conflict: TP1 default, TP2 optional (Q6 for distance) |
| C3 | Set and forget, stick to SL/TP (V1-34, V1-40) | Author exits early on stall (V1-39) | Discretion. EA default: no early exit; optional time stop (Q11) |

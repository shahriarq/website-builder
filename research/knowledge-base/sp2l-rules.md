# SP2L Rulebook

Built from W1 (the author's strategy page) and V1 (lesson 1 video, auto-captions).
Section headings follow the page's own structure. Statement IDs (W1-n, V1-n)
point into `source-notes/`.

Tag legend: `[VERIFIED]` source text on file · `[USER]` trader's word ·
`[UNVERIFIED]` third-party or search summary · `[ASSUMPTION]` Claude's
reading, needs confirmation · `[PENDING]` not yet researched.

A rule marked **CODABLE** has an unambiguous test an EA can run. A rule
marked **NEEDS DEFINITION** is verified as the author's intent but has no
numeric or structural test yet; see `open-questions.md`.

---

## 0. Overview — قدرت ← اصلاح ← ادامه

- `[VERIFIED]` SP2L = Spike – 2 Leg. Logic: Power → Correction →
  Continuation. Three parts: Spike, 2nd Leg, Level. (W1-1)
- `[VERIFIED]` "2L" is the AB=CD / two-leg idea applied at candle level: after
  a spike we expect a correction, then a second leg equal to the first.
  (V1-16)
- `[VERIFIED]` Rationale: the participants who drove the spike will defend its
  origin; the spike's range becomes the entry zone. (V1-15)
- `[VERIFIED]` Author's framing of what a strategy must be: pre-planned, backtestable,
  identical reaction to identical setups, set-and-forget. (V1-55, V1-56, V1-34)

## 1. اسپایک (Spike)

- `[VERIFIED]` A powerful, sudden move of usually several large candles in one
  direction. (W1-2)
- `[VERIFIED]` It follows a range, which can be as short as a few overlapping
  candles. (V1-1)
- `[VERIFIED]` **Validity condition:** a valid spike contains a **P-Gap**
  (pressure gap) between candles. A sharp move without a gap is not a valid
  SP2L spike. (W1-3, W1-4, W1-21, V1-7) — **NEEDS DEFINITION** of the gap
  test (Q13).
- `[VERIFIED]` The spike sits on a **valid breakout**: a candle closes beyond
  the prior candle's high (for a bullish spike), and the following candle
  (follow-through / key bar) closes higher and does **not overlap** the
  breakout candle. Overlap means a channel, not a spike. (V1-5, V1-6, V1-8)
  — CODABLE once Q13 fixes the overlap/gap test.
- `[VERIFIED]` Internal structure: successive higher lows (bullish) or lower
  highs (bearish). (V1-2, V1-18)
- `[VERIFIED]` Three candles are enough to count as a spike/trend; four are not
  required. (V1-10) — CODABLE: minimum 3 candles.
- `[VERIFIED]` Three variants are all accepted and treated identically:
  (A) gap at the breakout, then higher lows; (B) higher lows first, then the
  gap; (C) three candles and the very next candle begins the correction.
  (V1-11, V1-12)
- `[VERIFIED]` Quality reducers: long shadows and overlapping candles (a
  channel in disguise). (V1-3, V1-4)
- `[VERIFIED]` Skip very wide spikes (example given: ten higher lows). (V1-13)
  — **NEEDS DEFINITION**: numeric maximum (Q1).
- `[VERIFIED]` Skip the third occurrence of the pattern on the same move; it is
  probably an exhaustion gap (E-Gap). (V1-14) — **NEEDS DEFINITION** of
  "same move" for code (Q16).

## 2. اصلاح (Correction)

- `[VERIFIED]` After the spike the market usually corrects briefly ("اصلاح
  کوتاه"). (W1-5, page intro)
- `[VERIFIED]` The correction is defined by the first candle that trades below
  the previous candle's low (bullish case) / above the previous candle's
  high (bearish). (W1-6, W1-7, V1-19)
- `[VERIFIED]` Maximum depth is implicit: if price returns to the spike's
  origin, the scenario is void (that is where the SL sits). (V1-22)
- `[ASSUMPTION]` No other depth limit exists between entry and SL; the 50%
  supplementary entry presumes price may travel half-way to the SL and still
  be valid. (from W1-8)

## 3. لگ دوم (2nd Leg)

- `[VERIFIED]` "Activation" of the 2nd leg = the corrective candle hitting the
  previous candle's low (bullish) / high (bearish). The entry is taken on
  that activation, in the spike's direction. (W1-6, W1-7, W1-9)
- `[VERIFIED]` Expected size: leg 2 ≈ leg 1. The target is the end of leg 2.
  (V1-16, V1-17)
- `[VERIFIED]` A third leg is a separate entry in a different style (weekly
  report #19), out of scope for SP2L proper. (V1-17)
- `[ASSUMPTION]` Because the SL is at the spike origin and the entry is near
  the spike's top, the 1R target approximates "leg 2 = leg 1" measured from
  the entry. This is why TP default 1:1 and "leg 2 equals leg 1" are the same
  rule stated two ways. Confirm with the author's chart image (Q6).

## 4. سطح ورود (Level) — ورود

- `[VERIFIED]` Direction: Buy after a bullish spike, Sell after a bearish
  spike. (W1-10)
- `[VERIFIED]` Order type: a pre-placed **limit order** (buy limit below price /
  sell limit above) or a manual entry when the level is hit. (V1-19, V1-21,
  V1-34)
- `[VERIFIED]` Entry price: the low of the previous candle (bullish) / the
  high of the previous candle (bearish). (W1-6, W1-7) — **NEEDS DEFINITION**:
  which candle is "previous" (Q3), and how the pending order is trailed as
  the spike extends (Q14).
- `[VERIFIED]` Timing of placement: as soon as the breakout + non-overlapping
  follow-through + gap are visible (within the first three spike candles),
  without waiting for a further candle. (V1-20)
- `[VERIFIED]` If the spike extends before the fill, the author drags the same
  order up to the new level (small change) or re-places it with a new volume
  (large change). (V1-23)
- `[VERIFIED]` **Supplementary entry ("2X"):** an additional position at 50%
  of the entry-to-SL distance. It improves the average entry; its reward to
  TP1 is 3R against its own stop. (W1-8, V1-27, V1-28)
- `[VERIFIED]` A signal bar / key bar inside the spike is an entry
  confirmation the author looks for. (V1-24) — **NEEDS DEFINITION** (Q17;
  may be covered by the breakout/follow-through test already).

## 5. حد ضرر — SL

- `[VERIFIED]` Behind the candle from which the spike started. (W1-11)
- `[VERIFIED]` Equivalent statement: at the spike's origin, because a return
  there voids the scenario. (V1-22, V1-25)
- `[VERIFIED]` Known before the fill: the limit order makes entry-to-SL
  distance fixed in advance. (V1-21)
- `[VERIFIED]` Allow for spread. (V1-26) — **NEEDS DEFINITION**: buffer in
  points (Q5).
- `[VERIFIED]` The stop is relatively large for this strategy (reason the
  author prefers TP1). (V1-29)
- **NEEDS DEFINITION**: "behind the candle" = that candle's low/high, or the
  low/high of the range candle before it (Q5).

## 6. حد سود — TP

- `[VERIFIED]` Default TP = 1:1 risk-to-reward (TP1). (W1-12)
- `[VERIFIED]` TP2 exists (chart image legend; "R2" in the live trade). The
  author personally uses TP1 because the 2X entry already enlarges the gain.
  (W1-13, V1-29) — **NEEDS DEFINITION**: TP2 distance, presumably 2R (Q6).
- `[VERIFIED]` Partial close at target is an option; the author usually closes
  all. (V1-38)

## 7. مدیریت سرمایه (Risk and money management)

- `[USER]` Position sizing: fixed lot. (chat 2026-10-09)
- `[VERIFIED]` Author's practice differs: volume scaled to stop distance
  (smaller stop → larger lot), equal dollar risk on the first and the 2X
  entry, and half risk on lower-probability setups. (V1-31, V1-28, V1-32)
  → **Conflict C1**, trader decides (Q10).
- `[VERIFIED]` Good money management is the strategy's first priority. (V1-24)
- `[VERIFIED]` Each trade is managed independently: never move one trade's
  stop because another hit target. (V1-35)
- `[VERIFIED]` Accept loss streaks; the edge is risk distribution, not win
  rate. (V1-57)
- `[VERIFIED]` Backtest at least 50–100 trades before trusting the method.
  (V1-30, W1-18)

## 8. بازار، تایم‌فریم، سشن و فیلترها

- `[USER]` Instrument: XAUUSD, intraday. (chat 2026-10-09)
- `[VERIFIED]` Markets: any, best on volatile ones — gold, indices, majors.
  (W1-19)
- `[VERIFIED]` Timeframe: M1 and M5 (author trades M1, at most M5); M5 or
  M15 if M1 is too fast for the trader. (W1-20, V1-41, V1-42, V1-43)
- `[VERIFIED]` Sessions: high-volume sessions, New York named; the author
  starts at 07:00 broker time and warns that European opens (09:00–11:00
  broker) can gap against a setup. (W1-17, V1-46, V1-47, V1-48)
  — **NEEDS DEFINITION**: trading window for the EA (Q8).
- `[VERIFIED]` Best conditions: spike breaks an important level (S/R,
  supply/demand); spike starts from a channel floor/ceiling; spike direction
  agrees with the higher-timeframe trend. (W1-14, W1-15, W1-16)
  — **NEEDS DEFINITION** for code (Q9).
- `[VERIFIED]` Context tools the author uses, presented as optional:
  60 EMA on M1 as "equilibrium price" (wait for price to return to it before
  the next setup); round levels every 250 / 500 / 1000 points on gold.
  (V1-49, V1-50, V1-44, V1-45) — trader decides whether to include (Q15).
- `[VERIFIED]` Do not trade inside ranges / overlapping "dirty" candles.
  (V1-51) — overlaps with the spike validity test.
- `[VERIFIED]` SP2L can serve as the trigger inside another method (MA,
  cycles, channel). (V1-52)

## 9. مدیریت معامله (Trade management after entry)

- `[VERIFIED]` Set and forget; stick to the TP and SL. (V1-34, V1-40)
- `[VERIFIED]` No early closing on fear; outcome unknown per trade. (V1-36)
- `[VERIFIED]` Author's discretion seen in the video, **not** stated as rules:
  exiting when the move stalls for a long time; running the last position
  past TP1. (V1-37, V1-39) → optional time-stop input (Q11).
- `[PENDING]` Break-even and trailing: not mentioned in W1 or V1.

## 10. مثال‌ها (Worked examples)

- `[PENDING]` W1 chart image (bullish spike with Entry/SL/TP1/TP2) — not
  supplied. (W1-13)
- `[VERIFIED]` V1 live examples, gold M1, 12–13 May: a bearish spike at the
  open, entries on lower highs, 2X add, TP1 reached; day result about 2.5–3R
  gained vs 0.5–1R risked. Not reconstructible to the candle from captions.
  (V1-33 and 00:16–00:24, 00:48–01:05)

## 11. استثناها و هشدارها (Exceptions and warnings)

- `[VERIFIED]` No gap → no trade. (W1-4)
- `[VERIFIED]` Overlapping candles / long shadows → channel, not spike. (V1-4)
- `[VERIFIED]` Very wide spike → prefer not to enter. (V1-13)
- `[VERIFIED]` Third repetition on the same move → likely E-Gap, skip. (V1-14)
- `[VERIFIED]` Ranges / dirty candles → stay out. (V1-51)
- `[VERIFIED]` Define your own exact entry conditions and take only those;
  backtest first. (W1-18, V1-30)
- `[VERIFIED]` Beware confirmation bias; the system has losses. (00:58:06)

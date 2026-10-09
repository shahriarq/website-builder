# Trader Preferences and Interview

**Recorded** holds what the trader has already said, with the date.
**Interview** is the question list. Section C was written after W1 and V1
were analysed; it covers exactly the rules the author leaves to the trader
or states only by eye. Answers are appended under each question with the date
and then folded into `knowledge-base/sp2l-rules.md` as `[USER]`.

## Recorded `[USER]`

| Topic | Answer | Date |
|-------|--------|------|
| Strategy | SP2L (Spike–2Leg), Poursamadi; learn from https://poursamadi.com/sp2l-strategy/ and its videos | 2026-10-09 |
| Instrument | Gold, XAUUSD | 2026-10-09 |
| Horizon | Intraday | 2026-10-09 |
| Position sizing | Fixed lot size (value not yet given) | 2026-10-09 |
| Deliverable order | No preference stated | 2026-10-09 |
| Trading style today | No preference stated | 2026-10-09 |
| Network | Do not bypass the cloud environment's restrictions; trader supplies sources | 2026-10-09 |
| Method | Verified facts, trader instructions and assumptions kept distinct; no rules from overviews alone | 2026-10-09 |

## Interview

Answer in any order, in Persian or English. "Same as the author" is a valid
answer wherever the author's practice is quoted. "Make it an input" means the
EA gets a parameter with the author's value as default.

### C. Rule choices the sources leave open — first batch (blocking)

**C1. P-Gap test (Q13).** The author shows the gap on a slide but never says
which two candles. For a bullish spike with candles …, i−1, i, i+1, … which
do you use when you trade by eye?
  - (a) low of i+1 is above the high of i−1 (a gap across the middle candle,
    Al Brooks' "micro gap") — the most common meaning in price-action teaching
  - (b) low of i+1 is above the high of i (a true gap between consecutive
    candle ranges; rare on M1 gold)
  - (c) bodies only: open of i+1 above the close of i, or similar
  - (d) you are not sure — then the author's gap video decides, or we backtest
    (a) and (b) and you choose.
  Also: must the gap be present at the breakout candle, or anywhere inside the
  spike (the author accepts both variants A and B)?

**C2. Entry level and order trailing (Q14).** The limit sits at "the previous
candle's low". As the spike keeps printing higher lows before the fill, the
author drags the order up by hand (V1 00:39:37). For the EA:
  - trail the pending order to each new candle's low until it fills? (yes/no)
  - cancel the pending order after how many candles without a fill, or when
    the spike's structure breaks (a candle closes below the prior low without
    filling, impossible by construction, so really: after N candles)?
  - cancel at session end? (yes/no)

**C3. Stop-loss reference and buffer (Q18).** "Behind the candle the spike
started from." Is that
  - (a) the low of the breakout candle itself, or
  - (b) the low of the last range candle before the breakout, or
  - (c) the lowest low of the range the spike broke out of?
  Buffer: spread only (the author's words), or spread + N points? Give N.

**C4. Take-profit (Q6).** TP1 = 1R is the default. Do you want
  - TP1 only (author's own practice), or
  - TP2 as an optional second target, and at what multiple (2R?), or
  - partial close at TP1 and run the rest to TP2?

**C5. Supplementary "2X" entry (W1-8).** Use it? If yes: same lot as the
first entry, or double the lot so the dollar risk is equal (author's example)?
Should it be a pending limit placed together with the first order, or added
only after the first fills?

### C (continued) — second batch (important, have defaults)

**C6. Spike size limits (Q1).** Minimum candles: author says 3. Maximum: "very
wide → skip" (example: ten higher lows). Give numbers: max candles, and/or max
spike height in points or as a multiple of ATR. Or "no max, I'll decide after
backtest".

**C7. Third-occurrence rule (Q16).** Skip the third SP2L signal on the same
move. How should the EA know it is the same move? Suggested: count signals
since price last touched the 60 EMA (author's "equilibrium"). Accept, or
propose another reset condition, or drop the rule.

**C8. Context filters (Q15).** Which of these do you want, and as hard filter
or optional input (default off)?
  - 60 EMA on M1: only take buys when price is above it / sells below it
  - round-level filter: spike must break a 250 / 500 / 1000-point level
  - higher-timeframe trend alignment (which TF, which definition)
  - "clean market" filter (reject if the N candles before the spike overlap
    heavily — needs a threshold)

**C9. Sizing (Q10, conflict C1).** You said fixed lot. The author sizes by
stop distance and risks equal dollars on both entries. Options:
  - fixed lot everywhere (your stated preference) — give the lot size
  - fixed lot, but an optional %-risk mode as an input, default off
  - author's way.
  Also: max simultaneous positions, max trades per day, daily loss cap (in $
  or R) that stops the EA for the day.

**C10. Time stop (Q11, conflict C3).** The author exits by discretion when a
trade stalls. Options: none (pure set-and-forget), or close after N candles
if TP1 is not reached, or close at a fixed time (session end). Choose and
give N / the time.

**C11. Break-even / trailing (Q11).** Not in the sources. Keep none, or add
move-SL-to-break-even at 1R when running to TP2?

### A. Account and execution

**A1.** Broker and server timezone (UTC offset in summer and winter).
**A2.** Account type: hedging or netting? (affects the 2X add-on)
**A3.** Typical XAUUSD spread at your broker in the hours you trade; maximum
spread at which the EA may still place an order.
**A4.** Lot size (see C9). Minimum lot and lot step at your broker.

### B. Timeframes and sessions

**B1.** Chart timeframe for the EA: M1 (author) or M5 (also endorsed)?
**B2.** Trading window in broker time. The author starts 07:00, warns about
09:00–11:00 opens, favours New York. Give start/end, or several windows.
**B3.** News filter: none, or block N minutes around high-impact USD news?

### D. Discretion vs. automation

**D1.** Which SP2L judgments do you make by eye today that you would rather
keep for yourself? For each: should the EA trade it automatically, or only
alert you (push notification / chart arrow) and let you click?
**D2.** Would you accept fewer trades for stricter, fully objective rules?

### E. Materials still wanted

**E1.** Confirm: is the SRT you sent the YouTube video 7HEC5mO3d3U embedded on
the page? (The page labels it "Video 3"; the author calls it the first lesson.)
**E2.** The page's chart image (Entry / SL / TP1 / TP2 drawing): screenshot or
the image file.
**E3.** The author's gap video (P-Gap / E-Gap) — captions via DownSub as
before, if you have access.
**E4.** Weekly report #19 (levels, third leg) — same, lower priority.
**E5.** Any of your own notes or past SP2L trades.

### F. Testing and rollout

**F1.** How much M1 history does your MT5 have for XAUUSD, and is it tick or
M1 OHLC? (decides backtest realism)
**F2.** Demo forward-test length before live.
**F3.** What result would make you say the EA trades SP2L the way you do?
(This becomes the acceptance test.)

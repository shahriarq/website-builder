# Trader Preferences and Interview

Two parts. **Recorded** holds what the trader has already said, with the
date. **Interview** is the question list to run after the knowledge base is
filled (Phase 3) and before the EA specification is drafted. Questions will be
added or removed as the sources reveal what the author leaves to the trader.

## Recorded `[USER]`

| Topic | Answer | Date |
|-------|--------|------|
| Strategy | SP2L (Spike–2Leg), Poursamadi; learn from https://poursamadi.com/sp2l-strategy/ and its videos | 2026-10-09 |
| Instrument | Gold, XAUUSD | 2026-10-09 |
| Horizon | Intraday | 2026-10-09 |
| Position sizing | Fixed lot size (value not yet given) | 2026-10-09 |
| Deliverable order | No preference stated between "spec then EA" and other orders | 2026-10-09 |
| Trading style today | No preference stated | 2026-10-09 |
| Network | Do not bypass the cloud environment's restrictions; trader supplies sources | 2026-10-09 |
| Method | Verified facts, trader instructions and assumptions must be kept distinct | 2026-10-09 |

## Interview (to run in Phase 3)

### A. Account and execution
1. Broker, account type (hedging or netting), and leverage.
2. Fixed lot size to use. Should the EA also offer %-risk sizing as an
   optional input, defaulted off?
3. Maximum simultaneous positions. Maximum trades per day.
4. Daily loss limit or daily profit target that stops trading.
5. Acceptable spread and slippage on XAUUSD before an entry is skipped.

### B. Timeframes and sessions
6. Which chart timeframe(s) do you trade SP2L on for gold? Does the author's
   recommendation (from the sources) match, or do you deviate?
7. Trading hours in your local timezone and the broker's server timezone.
   Trade all sessions or only specific ones?
8. Avoid news? Which events, how many minutes before and after?

### C. Rule choices the author leaves open
*(filled in once `open-questions.md` shows which rules have no single
answer in the sources)*
9. …

### D. Trade management
10. Move SL to break-even? At what point?
11. Trail the stop? By what rule?
12. Partial close at an intermediate target?
13. Close all positions at a set time (end of session / before weekend)?

### E. Discretion vs. automation
14. Which parts of SP2L do you judge by eye today (e.g. "is this spike
    strong enough", "is this level significant")? For each one: should the
    EA decide, or should it alert you and let you confirm?
15. Would you accept fewer trades for stricter, more objective rules?

### F. Testing and rollout
16. Backtest period and data quality available in your MT5.
17. Demo-forward-test duration before live.
18. What result would make you say the EA matches how you trade SP2L by
    hand? (This becomes the acceptance test.)

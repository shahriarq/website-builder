# SP2L Research Workspace

Working area for learning, formalizing and customizing the SP2L (Spike–2Leg)
strategy before any MQL5 code is written.

Primary strategy page (not yet read by Claude; contents pending):
https://poursamadi.com/sp2l-strategy/

## Layout

| Path | Purpose |
|------|---------|
| `STATUS.md` | Project phases, what is done, what is next, blockers |
| `sources/INVENTORY.md` | Every source we know of, with its import status |
| `sources/raw/` | Verbatim material supplied by the trader (page text, transcripts, chart notes). Never edited by Claude |
| `knowledge-base/sp2l-rules.md` | The strategy rulebook. Every statement carries an evidence tag and a source reference |
| `knowledge-base/glossary.md` | Terms, with Persian originals where known |
| `knowledge-base/open-questions.md` | Rules that are missing, ambiguous or conflicting |
| `transcripts/GUIDE.md` | How to import video transcripts and keep timestamps |
| `interview/trader-preferences.md` | The trader's own preferences and the interview still to run |
| `tools/transcript_to_md.py` | Converts SRT/VTT subtitle files to timestamped Markdown |
| `templates/` | Blank templates for source notes and chart examples |

## Evidence tags

Every claim in the knowledge base is tagged. The tags are the point of this
workspace: nothing reaches the EA specification without a `[VERIFIED]` or
`[USER]` tag.

| Tag | Meaning |
|-----|---------|
| `[VERIFIED]` | Taken from source text that is stored in `sources/raw/` and cited by file and section or timestamp |
| `[USER]` | An instruction, preference or confirmation given by the trader in conversation |
| `[UNVERIFIED]` | Came from a search-engine summary or a third-party description. Not read directly. Must not drive any rule |
| `[ASSUMPTION]` | Claude's inference to fill a gap. Must be confirmed by the trader before use |
| `[PENDING]` | Known to exist in a source, not yet imported |

## Ground rules

1. Claude has not accessed the strategy page or any video. All page content is
   `[PENDING]` until the trader supplies text or verified notes.
2. No trading rule is implemented from an overview alone. The EA specification
   is drafted only after the knowledge base is complete and the trader
   interview is done.
3. Files under `sources/raw/` are the trader's material, kept verbatim.
   Analysis lives in `knowledge-base/`.
4. The cloud environment's network policy is respected. Blocked sites are
   listed in `STATUS.md`; the trader supplies their content.

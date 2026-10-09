#!/usr/bin/env python3
"""Convert an SRT or WebVTT subtitle file into timestamped Markdown.

Cues are merged into paragraphs of roughly ``--window`` seconds, with a new
paragraph forced after any silence longer than ``--max-gap`` seconds. Every
paragraph begins with the ``[HH:MM:SS]`` start time of its first cue, so a
rule drawn from the transcript can be cited to the second.

Usage:
    transcript_to_md.py V1-intro.fa.srt [--window 30] [--out V1-intro.fa.md]

The output is written next to the input with a ``.md`` extension unless
``--out`` is given. Duplicate consecutive lines (common in auto-generated
YouTube VTT, which repeats the rolling caption) are collapsed.
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path

TIME_RE = re.compile(
    r"(?P<h>\d{1,2}):(?P<m>\d{2}):(?P<s>\d{2})[.,](?P<ms>\d{1,3})"
    r"|(?P<m2>\d{1,2}):(?P<s2>\d{2})[.,](?P<ms2>\d{1,3})"
)
CUE_LINE_RE = re.compile(r"(?P<start>[\d:.,]+)\s*-->\s*(?P<end>[\d:.,]+)")
TAG_RE = re.compile(r"<[^>]+>")  # VTT inline tags like <c>, <00:00:01.000>


@dataclass
class Cue:
    start: float
    end: float
    text: str


def parse_time(token: str) -> float:
    m = TIME_RE.fullmatch(token.strip())
    if not m:
        raise ValueError(f"unrecognised timestamp: {token!r}")
    if m.group("h") is not None:
        h, mi, s, ms = m.group("h", "m", "s", "ms")
    else:
        h, mi, s, ms = "0", *m.group("m2", "s2", "ms2")
    return int(h) * 3600 + int(mi) * 60 + int(s) + int(ms.ljust(3, "0")) / 1000


def fmt_time(seconds: float) -> str:
    total = int(seconds)
    return f"{total // 3600:02d}:{(total % 3600) // 60:02d}:{total % 60:02d}"


def clean_text(line: str) -> str:
    line = TAG_RE.sub("", line)
    line = line.replace("&nbsp;", " ").replace("&amp;", "&")
    line = line.replace("&lt;", "<").replace("&gt;", ">")
    return re.sub(r"\s+", " ", line).strip()


def parse_subtitles(raw: str) -> list[Cue]:
    lines = raw.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    cues: list[Cue] = []
    i = 0
    while i < len(lines):
        m = CUE_LINE_RE.search(lines[i])
        if not m:
            i += 1
            continue
        start, end = parse_time(m.group("start")), parse_time(m.group("end"))
        i += 1
        body: list[str] = []
        while i < len(lines) and lines[i].strip():
            body.append(clean_text(lines[i]))
            i += 1
        text = " ".join(t for t in body if t)
        if text:
            cues.append(Cue(start, end, text))
    return cues


def dedupe(cues: list[Cue]) -> list[Cue]:
    """Drop a cue whose text repeats, or is contained in, the previous cue."""
    out: list[Cue] = []
    for cue in cues:
        if out and (cue.text == out[-1].text or cue.text in out[-1].text):
            out[-1].end = max(out[-1].end, cue.end)
            continue
        if out and cue.text.startswith(out[-1].text):  # rolling caption
            out[-1].text = cue.text
            out[-1].end = max(out[-1].end, cue.end)
            continue
        out.append(Cue(cue.start, cue.end, cue.text))
    return out


def to_paragraphs(cues: list[Cue], window: float, max_gap: float) -> list[tuple[float, str]]:
    """Group cues into paragraphs.

    A new paragraph starts when the current one already spans ``window``
    seconds, or when there is a silence longer than ``max_gap`` before the
    next cue (a pause, a chart being drawn, a topic change).
    """
    paragraphs: list[tuple[float, str]] = []
    buf: list[str] = []
    para_start = 0.0
    last_end = 0.0
    for cue in cues:
        if buf and (cue.end - para_start >= window or cue.start - last_end > max_gap):
            paragraphs.append((para_start, " ".join(buf)))
            buf = []
        if not buf:
            para_start = cue.start
        buf.append(cue.text)
        last_end = cue.end
    if buf:
        paragraphs.append((para_start, " ".join(buf)))
    return paragraphs


def render(src: Path, paragraphs: list[tuple[float, str]], total: float) -> str:
    head = [
        f"# Transcript: {src.stem}",
        "",
        f"Source file: `{src.name}`  ",
        f"Duration (last cue end): {fmt_time(total)}  ",
        f"Paragraphs: {len(paragraphs)}",
        "",
        "Timestamps are the start of each paragraph. Cite rules as "
        "`(V<n> HH:MM:SS)`.",
        "",
        "---",
        "",
    ]
    body = [f"**[{fmt_time(t)}]** {text}\n" for t, text in paragraphs]
    return "\n".join(head + body)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("subtitle", type=Path, help="input .srt or .vtt file")
    ap.add_argument("--window", type=float, default=30.0,
                    help="target paragraph length in seconds (default 30)")
    ap.add_argument("--max-gap", type=float, default=4.0,
                    help="silence in seconds that forces a new paragraph (default 4)")
    ap.add_argument("--out", type=Path, help="output .md path")
    args = ap.parse_args(argv)

    raw = args.subtitle.read_text(encoding="utf-8-sig")
    cues = dedupe(parse_subtitles(raw))
    if not cues:
        print(f"no cues found in {args.subtitle}", file=sys.stderr)
        return 1
    paragraphs = to_paragraphs(cues, args.window, args.max_gap)
    out = args.out or args.subtitle.with_suffix(".md")
    out.write_text(render(args.subtitle, paragraphs, cues[-1].end), encoding="utf-8")
    print(f"wrote {out} ({len(cues)} cues -> {len(paragraphs)} paragraphs)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

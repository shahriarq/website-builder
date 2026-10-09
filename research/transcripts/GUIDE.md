# Importing Video Transcripts

Claude cannot watch video. The videos reach the knowledge base as text with
timestamps, so every rule can be cited as `(V1 00:12:34)` and re-checked
later against the video itself.

## Recommended route: subtitle files (SRT or VTT)

Subtitle files already carry start/end times for every line, so timestamps
survive without any manual work. This is the preferred format.

### If the video is on YouTube

On your own computer, with [yt-dlp](https://github.com/yt-dlp/yt-dlp)
installed:

```bash
# Auto-generated or uploaded Persian subtitles, no video download
yt-dlp --write-subs --write-auto-subs --sub-langs "fa,en" --skip-download \
       --sub-format "srt/vtt" -o "V1-%(title)s.%(ext)s" "<VIDEO_URL>"
```

This produces `V1-<title>.fa.srt` (or `.vtt`). Commit it to
`research/sources/raw/videos/transcripts/`.

### If the video is on Aparat or hosted on the site itself

These usually have no subtitle track. Two options:

1. **Local speech-to-text (best quality).** Download the audio, then run
   [Whisper](https://github.com/openai/whisper) or
   [faster-whisper](https://github.com/SYSTRAN/faster-whisper) on your
   machine:
   ```bash
   yt-dlp -x --audio-format mp3 -o "V1.%(ext)s" "<VIDEO_URL>"
   whisper V1.mp3 --language fa --model medium --output_format srt
   ```
   Whisper's `medium` or `large` model handles Persian reasonably; `small`
   is noticeably worse. Output is `V1.srt`.
2. **Browser-based transcription.** Any service that exports SRT/VTT is
   fine. Avoid services that export plain text only, since the timestamps
   are lost.

### What to do with the file

1. Save it as `research/sources/raw/videos/transcripts/V<n>-<short-title>.fa.srt`
   (`.vtt` is fine too). Add a row to `sources/INVENTORY.md` section C.
2. Run the converter (Claude can do this once the file is in the repo):
   ```bash
   python3 research/tools/transcript_to_md.py \
       research/sources/raw/videos/transcripts/V1-intro.fa.srt
   ```
   It writes `V1-intro.fa.md` next to the source: paragraphs of about 30
   seconds each, every paragraph starting with its `[HH:MM:SS]` marker.
   Options: `--window 20` for shorter paragraphs, `--out <path>` to choose
   the destination.
3. Claude analyses the `.md`, adds English translation beneath each
   paragraph in a separate `*.en.md` file, and files rules into
   `knowledge-base/sp2l-rules.md` with `(V1 HH:MM:SS)` citations.

## Fallback: manual timestamped notes

If no transcript is possible, write notes while watching. Keep one line per
point, prefixed with the time shown in the player:

```
[00:03:10] Spike must have at least N candles in one direction.
[00:04:45] He draws the entry at ... (describe what is drawn).
[00:06:20] Chart example: XAUUSD M5, date on screen ...
```

Save as `V<n>-<title>.notes.md` in the same folder. Mark it clearly as notes,
not transcript, in the inventory; rules cited only to notes get `[VERIFIED]`
with a "(trader notes)" qualifier, since they are the trader's reading of
the lesson rather than the author's exact words.

## Chart examples inside videos

When the author shows a chart, record it with `templates/chart-example.md`:
instrument, timeframe, approximate date if visible, and the geometry in words
(where the spike starts and ends, how deep the correction is, where the entry,
SL and TP are drawn). A screenshot alone cannot be read by Claude in this
environment with certainty; the written description is what gets used.

## What not to send

- Video files or audio files: Claude cannot process them here.
- Plain-text transcripts without timestamps: usable for meaning, but rules
  from them cannot be re-checked against the video. Send them only if
  nothing else is possible, and say so.

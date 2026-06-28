# Scribbletune for Bitwig — Developer Context

## What this is

Two Bitwig Studio **controller extensions** (API v17) that generate algorithmic MIDI and write directly into the arranger clip under the cursor. Both are registered as vendor "Scribbletune" and share the same single-file, no-build architecture.

| Script | Device name | Purpose |
|--------|-------------|---------|
| `Riff.control.js` (~506 lines) | Riff | Melodic/chord pattern generator — JavaScript port of the [Riff VST3 plugin](https://scribbletune.com/plugins/#riff-vst) |
| `Drummer.control.js` (~635 lines) | Drummer | Drum pattern generator — 268 patterns from the "260 Drum Machine Patterns" book, ported from the scribble-for-max Drummer device |

---

## Architecture

### Entry point — `init()`

Sets up all Bitwig document-state parameters and attaches signal observers. The only observer that generates notes is the one on `'Generate Pattern'`; `'Clear Clip'` and `'Scribbletune'` are side-effect only.

`flush()` and `exit()` are required Bitwig lifecycle stubs.

### Two generation modes

| Mode       | Function chain                                    | Output                          |
| ---------- | ------------------------------------------------- | ------------------------------- |
| **Riffs**  | `expandCombination()` → `parseRiffPattern()`      | Monophonic melody               |
| **Chords** | `generateChordPattern()` → `generateChordNotes()` | Polyphonic root-position triads |

### Full data flow

```
Generate! signal
  → rootNoteParam / scaleParam / modeParam / ... read from documentState
  → buildScale(rootNote, scaleName)           → MIDI note array for the scale
  → [Riffs]  filterScaleNotes(scaleNotes, filterStyle)
             expandCombination(combination, patternStyle, reusePattern)
             parseRiffPattern(pattern, rootNote, scaleNotes, 0, duration)
  → [Chords] generateChordPattern(...)         (calls expandCombination + parseRiffPattern internally,
                                                then replaces each note with a triad)
  → notes[]  {channel, position, pitch, velocity, length}
  → cursorClip.getLoopLength().setRaw(clipLen)
  → cursorClip.clearSteps()
  → writeNotesToClip(notes, cursorClip)
```

---

## Pattern notation language

Inspired by Scribbletune bracket notation. `parseRiffPattern()` is the recursive engine.

| Symbol  | Meaning                                                                        |
| ------- | ------------------------------------------------------------------------------ |
| `x`     | Root note (fixed pitch)                                                        |
| `R`     | Random note chosen from the filtered scale                                     |
| `-`     | Rest (advance position, emit no note)                                          |
| `[...]` | Subdivision: contents play at **2× speed** (duration halved per nesting level) |

Brackets nest arbitrarily: `[x[xx]]` = one root at current speed, then two rapid roots.

`parseRiffPattern(pattern, rootNote, scaleNotes, startPosition, duration)`:

- Scans left-to-right, tracking `currentPosition`
- On `[`: finds matching `]` (depth counter), recurses with `duration / 2`
- Returns array of note objects

**Position math in `writeNotesToClip()`:**

```
positionInSixteenths = Math.round(note.position * 4)
```

Notes at positions > 127 sixteenths (> 32 beats) are silently skipped.

---

## Key constants (top of file)

| Constant                  | Type   | Purpose                                                                                   |
| ------------------------- | ------ | ----------------------------------------------------------------------------------------- |
| `SCALE_INTERVALS`         | Object | Scale name → semitone interval array (12 scales)                                          |
| `NOTE_DURATIONS`          | Object | Notation string → beat value (`"16n"` → 0.25, `"4m"` → 16.0)                              |
| `PATTERN_PALETTES`        | Object | 16 named styles, each an array of bracket-notation strings used as pick lists             |
| `CHORD_PROGRESSIONS`      | Object | 7 progressions → scale-degree arrays                                                      |
| `lastGeneratedPatternMap` | `{}`   | Cache: letter → pattern string; persists across generations when "Re-use previous" is set |

---

## Pattern generation — `generateRandomPattern()`

Builds an 8-step string by picking from `PATTERN_PALETTES[patternStyle]` at each position. Several styles override the palette per position for musical effect:

| Style          | Override logic                                                                  |
| -------------- | ------------------------------------------------------------------------------- |
| `buildup`      | 4 phases: sparse → medium → dense → peak (by `i / length` fraction)             |
| `conversation` | Alternates "call" palette / "response" palette every `phraseLength` (3–5) steps |
| `fill`         | Emphasises downbeat (`i%8===0`) and phrase-end (`i%8===7`) positions            |
| `house groove` | Emphasises off-beats (`i%4===1` or `i%4===3`)                                   |
| `pulse`        | Strong downbeats (`i%4===0`), lighter mid-beat, off-beats                       |
| `sparse pulse` | Notes only at `i%8===0`, `i%8===3`, `i%8===7`; rest is silence                  |
| `hypnotic`     | Accents at `i%8 ∈ {0,3,6}`; other positions use base palette                    |

`expandCombination()` maps a letter sequence (e.g. `"AAAB"`) to 8-step sub-patterns, each letter generated once and cached in `lastGeneratedPatternMap`.

---

## Scale filtering — `filterScaleNotes()`

Runs in Riffs mode only, before note assignment:

| Filter        | Selection                     |
| ------------- | ----------------------------- |
| `all`         | Full scale                    |
| `odd`         | Indices 1, 3, 5…              |
| `even`        | Indices 0, 2, 4…              |
| `first half`  | Lower `ceil(n/2)` degrees     |
| `second half` | Upper `floor(n/2)` degrees    |
| `thirds`      | Every third degree (0, 3, 6…) |

Falls back to the full scale if filtering produces an empty array.

---

## Chord generation

`generateChordNotes(rootNote, scaleNotes, degree)`: stacks root + third (degree+2) + fifth (degree+4), wrapping with `% scaleNotes.length`. Always root-position triads — no inversions, no 7ths.

`generateChordPattern()`: calls `expandCombination()` + `parseRiffPattern()` to get a monophonic timing skeleton, then replaces each note with a full triad. Chord changes are evenly spaced across the note count (`notesPerChord = ceil(totalNotes / progression.length)`).

---

## Bitwig API surface

| Call                                                                             | Purpose                                      |
| -------------------------------------------------------------------------------- | -------------------------------------------- |
| `loadAPI(17)`                                                                    | Pin API version                              |
| `host.defineController(vendor, name, version, uuid, author)`                     | Extension registration                       |
| `host.getDocumentState()`                                                        | Persistent per-project UI parameters         |
| `documentState.getEnumSetting(label, category, options, default)`                | Dropdown parameter                           |
| `documentState.getNumberSetting(label, category, min, max, step, unit, default)` | Numeric slider                               |
| `documentState.getSignalSetting(label, category, buttonLabel)`                   | Momentary button                             |
| `.addSignalObserver(fn)`                                                         | Button callback                              |
| `host.createArrangerCursorClip(128, 128)`                                        | MIDI clip handle (max 128 notes × 128 steps) |
| `cursorClip.scrollToKey(0)`                                                      | Scroll clip to note 0 on init                |
| `cursorClip.clearSteps()`                                                        | Wipe all notes before regeneration           |
| `cursorClip.setStep(channel, step, noteNum, velocity, length)`                   | Write one note                               |
| `cursorClip.getLoopLength().setRaw(beats)`                                       | Resize clip to fit generated content         |
| `host.showPopupNotification(msg)`                                                | Toast notification in Bitwig                 |
| `host.println(msg)`                                                              | Bitwig script console log                    |

---

## Known gaps / areas to improve

- **No undo support** — `clearSteps()` + `setStep()` bypass Bitwig's undo stack; users cannot Ctrl-Z a generation
- **Chord voicings** — always root-position triads; no inversions, suspended chords, or 7ths
- **No custom combination entry** — combinations are a fixed enum; users can't type e.g. `AABBC`
- **Pattern cache invalidation** — `lastGeneratedPatternMap` caches all letters together; switching style while reuse is on will not regenerate cached letters from the new style
- **MIDI channel** — hardcoded to channel 0 everywhere; no UI control
- **Cursor dependency** — `cursorClip` follows the arranger cursor; if the user hasn't clicked the target clip, notes land in the wrong clip with no warning
- **Velocity** — hardcoded to 100 for all notes; no velocity variation by style or position
- **`parseRiffPattern` position math** — when a bracket group has nested brackets, `subLength` is computed by stripping `[]` chars from `subPattern`, which undercounts if sub-groups have varying step counts; complex nesting can drift position

---

## Installing and testing

**Install** (copy both files):

- macOS: `~/Documents/Bitwig Studio/Controller Scripts/`
- Windows: `%USERPROFILE%\Documents\Bitwig Studio\Controller Scripts\`

**Activate in Bitwig:** Preferences → Controllers → Add Controller → search "Scribbletune" → add Riff and/or Drummer

**Use (Riff):** Create or select an arranger clip → set parameters → click "Generate!"

**Use (Drummer):** Create a MIDI track with a drum instrument → create/select a clip → set Genre/Pattern/Feel params → click "Generate!"

**Test Riff JS logic without Bitwig:** Mock the globals, then call the generation functions directly:

```js
// minimal mock
global.host = { println: console.log, showPopupNotification: () => {} };
// call directly
const notes = parseRiffPattern("x[R-]x-", 60, [60, 62, 64, 65, 67], 0, 0.25);
```

**Test Drummer JS logic without Bitwig:** The core functions (`selectPattern`, `buildDrumKit`, `parseDrumTrack`) have no Bitwig dependencies and can be called directly after loading `DRUM_PATTERNS` from the JSON source at `/Users/walmik/Github/iPlug2/Examples/Drummer/260-drum-machine-patterns.json`.

`writeNotesToClip` can be verified in both scripts by passing a mock clip object that records `setStep` calls.

---

## Drummer — architecture

Single implementation file: `Drummer.control.js` (no build step, no npm packages).

### Data flow

```
Generate! signal
  → genreParam / patternIndexParam / noteLengthParam / ... read from documentState
  → selectPattern(genre, index)   → one of 268 DrumPattern objects
  → buildDrumKit(baseOctave)      → { bd, sd, ch, ... } → MIDI note numbers
  → buildDrumNotes(pattern, kit, noteLength, complexity, variation, ghostNotes, removeKick)
      → parseDrumTrack() per instrument track
  → notes[]  { channel, posInSixteenths, pitch, velocity, length }
  → cursorClip.getLoopLength().setRaw(clipBeats)
  → cursorClip.clearSteps()
  → writeNotesToClip(notes, cursorClip)
```

### Key constants

| Constant | Purpose |
|----------|---------|
| `DRUM_PATTERNS` | 268 patterns embedded inline (sourced from `260-drum-machine-patterns.json`) |
| `DRUM_KIT_OFFSETS` | Instrument abbr → `{ semitones, velocity }`; MIDI note = `24 + octave*12 + semitones` |
| `NOTE_DURATIONS` | `16n` → 0.25, `8n` → 0.5, `4n` → 1.0 beats per step |
| `GENRES` | 25 genre names + "Random" used to populate the Genre dropdown |

### Pattern notation (drum tracks)

| Char | Meaning |
|------|---------|
| `x` | Hit at base velocity |
| `X` | Accented hit (+20 velocity) |
| `-` | Rest |
| `[xx]` | Flam: one step, with optional grace note 1 sixteenth before (if Ghost Notes = On) |

### MIDI mapping (Base Octave = 1, default)

Matches General MIDI drum map: kick=36, snare=38, closed hi-hat=42, open hi-hat=46, crash=49.

### Known gaps / areas to improve

- **No undo support** — same as Riff; `clearSteps()` bypasses the undo stack
- **Cursor dependency** — notes land in whichever clip the arranger cursor is on
- **MIDI channel** — hardcoded to channel 0
- **Pattern index in Random mode** — `patternIndex` param is ignored when Genre = Random (a fully random pick is made instead)

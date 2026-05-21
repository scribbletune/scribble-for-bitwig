# Riff for Bitwig — Developer Context

## What this is

A Bitwig Studio **controller extension** (API v17) that generates algorithmic MIDI patterns and writes them directly into the arranger clip currently under the cursor. Registered as vendor "Scribbletune", device name "Riff".

It is a **JavaScript port** of the [free AU & VST3 plugin `Riff` by Scribbletune](https://scribbletune.com/plugins/#riff-vst). The core musical logic (scales, pattern notation, chord generation) mirrors it. The delivery mechanism differs: the VST3 exports a drag-and-drop MIDI file; this script writes directly to a `cursorClip` via `setStep()`.

Single implementation file: `Riff.control.js` (~506 lines, no build step, no npm packages).

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

**Install** (macOS):

```
~/Documents/Bitwig Studio/Controller Scripts/Riff.control.js
```

Windows: `%USERPROFILE%\Documents\Bitwig Studio\Controller Scripts\...`

**Activate in Bitwig:** Preferences → Controllers → Add Controller → Riff

**Use:** Create or select an arranger clip → set parameters in the controller panel → click "Generate!"

**Test JS logic without Bitwig:** Mock the globals, then call the generation functions directly:

```js
// minimal mock
global.host = { println: console.log, showPopupNotification: () => {} };
// call directly
const notes = parseRiffPattern("x[R-]x-", 60, [60, 62, 64, 65, 67], 0, 0.25);
```

`writeNotesToClip` can be verified by passing a mock clip object that records `setStep` calls.

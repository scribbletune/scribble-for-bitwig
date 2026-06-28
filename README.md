# Scribbletune for Bitwig

Free, open-source Bitwig controller scripts for algorithmic MIDI generation — melodies, chords, and drum patterns written directly into your arranger clips.

![Riff for Bitwig Demo](https://scribbletune.com/images/riff4bitwig.png)

## Scripts

### Riff (`Riff.control.js`)

Generates melodic and chord patterns using Scribbletune's bracket notation system. A port of the [free Riff VST3/AU plugin](https://scribbletune.com/plugins/#riff-vst).

- **Two modes**: Riffs (monophonic) and Chords (polyphonic progressions)
- **16 pattern styles**: Pulse, Sparse Pulse, Melody, Counterpoint, Syncopated, House Groove, Off Beat, Roll, Fill, Breakbeat, Buildup, Conversation, Stutter, Hypnotic, Simple, and more
- **12 scales**, 7 chord progressions, scale filtering, pattern combinations, legato mode

### Drummer (`Drummer.control.js`)

Generates drum patterns from the "260 Drum Machine Patterns" book. Port of the Drummer device from scribble-for-max.

- **268 patterns** across 25 genres: AfroCub, Blues, Boogie, Bossa, ChaCha, Disco, Funk, Jazz, Pop, Reggae, Rock, Samba, Swing, Waltz, and more
- **Ghost notes**: grace notes one 16th before hits at 1/3 velocity
- **Complexity**: velocity variation and spontaneous fills on rests
- **Variation**: strong-beat accents and probabilistic ghost notes
- **Random mode**: picks a different pattern every press
- Outputs to General MIDI drum note numbers by default (kick=36, snare=38, etc.)

## Installation

### macOS

1. Copy `Riff.control.js` and/or `Drummer.control.js` to:
   `~/Documents/Bitwig Studio/Controller Scripts/`
2. In Bitwig: **Preferences → Controllers → Add Controller**
3. Search "Scribbletune" and add **Riff** and/or **Drummer**

### Windows

1. Copy the script(s) to:
   `%USERPROFILE%\Documents\Bitwig Studio\Controller Scripts\`
2. In Bitwig: **Preferences → Controllers → Add Controller**
3. Search "Scribbletune" and add **Riff** and/or **Drummer**

### Linux

1. Copy the script(s) to: `~/Bitwig Studio/Controller Scripts/`
2. In Bitwig: **Preferences → Controllers → Add Controller**
3. Search "Scribbletune" and add **Riff** and/or **Drummer**

## Quick Start — Riff

1. Create a MIDI track with an instrument
2. Create or select an empty arranger clip
3. In the Riff controller panel: choose Root Note, Scale, and Pattern Style
4. Click **Generate!** — each click produces a fresh pattern

## Quick Start — Drummer

1. Create a MIDI track with a drum instrument
2. Create a clip, select it, and double-click to make sure it's focused
3. In the Drummer controller panel: choose Genre and Pattern (or leave on Random)
4. Click **Generate!** — or **Random Pattern** to explore freely

## The Bracket Notation System (Riff)

- `x` = root note
- `R` = random note from the scale
- `-` = rest
- `[...]` = subdivide (play twice as fast per nesting level)

Examples: `x-x-` · `[xx]` · `[x-][R-]` · `[x[xx]]`

## Development

Both scripts are plain JavaScript, Bitwig Controller Script API v17, no build step.

| File | Lines |
|------|-------|
| `Riff.control.js` | ~506 |
| `Drummer.control.js` | ~635 |

To modify: edit the file → copy to Controller Scripts folder → reload the controller in Bitwig.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

Created by [Walmik Deshpande](https://github.com/walmik)

Part of the [Scribbletune](https://scribbletune.com) project — a suite of tools for algorithmic music composition.

## Links

- **Scribbletune**: https://scribbletune.com
- **Demo Video**: https://www.youtube.com/watch?v=Pxa6T1t0Ips
- **Issues & Support**: [GitHub Issues](../../issues)

---

Made with ♥ for the Bitwig community

# Riff for Bitwig

A powerful MIDI pattern generator for Bitwig Studio using Scribbletune's unique bracket notation system.

![Riff for Bitwig Demo](screenshots/demo.gif)

## What is Riff?

Riff is a free, open-source Bitwig controller script that generates musical MIDI patterns with recursive subdivisions. Originally created as a VST3 plugin, Riff is now available natively in Bitwig Studio.

Perfect for quickly sketching basslines, leads, melodies, percussion and chord progressions without falling into repetitive patterns. The randomization keeps things fresh while staying musical.

**[Watch the Demo Video](your-youtube-link-here)**

## Features

### Two Generation Modes

- **Riffs**: Monophonic patterns for basslines and melodies
- **Chords**: Polyphonic chord progressions

### 16 Pattern Styles

- Pulse
- Sparse Pulse
- Melody
- Sparse Melody
- Counterpoint
- Syncopated
- House Groove
- Off Beat
- Roll
- Fill
- Breakbeat
- Buildup
- Conversation
- Stutter
- Hypnotic
- Simple

### Musical Controls

- **12 Scales**: Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian, Harmonic Minor, Pentatonic Major, Pentatonic Minor, Blues, Chromatic
- **Scale Filtering** (Riffs mode): All, Odd, Even, First Half, Second Half, Thirds
- **7 Chord Progressions** (Chords mode): I-V-vi-IV, I-IV-V, vi-IV-I-V, I-vi-IV-V, ii-V-I, I-V, I-IV
- **Pattern Combinations**: A, AAAB, ABAC, ABBB, ABCD, AAABAAAC, ABACABAD
- **Note Lengths**: 16n, 8n, 4n, 2n, 1n, 2m, 4m
- **Pattern Reuse**: Generate variations or completely new patterns

## Installation

### macOS

1. Download `Riff.control.js` from the [latest release](../../releases)
2. Copy the file to: `~/Documents/Bitwig Studio/Controller Scripts/`
3. Restart Bitwig Studio
4. Go to **Settings → Controllers**
5. Click **Add controller** and select **Scribbletune → Riff**

### Windows

1. Download `Riff.control.js` from the [latest release](../../releases)
2. Copy the file to: `%USERPROFILE%\Documents\Bitwig Studio\Controller Scripts\`
3. Restart Bitwig Studio
4. Go to **Settings → Controllers**
5. Click **Add controller** and select **Scribbletune → Riff**

### Linux

1. Download `Riff.control.js` from the [latest release](../../releases)
2. Copy the file to: `~/Bitwig Studio/Controller Scripts/`
3. Restart Bitwig Studio
4. Go to **Settings → Controllers**
5. Click **Add controller** and select **Scribbletune → Riff**

## Quick Start

1. Create or select an empty MIDI clip in the Bitwig arranger
2. In the controller settings, configure your musical parameters:
   - Choose your **Root Note** and **Octave**
   - Select a **Scale** (e.g., Ionian for major, Aeolian for minor)
   - Pick a **Pattern Style** (try "pulse" or "melody" to start)
3. Click **Generate!**
4. Listen and iterate - each click generates a fresh pattern

### Tips

- **Riffs mode** is great for basslines and lead melodies - try "syncopated" or "house groove" styles
- **Chords mode** is perfect for progressions - the I-V-vi-IV progression is a popular starting point
- Use **Pattern Combinations** like AAAB for verse/chorus structures
- Try **Scale Filter** (Riffs only) to limit melodic range - "odd" and "even" create interesting intervallic patterns
- Longer **Note Lengths** (2n, 1n, 2m) work well for pads and atmospheric parts

## The Bracket Notation System

Riff uses Scribbletune's bracket notation language to describe patterns:

- `x` = root note
- `R` = random note from the scale
- `-` = rest (silence)
- `[...]` = subdivide (play the enclosed pattern twice as fast)

**Examples:**

- `x-x-` = root, rest, root, rest (simple pulse)
- `[xx]` = two quick root notes in one beat
- `[x-][R-]` = quick root-rest, then quick random-rest
- `[x[xx]]` = root note, then two super-quick root notes

Brackets can be nested infinitely, creating complex rhythmic patterns from simple notation.

## Contributing

Contributions are welcome! Feel free to:

- Report bugs or request features via [Issues](../../issues)
- Submit pull requests with improvements
- Share your favorite pattern combinations
- Add new pattern styles or chord progressions

## Development

The script is written in JavaScript using Bitwig's Controller Script API v17.

Key files:

- `Riff.control.js` - Main controller script

To modify:

1. Edit `Riff.control.js`
2. Copy to your Controller Scripts folder
3. Restart Bitwig or reload the controller

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

Created by [Walmik Deshpande](https://github.com/walmik)

Part of the [Scribbletune](https://scribbletune.com) project - a suite of tools for algorithmic music composition.

Original Riff VST3 plugin ported to Bitwig with assistance from Claude (Anthropic).

## Links

- **Scribbletune**: https://scribbletune.com
- **Demo Video**: [YouTube link]
- **Issues & Support**: [GitHub Issues](../../issues)
- **Other Scribbletune Projects**: https://github.com/scribbletune

---

Made with ♥ for the Bitwig community

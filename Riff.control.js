/**
 * Riff for Bitwig - Complete Production Version
 * Port of the Riff VST3 MIDI pattern generator
 * @version 0.9.2
 * @author Walmik Deshpande
 */

loadAPI(17)
host.setShouldFailOnDeprecatedUse(true)
host.defineController('Scribbletune', 'Riff', '0.9.2', '367f5ed2-bcaa-473d-801a-35615d0ac604', 'Riff')

// ============================================================================
// CONSTANTS
// ============================================================================

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const SCALE_INTERVALS = {
  'Ionian': [0, 2, 4, 5, 7, 9, 11],
  'Dorian': [0, 2, 3, 5, 7, 9, 10],
  'Phrygian': [0, 1, 3, 5, 7, 8, 10],
  'Lydian': [0, 2, 4, 6, 7, 9, 11],
  'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
  'Aeolian': [0, 2, 3, 5, 7, 8, 10],
  'Locrian': [0, 1, 3, 5, 6, 8, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  'Pentatonic Major': [0, 2, 4, 7, 9],
  'Pentatonic Minor': [0, 3, 5, 7, 10],
  'Blues': [0, 3, 5, 6, 7, 10],
  'Chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
}

const NOTE_DURATIONS = {
  '4m': 16.0,
  '2m': 8.0,
  '1n': 4.0,
  '2n': 2.0,
  '4n': 1.0,
  '8n': 0.5,
  '16n': 0.25
}

const PATTERN_PALETTES = {
  'pulse': ['x', '-', '[x-]', 'R', '[R-]'],
  'sparse pulse': ['-', '-', '-', '[x-]', 'R', '[R-]'],
  'melody': ['R', '-', '[R-]'],
  'sparse melody': ['-', '-', '[R-]', '-', '[R-]'],
  'counterpoint': ['x', '-', '[x-]', 'R', '[R-]'],
  'syncopated': ['-', '[R-]', '[R-]', '[-R]', '[-R]', '[x[R-]]', '[R[R-]]'],
  'house groove': ['[x-]', '[-x]', '[x--]', '[-R]', '[R--]', '-', '[x[-R]]'],
  'off beat': ['[x-]', 'R', '[R-]', '[R-]'],
  'roll': ['x', '-', '[x-]', '[x[xx]]'],
  'fill': ['x', '[x-]', '[-x]', '-', '[x--]', '[x[x-]]'],
  'breakbeat': ['x', '[x-]', '[xx]', '[-x]', '[x[xx]]', '[x[-x]]', '[-[xx]]', '-'],
  'buildup': ['x', 'R', '[x-]', '[R-]', '-'],
  'conversation': ['x', 'R', '[x-]', '[R-]', '-'],
  'stutter': ['[xx]', '[xxx]', '[xxxx]', '[x-x]', '[x--x]', '[RR]', '[RRR]', '[R-R]'],
  'hypnotic': ['[x-]', '[xx]', '[x[x-]]', '[R-]', '[RR]', '[R[R-]]', '[-x]', '[-R]'],
  'simple': ['x', 'R', 'R']
}

const CHORD_PROGRESSIONS = {
  'I-V-vi-IV': [0, 4, 5, 3],
  'I-IV-V': [0, 3, 4],
  'vi-IV-I-V': [5, 3, 0, 4],
  'I-vi-IV-V': [0, 5, 3, 4],
  'ii-V-I': [1, 4, 0],
  'I-V': [0, 4],
  'I-IV': [0, 3]
}

let lastGeneratedPatternMap = {}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function noteToMIDI(noteName, octave) {
  const noteIndex = NOTE_NAMES.indexOf(noteName)
  if (noteIndex === -1) return 60
  return (octave + 1) * 12 + noteIndex
}

function buildScale(rootNote, scaleName) {
  const intervals = SCALE_INTERVALS[scaleName]
  if (!intervals) return [Math.min(127, Math.max(0, rootNote))]
  
  const result = []
  for (let i = 0; i < intervals.length; i++) {
    const note = rootNote + intervals[i]
    // Only add notes within valid MIDI range
    if (note >= 0 && note <= 127) {
      result.push(note)
    }
  }
  return result.length > 0 ? result : [Math.min(127, Math.max(0, rootNote))]
}

function filterScaleNotes(scaleNotes, filterStyle) {
  if (filterStyle === 'all') return scaleNotes
  
  const result = []
  if (filterStyle === 'odd') {
    for (let i = 0; i < scaleNotes.length; i++) {
      if (i % 2 === 1) result.push(scaleNotes[i])
    }
  } else if (filterStyle === 'even') {
    for (let i = 0; i < scaleNotes.length; i++) {
      if (i % 2 === 0) result.push(scaleNotes[i])
    }
  } else if (filterStyle === 'first half') {
    const half = Math.ceil(scaleNotes.length / 2)
    for (let i = 0; i < half; i++) {
      result.push(scaleNotes[i])
    }
  } else if (filterStyle === 'second half') {
    const half = Math.floor(scaleNotes.length / 2)
    for (let i = half; i < scaleNotes.length; i++) {
      result.push(scaleNotes[i])
    }
  } else if (filterStyle === 'thirds') {
    for (let i = 0; i < scaleNotes.length; i += 3) {
      result.push(scaleNotes[i])
    }
  }
  
  return result.length > 0 ? result : scaleNotes
}

// ============================================================================
// PATTERN GENERATION
// ============================================================================

function generateRandomPattern(length, patternStyle) {
  let palette = PATTERN_PALETTES[patternStyle] || PATTERN_PALETTES['pulse']
  let pattern = ''
  
  for (let i = 0; i < length; i++) {
    let currentPalette = palette
    
    if (patternStyle === 'buildup') {
      if (i < length / 4) {
        currentPalette = ['-', '-', '-', '[x-]']
      } else if (i < length / 2) {
        currentPalette = ['-', '[x-]', 'x', '[R-]']
      } else if (i < 3 * length / 4) {
        currentPalette = ['x', 'R', '[xx]', '[RR]', '[x-]']
      } else {
        currentPalette = ['[xx]', '[xxx]', '[RR]', '[RRR]', '[xR]', '[x[xx]]']
      }
    } else if (patternStyle === 'conversation') {
      const phraseLength = getRandomInt(3, 5)
      if (Math.floor(i / phraseLength) % 2 === 0) {
        currentPalette = ['x', 'R', '[x-]', '[R-]']
      } else {
        currentPalette = ['-', '[-x]', '[-R]', '[x--]']
      }
    } else if (patternStyle === 'fill') {
      if (i % 8 === 0) {
        currentPalette = ['x', '[x-]', '[x[x-]]']
      } else if (i % 8 === 7) {
        currentPalette = ['[x[x-]]', '[xxx]', '[x[xx]]']
      } else if (i % 4 === 0) {
        currentPalette = ['[x-]', '[-x]', '-']
      } else {
        currentPalette = ['-', '[-x]', '[--x]']
      }
    } else if (patternStyle === 'house groove') {
      if (i % 4 === 1 || i % 4 === 3) {
        currentPalette = ['[x-]', '[-x]', '[x[-]]', '[R-]', '[-R]', '[R[-]]']
      } else if (i % 4 === 0) {
        currentPalette = ['x', '[x-]', '-']
      } else {
        currentPalette = ['-', '[-x]', '[--x]']
      }
    } else if (patternStyle === 'counterpoint') {
      if (i % 4 === 0 || i % 4 === 2) {
        currentPalette = ['x', '[x-]', '-']
      } else {
        currentPalette = ['R', '[R-]', '[-R]']
      }
    } else if (patternStyle === 'melody') {
      const phrasePos = i % 8
      if (phrasePos < 2) {
        currentPalette = ['R', '[R-]']
      } else if (phrasePos < 5) {
        currentPalette = ['R', '[R-]', '[RR]']
      } else {
        currentPalette = ['-', '[R-]']
      }
    } else if (patternStyle === 'sparse melody') {
      const cyclePos = i % 6
      if (cyclePos === 1 || cyclePos === 4) {
        currentPalette = ['R', '[R-]']
      } else if (cyclePos === 0) {
        currentPalette = ['-', 'R']
      } else {
        currentPalette = ['-', '-', '-']
      }
    } else if (patternStyle === 'hypnotic') {
      if (i % 8 === 0 || i % 8 === 3 || i % 8 === 6) {
        currentPalette = ['[x-]', '[R-]', '[x[x-]]', '[R[R-]]']
      }
    }
    
    let token = randomChoice(currentPalette)
    if (patternStyle === 'pulse' || patternStyle === 'sparse pulse') {
      if (token === 'R') token = Math.random() < 0.5 ? 'x' : '-'
      else if (token === '[R-]') token = Math.random() < 0.5 ? '[x-]' : '-'
    }
    pattern += token
  }
  
  return pattern
}

function expandCombination(combination, patternStyle, reusePattern, noteVariation, scaleNotes) {
  let patternMap = reusePattern ? lastGeneratedPatternMap : {}
  let fullPattern = ''
  let noteChoices = []

  for (let i = 0; i < combination.length; i++) {
    const letter = combination[i]

    if (!patternMap[letter]) {
      patternMap[letter] = { pattern: generateRandomPattern(8, patternStyle) }
    }

    const pat = patternMap[letter].pattern
    fullPattern += pat

    if (noteVariation === 'Fixed') {
      if (!patternMap[letter].rNotes) {
        const rNotes = []
        for (let j = 0; j < pat.length; j++) {
          if (pat[j] === 'R') rNotes.push(scaleNotes[Math.floor(Math.random() * scaleNotes.length)])
        }
        patternMap[letter].rNotes = rNotes
      }
      for (let k = 0; k < patternMap[letter].rNotes.length; k++) {
        noteChoices.push(patternMap[letter].rNotes[k])
      }
    } else {
      for (let j = 0; j < pat.length; j++) {
        if (pat[j] === 'R') noteChoices.push(scaleNotes[Math.floor(Math.random() * scaleNotes.length)])
      }
    }
  }

  if (!reusePattern) {
    lastGeneratedPatternMap = patternMap
  }

  return { pattern: fullPattern, noteCursor: { index: 0, notes: noteChoices } }
}

// ============================================================================
// PATTERN PARSER
// ============================================================================

function parseRiffPattern(pattern, rootNote, scaleNotes, startPosition, duration, noteCursor) {
  const notes = []
  let currentPosition = startPosition
  let i = 0
  
  while (i < pattern.length) {
    const char = pattern[i]
    
    if (char === '[') {
      let depth = 1
      let j = i + 1
      while (j < pattern.length && depth > 0) {
        if (pattern[j] === '[') depth++
        if (pattern[j] === ']') depth--
        j++
      }
      
      const subPattern = pattern.substring(i + 1, j - 1)
      const subDuration = duration / 2
      const subResult = parseRiffPattern(subPattern, rootNote, scaleNotes, currentPosition, subDuration, noteCursor)

      for (let k = 0; k < subResult.notes.length; k++) {
        notes.push(subResult.notes[k])
      }

      currentPosition += subResult.consumed
      i = j
      
    } else if (char === 'x') {
      notes.push({
        channel: 0,
        position: currentPosition,
        pitch: Math.min(127, Math.max(0, rootNote)),
        velocity: 100,
        length: duration
      })
      currentPosition += duration
      i++
      
    } else if (char === 'R') {
      const randomNote = (noteCursor && noteCursor.index < noteCursor.notes.length)
        ? noteCursor.notes[noteCursor.index++]
        : scaleNotes[Math.floor(Math.random() * scaleNotes.length)]
      notes.push({
        channel: 0,
        position: currentPosition,
        pitch: Math.min(127, Math.max(0, randomNote)),
        velocity: 100,
        length: duration
      })
      currentPosition += duration
      i++
      
    } else if (char === '-') {
      currentPosition += duration
      i++
      
    } else {
      i++
    }
  }
  
  return { notes, consumed: currentPosition - startPosition }
}

function writeNotesToClip(notes, clip, deduplicateSteps) {
  const occupiedSteps = deduplicateSteps ? new Set() : null
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i]
    const positionInSixteenths = Math.round(note.position * 4)
    if (positionInSixteenths < 0 || positionInSixteenths > 127) continue
    if (occupiedSteps && occupiedSteps.has(positionInSixteenths)) continue
    if (occupiedSteps) occupiedSteps.add(positionInSixteenths)
    const pitch = Math.min(127, Math.max(0, Math.floor(note.pitch)))
    const velocity = Math.min(127, Math.max(1, Math.round(note.velocity)))
    clip.setStep(note.channel, positionInSixteenths, pitch, velocity, Math.max(0.0625, note.length))
  }
}

function mergeAdjacentNotes(notes) {
  if (notes.length === 0) return notes
  const sorted = notes.slice().sort(function(a, b) { return a.position - b.position })
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    const note = sorted[i]
    let merged = false
    for (let j = result.length - 1; j >= 0; j--) {
      const existing = result[j]
      if (existing.pitch === note.pitch && Math.abs((existing.position + existing.length) - note.position) < 1e-9) {
        existing.length += note.length
        merged = true
        break
      }
    }
    if (!merged) {
      result.push({ channel: note.channel, position: note.position, pitch: note.pitch, velocity: note.velocity, length: note.length })
    }
  }
  return result
}

// ============================================================================
// CHORD GENERATION
// ============================================================================

function generateChordNotes(rootNote, scaleNotes, degree) {
  // Safely get scale notes with bounds checking
  const getScaleNote = function(index) {
    const note = scaleNotes[index % scaleNotes.length]
    return Math.min(127, Math.max(0, note))
  }
  
  const chordRoot = getScaleNote(degree)
  const third = getScaleNote(degree + 2)
  const fifth = getScaleNote(degree + 4)
  
  return [chordRoot, third, fifth]
}

function generateChordPattern(combination, rootNote, scaleNotes, progressionName, noteLength, reusePattern, noteVariation, patternStyle) {
  const progression = CHORD_PROGRESSIONS[progressionName]
  if (!progression) {
    host.println('Unknown progression: ' + progressionName)
    return []
  }
  
  // Filter scale to only valid MIDI notes
  const validScaleNotes = []
  for (let i = 0; i < scaleNotes.length; i++) {
    if (scaleNotes[i] >= 0 && scaleNotes[i] <= 127) {
      validScaleNotes.push(scaleNotes[i])
    }
  }
  
  // If no valid notes, use clamped root
  if (validScaleNotes.length === 0) {
    validScaleNotes.push(Math.min(127, Math.max(0, rootNote)))
  }
  
  // Generate base pattern
  const { pattern } = expandCombination(combination, patternStyle, reusePattern, noteVariation, validScaleNotes)
  const duration = NOTE_DURATIONS[noteLength]

  // Use the same parser as riffs but replace single notes with chords
  const riffNotes = parseRiffPattern(pattern, rootNote, validScaleNotes, 0, duration).notes
  
  // Determine chord changes based on note positions
  const notes = []
  const totalNotes = riffNotes.length
  const notesPerChord = Math.ceil(totalNotes / progression.length)
  
  for (let i = 0; i < riffNotes.length; i++) {
    const riffNote = riffNotes[i]
    const chordIndex = Math.floor(i / notesPerChord) % progression.length
    const chordDegree = progression[chordIndex]
    const chordNotes = generateChordNotes(rootNote, validScaleNotes, chordDegree)
    
    // Add all notes of the chord at this position
    for (let n = 0; n < chordNotes.length; n++) {
      const pitch = Math.min(127, Math.max(0, chordNotes[n]))
      notes.push({
        channel: 0,
        position: riffNote.position,
        pitch: pitch,
        velocity: 100,
        length: riffNote.length
      })
    }
  }
  
  return notes
}

// ============================================================================
// BITWIG INITIALIZATION
// ============================================================================

function init() {
  host.println('-- Riff for Bitwig Initialized! --')
  
  const documentState = host.getDocumentState()
  const cursorClip = host.createArrangerCursorClip(128, 128)
  cursorClip.scrollToKey(0)
  
  const rootNoteParam = documentState.getEnumSetting('Root Note', 'Musical Settings', NOTE_NAMES, 'C')
  const octaveParam = documentState.getNumberSetting('Octave', 'Musical Settings', 0, 6, 1, '', 4)
  const scaleParam = documentState.getEnumSetting('Scale', 'Musical Settings', Object.keys(SCALE_INTERVALS), 'Ionian')
  
  const modeParam = documentState.getEnumSetting('Mode', 'Generation Mode', ['Riffs', 'Chords'], 'Riffs')
  const scaleFilterParam = documentState.getEnumSetting('Scale Filter (Riffs only)', 'Generation Mode', ['all', 'odd', 'even', 'first half', 'second half', 'thirds'], 'all')
  const chordProgressionParam = documentState.getEnumSetting('Chord Progression (Chords only)', 'Generation Mode', Object.keys(CHORD_PROGRESSIONS), 'I-V-vi-IV')
  
  const combinationParam = documentState.getEnumSetting('Combination', 'Pattern Settings', ['A', 'AAAB', 'ABAC', 'ABBB', 'ABCD', 'AAABAAAC', 'ABACABAD'], 'AAAB')
  const patternStyleParam = documentState.getEnumSetting('Pattern Style', 'Pattern Settings', Object.keys(PATTERN_PALETTES), 'pulse')
  const noteLengthParam = documentState.getEnumSetting('Note Length', 'Pattern Settings', Object.keys(NOTE_DURATIONS), '16n')
  const reusePatternParam = documentState.getEnumSetting('Pattern Reuse', 'Pattern Settings', ['New every time', 'Re-use previous'], 'New every time')
  const noteVariationParam = documentState.getEnumSetting('Note Variation', 'Pattern Settings', ['Fixed', 'Free'], 'Fixed')
  const legatoParam = documentState.getEnumSetting('Legato', 'Pattern Settings', ['Off', 'On'], 'Off')
  
  documentState.getSignalSetting('Generate Pattern', 'Actions', 'Generate!').addSignalObserver(function() {
    const rootNote = noteToMIDI(rootNoteParam.get(), octaveParam.getRaw())
    const fullScale = buildScale(rootNote, scaleParam.get())
    const mode = modeParam.get()
    const combination = combinationParam.get()
    const patternStyle = patternStyleParam.get()
    const noteLength = noteLengthParam.get()
    const reusePattern = reusePatternParam.get() === 'Re-use previous'
    const noteVariation = noteVariationParam.get()
    
    let notes = []
    
    if (mode === 'Riffs') {
      // Riffs mode - monophonic patterns
      const scaleNotes = filterScaleNotes(fullScale, scaleFilterParam.get())
      const expanded = expandCombination(combination, patternStyle, reusePattern, noteVariation, scaleNotes)
      const duration = NOTE_DURATIONS[noteLength]
      notes = parseRiffPattern(expanded.pattern, rootNote, scaleNotes, 0, duration, expanded.noteCursor).notes
    } else {
      // Chords mode - polyphonic chord progressions
      const chordProgression = chordProgressionParam.get()
      notes = generateChordPattern(combination, rootNote, fullScale, chordProgression, noteLength, reusePattern, noteVariation, patternStyle)
    }

    if (legatoParam.get() === 'On') {
      notes = mergeAdjacentNotes(notes)
    }

    // Calculate clip length based on actual notes generated
    let maxPosition = 0
    let maxLength = 0
    for (let i = 0; i < notes.length; i++) {
      const noteEnd = notes[i].position + notes[i].length
      if (noteEnd > maxPosition) {
        maxPosition = noteEnd
        maxLength = notes[i].length
      }
    }
    
    // Convert to beats and set clip length (capped at 32 beats = 128 sixteenths)
    const clipLengthInBeats = Math.min(32, (maxPosition * 4) + (maxLength * 4))
    cursorClip.getLoopLength().setRaw(Math.max(4, clipLengthInBeats))
    cursorClip.clearSteps()
    writeNotesToClip(notes, cursorClip, mode === 'Riffs')
  })
  
  documentState.getSignalSetting('Clear Clip', 'Actions', 'Clear').addSignalObserver(function() {
    cursorClip.clearSteps()
    host.showPopupNotification('Clip cleared')
  })
  
  // Add Scribbletune info button
  documentState.getSignalSetting('Scribbletune', 'Info', 'scribbletune.com').addSignalObserver(function() {
    host.showPopupNotification('Visit scribbletune.com for more info')
  })
  
  host.println('-- Riff for Bitwig Ready! --')
}

function flush() {}

function exit() {
  host.println('-- Riff for Bitwig Goodbye! --')
}

const VALID_BLACK_KEYS = ["s", "d", "g", "h", "j"];
const VALID_WHITE_KEYS = ["z", "x", "c", "v", "b", "n", "m"];
const VALID_KEYS = [...VALID_BLACK_KEYS, ...VALID_WHITE_KEYS];
const NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const MIDI_TO_NOTE = {
  60:  "C4"    ,
  61:  "C#4"   ,
  62: "D4"    ,
  63:  "D#4"   ,
  64: "E4"    ,
  65: "F4"    ,
  66:  "F#4"   ,
  67: "G4"   ,
  68:  "G#4"   ,
  69: "A4"    ,
  70:  "A#4"   ,
  71: "B4"    ,
};
const NOTE_TO_MIDI = {
  "C4" : 60 , 
  "C#4": 61 ,
  "D4" : 62 , 
  "D#4": 63 ,
  "E4": 64 , 
  "F4": 65 , 
  "F#4": 66 ,
  "G4": 67 , 
  "G#4": 68 ,
  "A4": 69 , 
  "A#4": 70 ,
  "B4": 71 , 
};
const NOTE_TO_KEY = {
  C: "z",
  Db: "s",
  D: "x",
  Eb: "d",
  E: "c",
  F: "v",
  Gb: "g",
  G: "b",
  Ab: "h",
  A: "n",
  Bb: "j",
  B: "m",
};
const KEY_TO_NOTE = {
  z: "C",
  s: "Db",
  x: "D",
  d: "Eb",
  c: "E",
  v: "F",
  g: "Gb",
  b: "G",
  h: "Ab",
  n: "A",
  j: "Bb",
  m: "B",
};
export { NOTES, VALID_KEYS, NOTE_TO_KEY, KEY_TO_NOTE, MIDI_TO_NOTE, NOTE_TO_MIDI };

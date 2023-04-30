const VALID_BLACK_KEYS = ["s", "d", "g", "h", "j"];
const VALID_WHITE_KEYS = ["z", "x", "c", "v", "b", "n", "m"];
const VALID_KEYS = [...VALID_BLACK_KEYS, ...VALID_WHITE_KEYS];
const NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const MIDI_TO_NOTE = {
  60: "C",
  61: "Db",
  62: "D",
  63: "Eb",
  64: "E",
  65: "F",
  66: "Gb",
  67: "G",
  68: "Ab",
  69: "A",
  70: "Bb",
  71: "B",
};
const NOTE_TO_MIDI = {
  C : 60 , 
  Db: 61 ,
  D : 62 , 
  Eb: 63 ,
  E : 64 , 
  F : 65 , 
  Gb: 66 ,
  G : 67 , 
  Ab: 68 ,
  A : 69 , 
  Bb: 70 ,
  B : 71 , 
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

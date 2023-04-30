import React, { useEffect, Fragment } from 'react';
import Instrument from './Instrument';
import isAccidentalNote from '../utils/isAccidentalNote';
import getNotesBetween from '../utils/getNotesBetween';
import getKeyboardShortcutForNote from '../utils/getKeyboardShortcutsForNote';

export default function Piano({
  startNote, endNote, keyboardMap, renderPianoKey, renderAudio, PianoKeyUp, PianoKeyDown, triggerNoteOnSound, triggerNoteOffSound, noteNameToPlay
}) {
  const notes = getNotesBetween(startNote, endNote);
  const HandlePianoKeyUp = (note) => {
    // Do something when a key up event is fired
    //console.log("test Piano fire: " + note);
    PianoKeyUp(note);
  };
  const HandlePianoKeyDown = (note) => {
    // Do something when a key up event is fired
    //console.log("test Piano fire: " + note);
    PianoKeyDown(note);
  };
  useEffect(() => {
    if (triggerNoteOnSound) {
      //console.log("triggered in piano");
    }
  }, [triggerNoteOnSound]);
  useEffect(() => {
    if (triggerNoteOffSound) {
      //console.log("triggered in piano");
    }
  }, [triggerNoteOffSound]);

  useEffect(() => {
    if (noteNameToPlay) {
      //console.log("trigger");
    }
  }, [noteNameToPlay]);
  return (
    <Instrument
      noteNameToPlay={noteNameToPlay}
      triggerNoteOnSound={triggerNoteOnSound}
      triggerNoteOffSound={triggerNoteOffSound}
      PianoKeyUp={HandlePianoKeyUp}
      PianoKeyDown ={HandlePianoKeyDown}
      instrument={'acoustic_grand_piano'}
      keyboardMap={keyboardMap}
      renderInstrument={({ notesPlaying, onPlayNoteStart, onPlayNoteEnd }) =>
        notes.map(note => (
          <Fragment key={note}>
            {renderPianoKey({
              note,
              isNoteAccidental: isAccidentalNote(note),
              isNotePlaying: notesPlaying.includes(note),
              startPlayingNote: () => onPlayNoteStart(note),
              stopPlayingNote: () => onPlayNoteEnd(note),
              keyboardShortcuts: getKeyboardShortcutForNote(keyboardMap, note),
            })}
          </Fragment>
        ))
      }
      renderAudio={renderAudio}
    />
  );
}

Piano.defaultProps = {
  keyboardMap: {},
};

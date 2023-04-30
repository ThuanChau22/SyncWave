import React, { useState, useEffect } from 'react';
import InstrumentAudio from './InstrumentAudio';

function isRegularKey(event) {
  return !event.ctrlKey && !event.metaKey && !event.shiftKey;
}

export default function Instrument(props) {
  const [notesPlaying, setNotesPlaying] = useState([]);
  const { triggerNoteOnSound, triggerNoteOffSound, noteNameToPlay, keyboardMap, renderInstrument, renderAudio: CustomInstrumentAudio } = props;

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  function getNoteFromKeyboardKey(keyboardKey) {
    return keyboardMap[keyboardKey.toUpperCase()];
  }

  function handleKeyDown(event) {
    if (isRegularKey(event) && !event.repeat) {
      const note = getNoteFromKeyboardKey(event.key);
      if (note) {
        //startPlayingNote(note);
        props.PianoKeyDown(note);
      }
    }
  }

  function handleKeyUp(event) {
    if (isRegularKey(event)) {
      const note = getNoteFromKeyboardKey(event.key);
      if (note) {
        //stopPlayingNote(note);
        props.PianoKeyUp(note);
      }
    }
  }

  function startPlayingNote(note) {
    
    setNotesPlaying(notesPlaying => [...notesPlaying, note]);
  }

  function stopPlayingNote(note) {
    
    setNotesPlaying(notesPlaying => notesPlaying.filter(notePlaying => notePlaying !== note));
  }

  useEffect(() => {
    if (triggerNoteOnSound) {
      console.log("playing this note: " + noteNameToPlay);
      startPlayingNote(noteNameToPlay);
    }

  }, [triggerNoteOnSound]);

  useEffect(() => {
    if (triggerNoteOffSound) {
      console.log("stopping this note from playing: " + noteNameToPlay);
      stopPlayingNote(noteNameToPlay);
      console.log("notes playing: ", notesPlaying);
    }
  }, [triggerNoteOffSound]);

  const AudioComponent = CustomInstrumentAudio || InstrumentAudio;

  return (
    <>
      {renderInstrument({
        notesPlaying,
        onPlayNoteStart: startPlayingNote,
        onPlayNoteEnd: stopPlayingNote,
      })}
      <AudioComponent notes={notesPlaying} />
    </>
  );
}

Instrument.defaultProps = {
  keyboardMap: {},
};

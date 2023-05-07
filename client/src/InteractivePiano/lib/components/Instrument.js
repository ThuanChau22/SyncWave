import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WebMidi } from "webmidi";

import { midiMessageStateSetInput } from "redux/slices/midiMessageSlice";
import { selectMidiMessageMessage } from "redux/slices/midiMessageSlice";
import InstrumentAudio from "InteractivePiano/lib/components/InstrumentAudio";
import { MIDI_TO_NOTE, NOTE_TO_MIDI } from "InteractivePiano/lib/constants/constants";

export default function Instrument(props) {
  const [notesPlaying, setNotesPlaying] = useState([]);
  const {
    userId,
    keyboardMap,
    renderInstrument,
    renderAudio: CustomInstrumentAudio,
  } = props;
  const midiMessage = useSelector(selectMidiMessageMessage);
  const dispatch = useDispatch();

  const isRegularKey = (event) => {
    return !event.ctrlKey && !event.metaKey && !event.shiftKey;
  }

  const getNoteFromKeyboardKey = useCallback((keyboardKey) => {
    return keyboardMap[keyboardKey.toUpperCase()];
  }, [keyboardMap]);

  const handleKeyUp = useCallback((event) => {
    if (isRegularKey(event)) {
      const note = getNoteFromKeyboardKey(event.key);
      if (note) {
        //stopPlayingNote(note);
        const pitch = NOTE_TO_MIDI[note]; //Get the midi value that corresponds to the note
        const velocity = 0; // How hard the note is pressed
        const status = 128; // Note on
        dispatch(midiMessageStateSetInput({ status, pitch, velocity }));
      }
    }
  }, [dispatch, getNoteFromKeyboardKey]);

  const handleKeyDown = useCallback((event) => {
    if (isRegularKey(event) && !event.repeat) {
      const note = getNoteFromKeyboardKey(event.key);
      if (note) {
        //startPlayingNote(note);
        const pitch = NOTE_TO_MIDI[note]; //Get the midi value that corresponds to the note
        const velocity = 100; // How hard the note is pressed
        const status = 144; // Note on
        dispatch(midiMessageStateSetInput({ status, pitch, velocity }));
      }
    }
  }, [dispatch, getNoteFromKeyboardKey]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    // Enable webmidi
    const enableMidi = async () => {
      await WebMidi.enable();
      WebMidi.inputs.forEach((input) => {
        //for each input
        input.addListener("midimessage", (event) => {
          const [status, pitch, velocity] = event.message.data;
          dispatch(midiMessageStateSetInput({ status, pitch, velocity }));
        });
      });
    };
    enableMidi();
  }, [dispatch]);

  useEffect(() => {
    // MIDI message
    const { userId: senderUserId, value } = midiMessage;
    if (userId === senderUserId) {
      const { pitch, velocity } = value || {};
      //Get the note name from the midi message
      const noteName = MIDI_TO_NOTE[pitch];
      // Ignore incase of unknown midi note
      if (noteName == null) return;
      if (velocity > 0) {
        //start playing note
        startPlayingNote(noteName);
      } //END OF NOTE ON
      if (velocity === 0) {
        //stop playing note
        stopPlayingNote(noteName);
      } //END OF NOTE OFF
    }
  }, [userId, midiMessage]);

  function startPlayingNote(note) {
    setNotesPlaying((notesPlaying) => [...notesPlaying, note]);
  }

  function stopPlayingNote(note) {
    setNotesPlaying((notesPlaying) =>
      notesPlaying.filter((notePlaying) => notePlaying !== note)
    );
  }

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

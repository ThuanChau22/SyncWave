import React, { useState, useEffect } from "react";
import InstrumentAudio from "./InstrumentAudio";

import { WebMidi } from "webmidi";

import { useDispatch, useSelector } from "react-redux";

import {
  NOTES,
  VALID_KEYS,
  KEY_TO_NOTE,
  MIDI_TO_NOTE,
  NOTE_TO_KEY,
  NOTE_TO_MIDI,
} from "../constants/constants";

import { sessionStateSetInput } from "redux/slices/sessionSlice";
import { selectSessionMessage } from "redux/slices/sessionSlice";

function isRegularKey(event) {
  return !event.ctrlKey && !event.metaKey && !event.shiftKey;
}

export default function Instrument(props) {
  const [notesPlaying, setNotesPlaying] = useState([]);
  const {
    triggerNoteOnSound,
    triggerNoteOffSound,
    noteNameToPlay,
    keyboardMap,
    renderInstrument,
    renderAudio: CustomInstrumentAudio,
  } = props;

  const dispatch = useDispatch();
  const message = useSelector(selectSessionMessage);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  function getNoteFromKeyboardKey(keyboardKey) {
    return keyboardMap[keyboardKey.toUpperCase()];
  }

  useEffect(() => {
    // Enable webmidi
    const enableMidi = async () => {
      await WebMidi.enable();
      WebMidi.inputs.forEach((input) => {
        //for each input
        input.addListener("midimessage", (event) => {
          dispatch(sessionStateSetInput(event.message.data.toString()));
        });
      });
    };
    enableMidi();
  }, []);

  useEffect(() => {
    // MIDI message
    console.log({ message });

    const [STATUS, PITCH, VELOCITY] = message
      .split(",")
      .map((e) => parseInt(e));

    const noteName = MIDI_TO_NOTE[PITCH]; //Get the note name from the midi message
    if (noteName == null) return; //incase of unknown midi note, ignore
    if (VELOCITY > 0) {
      //start playing note
      startPlayingNote(noteName);
    } //ENDOF NOTE ON
    if (VELOCITY === 0) {
      //stop playing note
      stopPlayingNote(noteName);
    } //ENDOF NOTE OFF
  }, [message]);

  function handleKeyDown(event) {
    if (isRegularKey(event) && !event.repeat) {
      const note = getNoteFromKeyboardKey(event.key);
      if (note) {
        //startPlayingNote(note);
        const midi = NOTE_TO_MIDI[note]; //Get the midi value that corresponds to the note
        const velocity = 100; // How hard the note is pressed
        const status = 144; // Note on
        const message = [status, midi, velocity];

        dispatch(sessionStateSetInput(message.toString()));
      }
    }
  }

  function handleKeyUp(event) {
    if (isRegularKey(event)) {
      const note = getNoteFromKeyboardKey(event.key);
      if (note) {
        //stopPlayingNote(note);
        const midi = NOTE_TO_MIDI[note]; //Get the midi value that corresponds to the note
        const velocity = 0; // How hard the note is pressed
        const status = 128; // Note on
        const message = [status, midi, velocity];

        dispatch(sessionStateSetInput(message.toString()));
      }
    }
  }

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

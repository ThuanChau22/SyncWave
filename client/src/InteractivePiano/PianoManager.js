import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "../piano/components/Piano.css";
import { Key } from "../piano/components/Key.js";
import {
  NOTES,
  VALID_KEYS,
  KEY_TO_NOTE,
  MIDI_TO_NOTE,
  NOTE_TO_KEY,
  NOTE_TO_MIDI,
} from "../piano/global/constants";
import * as Tone from "tone";
import { WebMidi } from "webmidi";

import { sessionStateSetInput } from "redux/slices/sessionSlice";
import { selectSessionInput } from "redux/slices/sessionSlice";
import { selectSessionMessage } from "redux/slices/sessionSlice";

import InteractivePiano  from "./InteractivePiano";

export const PianoManager = () => {
  const message = useSelector(selectSessionInput);
  const [pressedKeys, setPressedKeys] = useState([]);
  const [pressedSynths, setPressedSynths] = useState({});
  const dispatch = useDispatch();
  
  const [triggerNoteOnSound, setTriggerNoteOnSound] = useState(0);
  const [triggerNoteOffSound, setTriggerNoteOffSound] = useState(0);
  const [noteNameToPlay, setNoteNameToPlay] = useState('');

  useEffect(() => {
    //On component mount
    // window.addEventListener("keydown", handleKeyDown); //Listen for keyboard press down
    // window.addEventListener("keyup", handleKeyUp); //Listen for keyboard press up

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
    console.log(message);
    
    const [STATUS, PITCH, VELOCITY] = message
      .split(",")
      .map((e) => parseInt(e));

    const noteName = MIDI_TO_NOTE[PITCH]; //Get the note name from the midi message
    if (noteName == null) return; //incase of unknown midi note, ignore
    console.log("set note name to" + noteName);
    setNoteNameToPlay((noteNameToPlay) => noteName);
    if (VELOCITY > 0) {
      //start playing note
      setTriggerNoteOnSound((triggerNoteOnSound) => triggerNoteOnSound + 1);
    } //ENDOF NOTE ON
    if (VELOCITY === 0) {
      //stop playing note
      setTriggerNoteOffSound((triggerNoteOnSound) => triggerNoteOnSound + 1);
    } //ENDOF NOTE OFF
    
    


  }, [message]);


  const sendMessage = (message) => {
    //Send the midi message to the WebSocket
    dispatch(sessionStateSetInput(message.toString()));
  };


  const handleChildPianoKeyUp = (note) => {
    console.log("Piano Manager Key Up: ", note);
    const midi = NOTE_TO_MIDI[note]; //Get the midi value that corresponds to the note
    const velocity = 0; // How hard the note is pressed
    const status = 128; // Note on
    sendMessage([status, midi, velocity]); //Send the Midi Message to WebSocket

    
  }
  const handleChildPianoKeyDown = (note) => {
    console.log("Piano Manager Key Down: ", note);
    const midiPitch = NOTE_TO_MIDI[note]; //Get the midi value that corresponds to the note
    const velocity = 100; // How hard the note is pressed
    const status = 144; // Note on
    sendMessage([status, midiPitch, velocity]); //Send the Midi Message to WebSocket

  }



  return (
    <div >
        <InteractivePiano noteNameToPlay={noteNameToPlay} triggerNoteOnSound={triggerNoteOnSound} triggerNoteOffSound={triggerNoteOffSound} PianoKeyUp={handleChildPianoKeyUp} PianoKeyDown={handleChildPianoKeyDown}/>
    </div>
  );
};

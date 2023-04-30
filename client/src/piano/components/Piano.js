import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./Piano.css";
import { Key } from "./Key.js";
import {
  NOTES,
  VALID_KEYS,
  KEY_TO_NOTE,
  MIDI_TO_NOTE,
  NOTE_TO_KEY,
  NOTE_TO_MIDI,
} from "../global/constants";
import * as Tone from "tone";
import { WebMidi } from "webmidi";

import { sessionStateSetInput } from "redux/slices/sessionSlice";
import { selectSessionInput } from "redux/slices/sessionSlice";
import { selectSessionMessage } from "redux/slices/sessionSlice";

export const Piano = () => {
  const message = useSelector(selectSessionInput);
  const [pressedKeys, setPressedKeys] = useState([]);
  const [pressedSynths, setPressedSynths] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    //On component mount
    window.addEventListener("keydown", handleKeyDown); //Listen for keyboard press down
    window.addEventListener("keyup", handleKeyUp); //Listen for keyboard press up

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
    if (VELOCITY > 0) {
      //NOTE ON
      //If midi note is pressed
      const key = NOTE_TO_KEY[noteName]; //Get the key from the note name
      if (pressedKeys.includes(key)) return; //If the key is already pressed, return
      //Else add the key to the pressed keys
      const updatedPressedKeys = [...pressedKeys];
      if (!updatedPressedKeys.includes(key) && VALID_KEYS.includes(key)) {
        //If the key is valid, add it to the pressed keys
        updatedPressedKeys.push(key);
      }
      setPressedKeys(updatedPressedKeys);
      const synth = new Tone.MembraneSynth().toDestination(); //Create a new synth
      synth.triggerAttack(noteName + "4"); //Play the note
      setPressedSynths({ ...pressedSynths, [noteName + "4"]: synth });
      // console.log("keydown press synth: ", noteName + "4"); //Log the key press
    } //ENDOF NOTE ON
    else if (VELOCITY === 0) {
      //NOTE OFF
      //If midi note is released
      //midi note off
      const noteName = MIDI_TO_NOTE[PITCH]; //Get the note name from the midi message
      const key = NOTE_TO_KEY[noteName]; //Get the key from the note name
      const index = pressedKeys.indexOf(key); //Get the index of the key in the pressed keys
      if (pressedKeys.length > 1) {
        // If there are more than one keys pressed
        const newPressedKeys = [...pressedKeys].splice(index, 1); // Remove the key from the pressed keys
        setPressedKeys(newPressedKeys);
      } else {
        //If there is only one key pressed
        setPressedKeys([]); //Remove the key from the pressed keys
      }
      // console.log("index: ", index);
      // console.log("new pressed keys:", pressedKeys);
      // console.log("index: ", index);
      // console.log("new pressed keys:", pressedKeys);
      // console.log("keyup press synth: ", noteName + "4");
      if (pressedSynths[noteName + "4"])
        pressedSynths[noteName + "4"].triggerRelease();
      setPressedSynths({ ...pressedSynths, [noteName + "4"]: null });
      
    } //ENDOF NOTE OFF
  }, [message]);

  const sendMessage = (message) => {
    //Send the midi message to the WebSocket
    dispatch(sessionStateSetInput(message.toString()));
  };

  const handleKeyDown = (event) => {
    //On key press down
    if (event.repeat) {
      return; //If key is held down, return
    }
    const key = event.key; //Get the key that was pressed
    const note = KEY_TO_NOTE[key]; //Get the note that corresponds to the key
    const midiPitch = NOTE_TO_MIDI[note]; //Get the midi value that corresponds to the note
    const velocity = 100; // How hard the note is pressed
    const status = 144; // Note on
    sendMessage([status, midiPitch, velocity]); //Send the Midi Message to WebSocket
  };

  const handleKeyUp = (event) => {
    //On key press up
    const key = event.key; //Get the key that was pressed
    const note = KEY_TO_NOTE[key]; //Get the note that corresponds to the key
    const midi = NOTE_TO_MIDI[note]; //Get the midi value that corresponds to the note
    const velocity = 0; // How hard the note is pressed
    const status = 128; // Note on
    sendMessage([status, midi, velocity]); //Send the Midi Message to WebSocket
  };

  const keys = _.map(NOTES, (note, index) => {
    return <Key key={index} note={note} pressedKeys={pressedKeys} />;
  });

  return (
    <div>
      <div className="piano">{keys}</div>
    </div>
  );
};

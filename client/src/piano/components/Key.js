import _ from 'lodash';
import React from 'react';

import './Key.css';
import { NOTE_TO_KEY } from '../global/constants';

class Key extends React.Component {
  noteIsFlat = (note) => { //Check if note is flat
    return note.length > 1; //If note is flat, it will be longer than 1 character
  }
  keyIsPressed = (note, pressedKeys) => { //Check if key is pressed
    return _.includes(pressedKeys, NOTE_TO_KEY[note]);
  }
  render() {  //Render the key
    let keyClassName = "key"; //Set the class name to key
    const noteIsFlat = this.noteIsFlat(this.props.note); //Check if note is flat
    const keyIsPressed = this.keyIsPressed(this.props.note, this.props.pressedKeys); //Check if key is pressed
    if (noteIsFlat) { //If note is flat, add flat to class name
      keyClassName += " flat"; 
    }
    if (keyIsPressed) { //If key is pressed, add pressed to class name
      keyClassName += " pressed";
    }

    let key; //Set key to null
    if (noteIsFlat) { //If note is flat, set key to null
      key = <div className={keyClassName}></div>;
    } else { //If note is not flat, set key to the note
      key = (
        <div className={keyClassName}>
          <div className="key-text">{this.props.note.toUpperCase()}</div>
        </div>
      );
    }
    return key;
  }
}
export { Key };

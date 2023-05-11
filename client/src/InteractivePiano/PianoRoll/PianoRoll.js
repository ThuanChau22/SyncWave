import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import pixiPianoRoll from "./pixiPianoRoll.js";
import { connect } from "react-redux";
import * as pixi from "pixi.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { selectRenderer, RendererSet } from "redux/slices/pixiAppSlice.js";

var PianoRoll = function PianoRoll(props, playbackRef) {
  const pianoRoll = pixiPianoRoll(props);

  var container = useRef();

  useImperativeHandle(playbackRef, function () {
    return pianoRoll.playback;
  });

  const canvasRef = useRef(null);
  useEffect(function () {
    container.current.replaceChildren(pianoRoll.view);
    // const app = new pixi.Application();
    // const pianoRollNew = pixiPianoRoll(props, app);
    // const canvas = canvasRef.current;
    // const stage = pianoRollNew.stage;
    // app.stage = stage;
    // app.canvasRef = canvasRef;
  });

  return React.createElement("div", {
    ref: container,
  });
};

export default forwardRef(PianoRoll);

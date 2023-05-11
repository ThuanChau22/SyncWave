import React, { useRef, useEffect, useState, useLayoutEffect } from "react";

import { animated, useSpring, config } from "react-spring";

import styled, { keyframes } from "styled-components";

import { useSelector } from "react-redux";
import { selectMidiMessageMessage } from "redux/slices/midiMessageSlice";

import "./PianoRoll.css";


function PianoRoll() {
  const canvasRef = useRef(null);

  const [notesToRender, setNotesToRender] = useState(false);
  const midiMessage = useSelector(selectMidiMessageMessage);

  const [notesToDraw, setNotesToDraw] = useState([]);
  const [timer, setTimer] = useState(0);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvasToDisplaySize = () => {
      //canvas.width = window.innerWidth;
      //canvas.height = window.innerHeight;
    };

    const drawNote = (x, y, length, selected = false) => {
      const w = canvas.scrollWidth;
      const h = canvas.scrollHeight;
      const cellwidth = w / 16;
      const cellheight = h / 20;

      x = x * cellwidth;
      y = y * cellheight;

      ctx.beginPath();
      ctx.fillStyle = "rgb(61,87,222)";

      if (selected) {
        ctx.strokeStyle = "rgb(228,231,250)";
      } else {
        ctx.strokeStyle = "rgb(131,148,233)";
      }

      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; // Set the shadow color
      ctx.rect(x, y, cellwidth * length, cellheight);
      ctx.fill();
      ctx.stroke();
    };

    const drawPlayHead = (x) => {
      const w = canvas.scrollWidth;
      const h = canvas.scrollHeight;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#db1616";
      ctx.lineTo(x, h);
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; // Set the shadow color
      ctx.stroke();
    };

    const drawPianoGrid = () => {
      const w = canvas.scrollWidth;
      const h = canvas.scrollHeight;
      const cellwidth = w / 16;
      const cellheight = h / 20;

      for (let y = 0; y < h; y += cellheight) {
        for (let x = 0; x < w; x += cellwidth) {
          // if (x % 8 === 0) {
          //   ctx.beginPath();
          //   ctx.moveTo(x, 0);

          //   ctx.lineWidth = 5;
          //   ctx.strokeStyle = "#ed5276";
          //   ctx.lineTo(x, h);

          //   ctx.stroke();

          //   ctx.lineWidth = 1.5;
          // }

          ctx.beginPath();

          if (Math.floor(y / cellheight) % 2 === 0) {
            //(y % (cellheight * 2) === 0)
            ctx.fillStyle = "rgb(32,35,44)";
          } else {
            ctx.fillStyle = "rgb(39,41,53)";
          }

          ctx.shadowBlur = 1.5;
          ctx.shadowColor = "rgba(0, 0, 0, 0.25)"; // Set the shadow color

          ctx.strokeStyle = "rgb(50,53,67)";
          ctx.rect(x, y, cellwidth, cellheight);
          ctx.fill();
          ctx.stroke();
        }
      }
    };

    const initializeCanvas = () => {
      if (canvas && canvasRef.current) {
        resizeCanvasToDisplaySize();
        drawPianoGrid();

        for(var i = 0; i < notesToDraw.length; i++)
        {
          const noteToDraw = notesToDraw[i];
          
          drawNote(noteToDraw[0], noteToDraw[1], noteToDraw[2]);
        }
      }
    };

    initializeCanvas();


  }, [notesToRender]);


  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
      //console.log("notestoDraw length: " + notesToDraw.length);
      for(var i = 0; i < notesToDraw.length; i++)
      {
        const newNotesToDraw = [...notesToDraw];
        newNotesToDraw[i][2] += 1;
        setNotesToDraw(newNotesToDraw);
        //console.log("checking notes to draw "+i+" : " + notesToDraw[i][2]);
      }
      setNotesToRender(!notesToRender);
    }, 500); // Timer increments every 1000 milliseconds (1 second)

    return () => {
      clearInterval(interval); // Clean up the interval when the component unmounts
    };
  }, [notesToDraw]);


 
  useEffect(() => {
    if (midiMessage.value) {
      console.log(midiMessage);

      const {pitch, status, velocity} = midiMessage.value;

      if(velocity > 0)
      {
        
        //if(notesToDraw.length === 0) setNotesToRender(!notesToRender);
        const x = 0;
        const y = pitch % 60;
        const length = 1;
        setNotesToDraw([...notesToDraw, [x, y, length]]);
      }
      else 
      {
        for(var i = 0; i < notesToDraw.length; i++)
        {
          const noteToDraw = notesToDraw[i];
          if(noteToDraw[1] === pitch % 60)
          {
            notesToDraw.splice(i, 1);
          }
        }
        //setClearNotes(!clearNotes);
      }
      setNotesToRender(!notesToRender);
      console.log(notesToDraw);
    }
  }, [midiMessage]);


  return (
    
      <div><div>Timer: {timer} seconds</div>
      <button onClick={() => setNotesToRender(!notesToRender)}>{notesToRender ? ("RENDER NOTE ON ") : ("SINGLE NOTE OFF")}</button>
      <canvas ref={canvasRef} width={800} height={400} /></div>

  );
}

export default PianoRoll;

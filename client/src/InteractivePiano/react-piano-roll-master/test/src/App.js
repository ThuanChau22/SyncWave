import React, { useRef } from "react";
import PianoRoll from "./dist/PianoRoll";

function App() {
  const playbackRef = useRef();

  window.addEventListener("keydown", ({ key }) => {
    if (key === " ") {
      playbackRef.current.toggle();
    } else if (key === "Enter") {
      playbackRef.current.seek("0:0:0");
    }
  });

  

  return (
    <div>
      <PianoRoll
        ref={playbackRef}
        width={1200}
        height={660}
        zoom={6}
        resolution={2}
        noteData={[
          ["0:0:0", "F5", ""],
          ["0:0:0", "C4", "2n"],
          ["0:0:0", "D4", "2n"],
          ["0:0:0", "E4", "2n"],
          ["0:2:0", "B4", "4n"],
          ["0:3:0", "A#4", "4n"],
          ["0:0:0", "F2", ""],
        ]}
      />
    </div>
  );
}

export default App;

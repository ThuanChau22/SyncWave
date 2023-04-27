import { useState } from "react";

import Session from "components/Session";

const App = () => {
  const [sessions, setSessions] = useState([]);

  const handleOnClick = () => {
    setSessions([...sessions, <Session />]);
  };

  return (
    <div>
      {sessions.length > 0 ?
        sessions.map((session, index) => {
          return <div key={index} >{session}</div>;
        })
        : <p>No session</p>
      }
      <button type="submit" onClick={handleOnClick}>Add Session</button>
    </div>
  );
}

export default App;

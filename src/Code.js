import { useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import { useContext } from "react";

import { Context } from "./App";
import "./Code.scss";

// code editor component
const Code = () => {
  const [isInput, setIsInput] = useState(false);
  const { input, setInput, output, setOutput } = useContext(Context);

  return (
    <div className="code">
      <div className="tabs">
        <button onClick={() => setIsInput(true)}>
          {isInput && "✔️"}
          Input
        </button>
        <button onClick={() => setIsInput(false)}>
          {!isInput && "✔️"}
          Output
        </button>
      </div>
      <AceEditor
        className="editor"
        mode="html"
        theme="tomorrow_night_eighties"
        value={isInput ? input : output}
        onChange={isInput ? setInput : setOutput}
        name="input_editor"
      />
    </div>
  );
};

export default Code;

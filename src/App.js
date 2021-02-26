import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";

import Left from "./Left";
import Right from "./Right";
import { process } from "./util";
import "./App.scss";

export const Context = createContext({});

const App = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    setOutput(process(input));
  }, [input]);

  return (
    <Context.Provider value={{ input, setInput, output, setOutput }}>
      <Left />
      <Right />
    </Context.Provider>
  );
};

export default App;

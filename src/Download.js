import { useContext } from "react";

import { Context } from "./App";

// download component
const Download = () => {
  const { output } = useContext(Context);

  // on button click
  const onClick = () => {
    const blob = new Blob([output], { type: "image/svg+xml" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = url;
    link.download = "icon.svg";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // render component
  return (
    <button className="download" onClick={onClick}>
      📥 Download
    </button>
  );
};

export default Download;

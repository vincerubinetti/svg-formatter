import { useState } from "react";
import { useContext } from "react";

import { Context } from "./App";
import { parse } from "./util";
import "./Preview.scss";

const grid = 10;

const Preview = () => {
  let [checkered, setCheckered] = useState(true);
  let [light, setLight] = useState(true);
  let { output } = useContext(Context);

  const viewBox = parse(output)?.getAttribute("viewBox") || "";
  const [x = -50, y = -50, width = 100, height = 100] = viewBox
    .split(/\s/)
    .map((n) => n.trim())
    .filter((n) => n)
    .map((n) => Number(n));

  const [left, top, right, bottom] = [
    Math.floor(x / grid),
    Math.floor(y / grid),
    Math.ceil((x + width) / grid),
    Math.ceil((y + height) / grid),
  ];

  const squares = [];
  for (let x = left; x < right; x++) {
    for (let y = top; y < bottom; y++) {
      if (Math.abs(x % 2) === (Math.abs(y % 2) === 0 ? 1 : 0))
        squares.push(
          <rect
            key={`${x}-${y}`}
            className="mark"
            x={x * grid}
            y={y * grid}
            width={grid}
            height={grid}
            clipPath="url(#clip)"
          />
        );
    }
  }
  return (
    <div className="preview">
      <div className="controls">
        <button onClick={() => setLight(!light)}>{light && "✔️"} Light</button>
        <button onClick={() => setCheckered(!checkered)}>
          {checkered && "✔️"} Checkered
        </button>
      </div>
      <div className="image">
        <div className="background" data-light={light}>
          <svg viewBox={`${x} ${y} ${width} ${height}`}>
            <defs>
              <clipPath id="clip">
                <rect x={x} y={y} width={width} height={height} />
              </clipPath>
            </defs>
            <rect className="fill" x={x} y={y} width={width} height={height} />
            {checkered && (
              <g className="marks">
                <circle className="mark" cx={0} cy={0} r={grid / 4} />
                {squares}
              </g>
            )}
          </svg>
        </div>
        <div
          className="foreground"
          dangerouslySetInnerHTML={{ __html: output }}
        />
      </div>
    </div>
  );
};

export default Preview;

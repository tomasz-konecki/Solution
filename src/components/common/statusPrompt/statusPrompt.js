import React from "react";
import "./statusPrompt.scss";

const statusPrompt = ({ result, error, message }) => (
  <p
    className={`small-operation-prompt ${result
      ? "prompt-succ"
      : "prompt-fail"}`}
  >
    {result ? message : error}
  </p>
);

export default statusPrompt;

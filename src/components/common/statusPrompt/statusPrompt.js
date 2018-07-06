import React from "react";
import "./statusPrompt.scss";

const statusPrompt = ({ result, error }) => (
  <p
    className={`small-operation-prompt ${result
      ? "prompt-succ"
      : "prompt-fail"}`}
  >
    {result ? "Przygotowanie do logowania powiodło się" : error}
  </p>
);

export default statusPrompt;

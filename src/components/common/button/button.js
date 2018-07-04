import React from "react";
import "./button.scss";

const button = ({ title, onClick, mainClass, ...props }) => (
  <button onClick={onClick} className={mainClass + " " + { ...props }}>
    {title}
  </button>
);

export default button;

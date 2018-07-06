import React from "react";
import "./button.scss";

const button = ({ title, onClick, mainClass, disable, children, ...props }) => (
  <button disabled={disable}
  onClick={onClick} className={mainClass + " " + { ...props }}>
    {children}
    {title}
  </button>
);

export default button;

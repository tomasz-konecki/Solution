import React from "react";

const Icon = ({iconType = "fas", iconSize = "lg", icon}) => {
  return (
    <i className={iconType + " fa-" + icon + " fa-" + iconSize}/>
  );
};

export default Icon;


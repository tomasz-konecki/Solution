import React from "react";

const Icon = (props) => {
  return (
    <i className={props.iconType + " fa-" + props.icon}/>
  );
};

export default Icon;


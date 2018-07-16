import React from "react";
import PropTypes from "prop-types";

import "scss/components/common/Icon.scss";

const Icon = ({
  iconType = "fas",
  iconSize = "",
  icon,
  additionalClass = ""
}) => {
  return (
    <i
      className={
        iconType +
        " fa-" +
        icon +
        (iconSize !== "" ? " fa-" + iconSize : "") +
        " " +
        additionalClass
      }
    />
  );
};

Icon.propTypes = {
  iconType: PropTypes.string,
  iconSize: PropTypes.string,
  additionalClass: PropTypes.string,
  icon: PropTypes.string
};

export default Icon;

import React from "react";
import "./activateCheckbox.scss";

const activateCheckbox = ({shouldShowDeleted, showDeleted, addClass}) => (
  <div
  className={`${addClass ? addClass : null} quater-check-container`}>
    <label>Pokaż usunięte</label>
    <input
      type="checkbox"
      checked={shouldShowDeleted}
      onClick={showDeleted}
    />
  </div>
);

export default activateCheckbox;

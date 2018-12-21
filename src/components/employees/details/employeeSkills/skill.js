import React from "react";
import Button from "../../../common/button/button";
const skill = ({
  createSpans,
  skillName,
  markupWidth,
  background,
  arrayElementIndex,
  experience,
  increaseYears,
  downgradeYears,
  showSavePrompt,
  removeSkill
}) => (
  <li>
    <label>
      {skillName} {showSavePrompt && <i className="fa fa-save" />}
    </label>
    <div className="spans-container">
      {createSpans(arrayElementIndex)}
      <div
        style={{ width: `${markupWidth}%`, background: `${background}` }}
        className="progress-markup"
      />
      <div className="years-of-expierience">
        <div>
          <b>{experience}</b>
          <i className="fa fa-clock" />
          <i onClick={increaseYears} className="fa fa-arrow-up" />
          <i onClick={downgradeYears} className="fa fa-arrow-down" />
          <i onClick={removeSkill} className="fa fa-trash"></i>
        </div>
      </div>
    </div>
  </li>
);

export default skill;

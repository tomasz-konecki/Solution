import React from "react";
import Button from "../../../common/button/button";
import { translate } from 'react-translate';
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
  removeSkill,
  t
}) => (
  <li>
    <label title={t("SkillName")}>
      {skillName}
    </label>
    <div className="spans-container" title={t("SkillLevel")}>
      {createSpans(arrayElementIndex)}
      <div
        style={{ width: `${markupWidth}%`, background: `${background}` }}
        className="progress-markup"
      />
      <div className="years-of-expierience">
        <div>
          <b title={t("YearsOfExperience")}>{experience}</b>
          <i title={t("YearsOfExperience")} className="fa fa-clock" />
          <i title={t("PutYear")} onClick={increaseYears} className="fa fa-arrow-up" />
          <i title={t("PopYear")} onClick={downgradeYears} className="fa fa-arrow-down" />
          <i title={t("DeleteSkill")} onClick={removeSkill} className="fa fa-trash"></i>
          {showSavePrompt && <i title={t("ChangedThings")} className="fa fa-save" />}
        </div>
      </div>
    </div>
  </li>
);
export default translate("Skill")(skill);

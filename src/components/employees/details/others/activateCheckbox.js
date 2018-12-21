import React from "react";
import "./activateCheckbox.scss";
import { translate } from "react-translate";

const activateCheckbox = ({ shouldShowDeleted, showDeleted, addClass, t }) => (
  <div className={`${addClass ? addClass : null} quater-check-container`}>
    <label>{t("ShowDeleted")}</label>
    <input type="checkbox" checked={shouldShowDeleted} onClick={showDeleted} />
  </div>
);

export default translate("ActivateCheckbox")(activateCheckbox);

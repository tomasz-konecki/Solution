import React, { Component } from "react";
import "./ShowRadioButtons.scss";

export default class ShowRadioButtons extends Component {
  render() {
    const { t, radioButtonClick, checked, radioButtonSingleClick } = this.props;
    return (
      <div className="show-clients-container">
        <form>
          <span className="smooth-radio-span">
            <input
              onChange={e => radioButtonClick(e.target.value)}
              onClick={e => radioButtonSingleClick(e.target.value)}
              name="show-clients"
              className="toggle toggle-left"
              id="show-activated"
              type="radio"
              value="activated"
              checked={checked === "activated"}
            />
            <label
              className="btn smooth-radio-button1"
              htmlFor="show-activated"
            >
              {t("Activated")}
            </label>
          </span>
          <span className="smooth-radio-span">
            <input
              onClick={e => radioButtonSingleClick(e.target.value)}
              onChange={e => radioButtonClick(e.target.value)}
              name="show-clients"
              className="toggle toggle-right"
              id="show-not-activated"
              type="radio"
              value="not-activated"
              checked={checked === "not-activated"}
            />
            <label
              className="btn smooth-radio-button3"
              htmlFor="show-not-activated"
            >
              {t("NotActivated")}
            </label>
          </span>
        </form>
      </div>
    );
  }
}

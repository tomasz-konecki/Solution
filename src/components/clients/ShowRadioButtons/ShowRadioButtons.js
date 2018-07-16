import React, { Component } from "react";

export default class ShowRadioButtons extends Component {
  render() {
    const { t, radioButtonClick, checked } = this.props;
    return (
      <div className="show-clients-container">
        <form>
          <input
            onChange={e => radioButtonClick(e.target.value)}
            name="show-clients"
            className="toggle toggle-left"
            id="show-activated"
            type="radio"
            value="activated"
            checked={checked === "activated"}
          />
          <label className="btn" htmlFor="show-activated">
            {t("Activated")}
          </label>
          <input
            onChange={e => radioButtonClick(e.target.value)}
            name="show-clients"
            className="toggle toggle-right"
            id="show-not-activated"
            type="radio"
            value="not-activated"
            checked={checked === "not-activated"}
          />
          <label className="btn" htmlFor="show-not-activated">
            {t("NotActivated")}
          </label>
        </form>
      </div>
    );
  }
}

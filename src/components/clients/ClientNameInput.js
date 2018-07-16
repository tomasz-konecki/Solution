import React, { Component } from "react";
import { validateInput } from "../../services/validation";
import Aux from "../../services/auxilary";

class ClientNameInput extends Component {
  state = { value: this.props.value, errors: null };

  test() {
    console.log("kupa");
  }

  onInputChange = (e, handleGetValueFromInput) => {
    e.preventDefault();
    let inputValue = e.target.value;

    let inputErrors = validateInput(
      inputValue,
      false,
      3,
      20,
      "client",
      "nazwa"
    );

    handleGetValueFromInput(inputValue, inputErrors);
    this.setState({ value: inputValue, errors: inputErrors });
  };

  render() {
    let { value, errors } = this.state;
    let { handleGetValueFromInput } = this.props;
    return (
      <Aux>
        <input
          value={value}
          onChange={e => this.onInputChange(e, handleGetValueFromInput)}
        />
        {errors && <div className="client-name-input-error">{errors}</div>}
      </Aux>
    );
  }
}

export default ClientNameInput;

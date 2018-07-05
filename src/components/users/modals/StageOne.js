import React, { Component } from "react";
import "../../../scss/components/users/modals/StageOne.scss";
import FoundUsersTable from "../FoundUsersTable";
import LoaderHorizontal from "../../../components/common/LoaderHorizontal";
import ResultBlock from "../../common/ResultBlock";
import Select from "react-select";
import "react-select/dist/react-select.css";
import PropTypes from "prop-types";
import { translate } from "react-translate";
import WebApi from "../../../api";

class StageOne extends Component {
  constructor() {
    super();

    this.state = {
      backspaceRemoves: true,
      multi: false,
      isLoading: false,
      userExists: false
    };
  }

  handleChange = value => {
    !value && this.setState({ value: null });
    value &&
      WebApi.users.get
        .byUser(value.id)
        .then(response => {
          this.setState({
            userExists: true
          });
        })
        .catch(error => {
          this.setState({
            value,
            userExists: false
          });
        });
  };

  checkLength = input => {
    return input.length >= 3;
  };

  getUsers = input => {
    let isLoading = null;
    this.checkLength(input) ? (isLoading = true) : (isLoading = false);

    this.setState({
      isLoading
    });

    return this.checkLength(input)
      ? this.props.getUsers(input).then(
          this.setState({
            isLoading: false
          })
        )
      : Promise.resolve({ options: [] });
  };

  handleClick = value => {
    this.props.setSelectedUser(this.state.value);
  };

  render() {
    const { t } = this.props;
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;
    const { multi, value, backspaceRemoves, isLoading } = this.state;
    return (
      <div className="stage-one-container">
        <header>
          <h3 className="section-heading">{t("SearchAD")}</h3>
        </header>
        <div className="search-container">
          <AsyncComponent
            multi={multi}
            value={value}
            autoload={false}
            isLoading={isLoading}
            onChange={this.handleChange}
            // valueKey="lastName"
            labelKey="fullName"
            placeholder={t("SelectUser")}
            loadOptions={this.getUsers}
            backspaceRemoves={backspaceRemoves}
            clearable={true}
            clearValueText={t("Remove")}
          />

          {this.state.value && (
            <div className="forward-button-container">
              <button
                className="btn btn-primary dcmt-button"
                onClick={this.handleClick}
              >
                {t("Next")}
              </button>
            </div>
          )}
        </div>
        {this.state.userExists && (
          <p
            style={{
              width: "100%",
              textAlign: "center",
              color: "red",
              lineHeight: "100px"
            }}
          >
            {t("HasAccount")}
          </p>
        )}

        {this.props.errorBlock &&
          this.props.errorBlock.replyBlock !== undefined &&
          this.props.errorBlock.replyBlock.status !== 200 && (
            <div className="error-block-container">
              {this.props.errorBlock !== null && (
                <ResultBlock
                  errorBlock={this.props.errorBlock}
                  errorMessage={t("UserNotFoundInAD")}
                />
              )}
            </div>
          )}
      </div>
    );
  }
}

StageOne.propTypes = {
  getUsers: PropTypes.func.isRequired,
  setSelectedUser: PropTypes.func.isRequired,
  errorBlock: PropTypes.object
};

export default translate("StageOne")(StageOne);

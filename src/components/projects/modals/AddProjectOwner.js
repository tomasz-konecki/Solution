import React, { Component } from 'react';
import WebApi from "../../../api";
import Select from "react-select";
import "react-select/dist/react-select.css";
import ResultBlock from './../../common/ResultBlock';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

class AddProjectOwner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backspaceRemoves: true,
      multi: true,
      isLoading: false,
      value: [],
      errorBlock: null,
      ok: false
    };
  }

  completeOwnersSelection = () => {
    const newOwners =  this.state.value;
    let newOwnersArray = [];

    newOwners.map((owner, index) => {
      newOwnersArray.push(owner.id);
    });

    return (event) => WebApi.projects.put.owner(this.props.project.id, newOwnersArray)
      .then(response => {
        this.setState({
          errorBlock: response
        });
        this.props.completed(true);
      })
      .catch(errorBlock => {
        this.setState({ errorBlock });
      });
  }

  handleChange = value => {
    this.setState({
      value
    });
  };

  checkLength = input => {
    return input.length >= 3;
  };

  getUsers = user => {
    return WebApi.users.post.list({
      Limit: 20,
      PageNumber: 1,
      IsDeleted: false,
      Query: user
    })
      .then(response => {
        return { options: response.extractData().results };
      })
      .then(
        this.setState({
          errorBlock: null
        })
      )
      .catch(errorBlock => {
        this.setState({ errorBlock });
      });
  };

  doSearch = input => {
    let isLoading = null;
    this.checkLength(input) ? (isLoading = true) : (isLoading = false);

    this.setState({
      isLoading
    });

    return this.checkLength(input)
      ? this.getUsers(input).then(
          this.setState({
            isLoading: false
          })
        )
      : Promise.resolve({ options: [] });
  };

  render() {
    const { t } = this.props;
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;
    const { multi, value, backspaceRemoves, isLoading } = this.state;
    return (
      <div>
        <header>
          <h3 className="section-heading">{t("AddOwner")}</h3>
        </header>
        <hr/>
        <AsyncComponent
            multi={multi}
            value={value}
            autoload={false}
            isLoading={isLoading}
            onChange={this.handleChange}
            labelKey="fullName"
            loadOptions={this.doSearch}
            backspaceRemoves={backspaceRemoves}
            valueKey="id"
          />
          <hr/>
          <div className="row">
            <div className="col-sm-10">
              <ResultBlock
                errorBlock={this.state.errorBlock}
                errorOnly={false}
                successMessage={t("OwnersAddedSuccessfully")}
              />
            </div>
            <div className="col-sm-2">
            {
              this.state.value.length > 0 ?
              <button onClick={this.completeOwnersSelection(this.state.value)} className="dcmt-button button-success">{t("Add")}</button>
              : null
            }
            </div>
          </div>
      </div>
    );
  }
}

AddProjectOwner.propTypes = {
  project: PropTypes.object.isRequired,
  completed: PropTypes.func.isRequired
};

export default translate("AddProjectOwner")(AddProjectOwner);

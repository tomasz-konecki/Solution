import React, { Component } from "react";
import { connect } from "react-redux";
import "./ReportsContainer.scss";
import {
  getTeamsACreator,
  generateDevsReportACreator,
  generateDevsReport,
  getReportACreator,
  getReport,
  googleDriveLogIn
} from "../../actions/reportsActions";
import Spinner from "../common/spinner/spinner";
import Modal from "react-responsive-modal";
import SpinnerButton from "../form/spinner-btn/spinner-btn";
import { validateReportPages } from "services/validation";
import OperationStatusPrompt from "../form/operationStatusPrompt/operationStatusPrompt";
import Navigation from "./navigation/navigation";
import StatusPrompt from "../common/statusPrompt/statusPrompt";
import Button from "../common/button/button";
class ReportsContainer extends Component {
  state = {
    spinner: true,
    addList: [],
    baseList: [],
    helpList: [],
    reportModal: false,
    pagesList: [],
    didPagesHasIncorrectValues: { status: null, error: "" },
    isGenReport: false,
    generateLink: true,
    isDownloading: false,

    valueToSearch: ""
  };
  componentDidMount() {
    this.props.getTeams();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.teams !== nextProps.teams && nextProps.teams.length !== 0) {
      this.setState({
        spinner: false,
        baseList: [...nextProps.teams],
        helpList: [...nextProps.teams]
      });
    } else if (
      this.props.loadTeamsErrors !== nextProps.loadTeamsErrors ||
      this.props.genReportErrors !== nextProps.genReportErrors ||
      this.props.getReportErrors !== nextProps.getReportErrors ||
      this.props.gDriveLoginErrors !== nextProps.gDriveLoginErrors
    ) {
      if (nextProps.getReportStatus === true && this.state.isDownloading) {
        const url = nextProps.getReportDownloadLink;
        window.location.href = url;
        this.props.getReportClear("", null, []);
      }
      this.setState({
        spinner: false,
        isGenReport: false,
        isDownloading: false
      });
    }
  }
  addTeamToResultList = name => {
    const addList = [...this.state.addList];
    const helpList = [...this.state.helpList];
    const baseList = [...this.state.baseList];
    const index = this.state.baseList.findIndex(i => {
      return i.name === name;
    });
    const helpListIndex = this.state.helpList.findIndex(i => {
      return i.name === name;
    });
    const helpBaseListIndex = this.state.baseList.findIndex(i => {
      return i.name === name;
    });
    helpList.splice(helpListIndex, 1);
    addList.push(this.state.baseList[index]);
    baseList.splice(helpBaseListIndex, 1);
    this.setState({ addList: addList, helpList: helpList, baseList: baseList });
  };
  deleteTeamFromResultList = index => {
    const addList = [...this.state.addList];
    const baseList = [...this.state.baseList];
    const helpList = [...this.state.helpList];
    const pagesList = [...this.state.pagesList];
    helpList.push(addList[index]);
    baseList.push(addList[index]);
    addList.splice(index, 1);
    pagesList.splice(index, 1);

    this.setState({
      addList: addList,
      baseList: baseList,
      reportModal: addList.length > 0 ? true : false,
      helpList: helpList
    });
  };
  generateReport = () => {
    const pagesValid = this.validateForError();
    if (pagesValid.status)
      this.setState({ didPagesHasIncorrectValues: pagesValid });
    else {
      this.setState({
        isGenReport: true,
        didPagesHasIncorrectValues: pagesValid
      });
      this.props.generateDevsReport(
        this.state.addList,
        this.state.pagesList,
        this.state.generateLink
      );
    }
  };
  validateForError = () => {
    const didPagesHasIncorrectValues = {
      ...this.state.didPagesHasIncorrectValues
    };
    let error = "";
    for (let key in this.state.pagesList) {
      if (this.state.pagesList[key].error)
        error = this.state.pagesList[key].error;
    }
    didPagesHasIncorrectValues.error = error;
    didPagesHasIncorrectValues.status = error ? true : null;
    return didPagesHasIncorrectValues;
  };
  openReportsModals = () => {
    const pagesList = [];
    for (let i = 0; i < this.state.addList.length; i++)
      pagesList[i] = { value: 1, error: "" };
    const didPagesHasIncorrectValues = {
      ...this.state.didPagesHasIncorrectValues
    };
    didPagesHasIncorrectValues.error = "";
    didPagesHasIncorrectValues.status = null;
    this.setState({
      pagesList: pagesList,
      reportModal: true,
      didPagesHasIncorrectValues: didPagesHasIncorrectValues
    });
  };
  onChangeReportPages = (e, index) => {
    const pagesList = [...this.state.pagesList];
    if (e.target.value.length >= 1) {
      const convertedValue = Number(e.target.value);
      const validation = validateReportPages(convertedValue);
      const didPagesHasIncorrectValues = {
        ...this.state.didPagesHasIncorrectValues
      };
      if (validation !== "") {
        pagesList[index] = { value: e.target.value, error: validation };
        didPagesHasIncorrectValues.status = false;
      } else {
        pagesList[index] = { value: convertedValue, error: "" };
        didPagesHasIncorrectValues.status = true;
      }
      this.setState({
        pagesList: pagesList,
        didPagesHasIncorrectValues: didPagesHasIncorrectValues
      });
    }
  };
  handleCheckboxChange = () => {
    this.setState({ generateLink: !this.state.generateLink });
  };
  searchInTeamList = e => {
    const searchedItems = [];
    for (let key in this.state.helpList)
      if (this.state.helpList[key].name.search(e.target.value) !== -1)
        searchedItems.push(this.state.helpList[key]);
    this.setState({ baseList: searchedItems, valueToSearch: e.target.value });
  };
  closeReportModal = () => {
    this.setState({ reportModal: false });
    if (this.props.genReportStatus)
      this.props.generateDevsReportClear(null, null, []);
    if (this.props.gDriveRedirectLink)
      this.props.googleDriveLogInClear("", null, []);
  };
  downloadReport = () => {
    this.setState({ isDownloading: true });
    this.props.getReport(this.props.genReportResp);
  };
  render() {
    return (
      <div className="reports-container">
        {this.state.spinner || (
          <Navigation
            addListLength={this.state.addList.length}
            baseListLength={this.state.baseList.length}
            searchInTeamList={e => this.searchInTeamList(e)}
            openReportsModals={this.openReportsModals}
          />
        )}

        {this.state.spinner ? (
          <Spinner />
        ) : this.props.loadTeamsResult ? (
          <div className="reports-content-container">
            <div className="caffels-container">
              {this.state.baseList.length > 0 ? (
                this.state.baseList.map(i => {
                  return (
                    <div
                      onClick={() => this.addTeamToResultList(i.name)}
                      key={i.name}
                      className="caffel"
                    >
                      {i.name}
                    </div>
                  );
                })
              ) : (
                <p className="server-error">Nie znaleziono wyników </p>
              )}
            </div>
          </div>
        ) : (
          <p>{this.props.loadTeamsErrors[0]}</p>
        )}
        {this.state.reportModal && (
          <Modal
            key={1}
            open={this.state.reportModal}
            classNames={{ modal: "Modal Modal-report-modal" }}
            contentLabel="Generate report modal"
            onClose={this.closeReportModal}
          >
            <h3>Wybierz numery stron dla poszczególnych raportów</h3>
            <ul className="reports-items-list">
              {this.state.addList.map((i, index) => {
                return (
                  <li
                    className={
                      this.state.pagesList[index].error ? "inc-list-item" : null
                    }
                    key={index}
                  >
                    <b>{i.name}</b>
                    <i
                      onClick={() => this.deleteTeamFromResultList(index)}
                      className="fa fa-minus"
                    />
                    <input
                      value={this.state.pagesList[index].value}
                      type="text"
                      onChange={e => this.onChangeReportPages(e, index)}
                    />
                  </li>
                );
              })}
            </ul>
            {!this.props.genReportStatus && (
              <div className="checkbox-container">
                <label>Generować link do pobrania?</label>
                <input
                  name="isGoing"
                  type="checkbox"
                  checked={this.state.generateLink}
                  onChange={this.handleCheckboxChange}
                />
              </div>
            )}
            {!this.props.gDriveRedirectLink ? (
              <SpinnerButton
                validationResult={this.state.didPagesHasIncorrectValues.status}
                onClickHandler={this.generateReport}
                isLoading={this.state.isGenReport}
                shouldSubmit={false}
                btnTitle="Generuj"
                submitResult={{
                  status: this.props.genReportStatus,
                  content: this.props.genReportStatus
                    ? "Raport został wygenerowany"
                    : this.props.genReportErrors[0]
                }}
              />
            ) : (
              <Button
                onClick={() => {
                  window.open(this.props.gDriveRedirectLink);
                }}
                mainClass="log-in-btn"
                title="Przejdź do logowania"
              />
            )}

            {this.props.genReportStatus && (
              <Button
                onClick={this.downloadReport}
                mainClass="download-report-btn"
                title="Pobierz raport"
              />
            )}

            {this.props.gDriveLoginResult !== null && (
              <StatusPrompt
                error={this.props.gDriveLoginErrors[0]}
                result={this.props.gDriveLoginResult}
              />
            )}
          </Modal>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    teams: state.reportsReducer.teams,
    loadTeamsResult: state.reportsReducer.loadTeamsResult,
    loadTeamsErrors: state.reportsReducer.loadTeamsErrors,

    genReportResp: state.reportsReducer.genReportResp,
    genReportStatus: state.reportsReducer.genReportStatus,
    genReportErrors: state.reportsReducer.genReportErrors,

    getReportDownloadLink: state.reportsReducer.getReportDownloadLink,
    getReportStatus: state.reportsReducer.getReportStatus,
    getReportErrors: state.reportsReducer.getReportErrors,

    gDriveRedirectLink: state.reportsReducer.gDriveRedirectLink,
    gDriveLoginResult: state.reportsReducer.gDriveLoginResult,
    gDriveLoginErrors: state.reportsReducer.gDriveLoginErrors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeams: () => dispatch(getTeamsACreator()),
    generateDevsReport: (listOfAddedTeams, listOfPages, shouldGenerateLink) =>
      dispatch(
        generateDevsReportACreator(
          listOfAddedTeams,
          listOfPages,
          shouldGenerateLink
        )
      ),
    generateDevsReportClear: (
      genReportResp,
      genReportStatus,
      genReportErrors
    ) =>
      dispatch(
        generateDevsReport(genReportResp, genReportStatus, genReportErrors)
      ),
    getReport: fileName => dispatch(getReportACreator(fileName)),
    getReportClear: (getReportDownloadLink, getReportStatus, getReportErrors) =>
      dispatch(
        getReport(getReportDownloadLink, getReportStatus, getReportErrors)
      ),
    googleDriveLogInClear: (
      gDriveRedirectLink,
      gDriveLoginResult,
      gDriveLoginErrors
    ) =>
      dispatch(
        googleDriveLogIn(
          gDriveRedirectLink,
          gDriveLoginResult,
          gDriveLoginErrors
        )
      )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportsContainer);
